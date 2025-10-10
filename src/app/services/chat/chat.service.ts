import { inject, Injectable, signal } from "@angular/core";
import type { Message, WSMessage } from "../../models/message.models";
import type { CreateRoomRequest, Room } from "../../models/rooms.models";
import { RoomService } from "../room/room.service";
import { WebsocketService } from "./ws.service";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private wsService = inject(WebsocketService);
  private roomService = inject(RoomService);

  roomChanged = signal(0);

  messages: Message[] = [];
  typingUsers: string[] = [];

  ngOnDestroy() {
    this.wsService.close();
  }

  sendMessage(content: string) {
    const roomId = this.roomService.selectedRoom()?.id;

    if (!roomId || !this.wsService.connected) {
      return "Not connected";
    }

    if (content.trim().length > 0) {
      const message: WSMessage = {
        type: "message",
        payload: {
          action: "send_message",
          room_id: roomId,
          content,
        },
      };

      this.wsService.sendMessage(message);
      return null;
    }
    return "Too small";
  }

  selectRoom(room: Room) {
    if (!this.wsService.connected) {
      return "Not connected";
    }

    this.roomService.selectRoom(room);
    this.messages = [];
    this.typingUsers = [];

    if (room) {
      this.wsService.sendMessage({
        type: "connection",
        payload: { action: "join_room", room_id: room.id },
      });
    }
    return null;
  }

  selectRoomId(roomId: string) {
    this.roomService.getRoom(roomId).subscribe((room) => {
      if (!room) return;

      this.roomService.selectRoom(room);
      this.messages = [];
      this.typingUsers = [];

      this.wsService.sendMessage({
        type: "connection",
        payload: { action: "join_room", room_id: roomId },
      });
    });
    return null;
  }

  createRoom(data: CreateRoomRequest) {
    const obs = this.roomService.createRoom(data);

    obs.subscribe({
      next: (room) => {
        this.roomChanged.update((n) => n + 1);
        this.selectRoom(room);
      },
      error: (error) => {
        console.error("Error creating room:", error);
      },
    });

    return obs;
  }

  joinRoom(newRoomId: string) {
    if (!this.wsService.connected) {
      return "Not connected";
    }

    this.roomService.getRoom(newRoomId).subscribe((room) => {
      if (!room) return;

      this.roomService.selectRoom(room);
      this.roomService.joinRoom(room.id).subscribe({
        next: () => {
          this.roomChanged.update((n) => n + 1);
          this.messages = [];
          this.typingUsers = [];

          this.wsService.sendMessage(
            JSON.stringify({
              type: "connection",
              payload: { action: "join_room", room_id: newRoomId },
            })
          );
        },
      });
    });
    return null;
  }

  leaveRoom() {
    const roomId = this.roomService.selectedRoom()?.id;

    if (!roomId || !this.wsService.connected) {
      return "Not connected";
    }

    this.wsService.sendMessage(
      JSON.stringify({
        type: "connection",
        payload: { action: "leave_room", room_id: roomId },
      })
    );

    this.roomChanged.update((n) => n + 1);
    this.messages = [];
    this.typingUsers = [];

    this.roomService.selectRoom(null);
    return null;
  }

  connect() {
    const wsConn = this.wsService.connect();

    wsConn.subscribe({
      next: (message) => {
        try {
          switch (message.type) {
            case "new_message":
              this.messages = [
                message.data,
                ...(Array.isArray(this.messages) ? this.messages : []),
              ];
              break;
            case "typing":
              this.typingUsers = message.users || [];
              break;
          }
        } catch {}
      },
      error: (err) => {
        console.error("WebSocket error:", err);
        this.messages = [];
        this.typingUsers = [];
        this.roomService.selectRoom(null);
      },
      complete: () => {
        console.log("WebSocket connection closed");
        this.messages = [];
        this.typingUsers = [];
        this.roomService.selectRoom(null);
      },
    });

    return wsConn;
  }
}
