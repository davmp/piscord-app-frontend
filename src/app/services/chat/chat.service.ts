import { inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  catchError,
  Observable,
  shareReplay,
  Subject,
  tap,
  throwError,
} from "rxjs";
import type { SendMessage, WSMessage } from "../../models/message.models";
import type {
  CreateRoomRequest,
  Room,
  RoomDetails,
  UpdateRoomRequest,
} from "../../models/rooms.models";
import { RoomService } from "../room/room.service";
import { AuthService } from "../user/auth/auth.service";
import { WebsocketService } from "./ws.service";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private wsService = inject(WebsocketService);
  private authService = inject(AuthService);
  private roomService = inject(RoomService);

  private roomsChanged$!: Observable<void>;
  private rooms$ = new Subject<void>();
  private currentRoom = signal(this.roomService.selectedRoom.value);
  typingUsers: string[] = [];

  constructor() {
    this.roomService.selectedRoom
      .pipe(takeUntilDestroyed())
      .subscribe((room) => this.currentRoom.set(room));
  }

  ngOnDestroy() {
    this.wsService.close();
  }

  roomsChanged() {
    if (!this.roomsChanged$) {
      this.roomsChanged$ = this.rooms$.pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
    return this.roomsChanged$;
  }

  sendMessage(message: SendMessage) {
    const roomId = this.currentRoom()?.id;

    if (!roomId || !this.wsService.connected) {
      return "Not connected";
    }

    if (message.content.trim().length > 0 || message.fileUrl) {
      const author = this.authService.auth.value;

      if (!author || !author.id) {
        return "Unauthorized"
      }
      
      this.wsService.sendMessage(
        {
          type: "message.send",
          payload: {
              ...message,
              author,
              roomId,
              sentAt: Date.now().toLocaleString()
          },
        } as WSMessage
      );
      return null;
    }
    return "Too small";
  }

  editMessage(messageId: string, content: string) {
    const roomId = this.currentRoom()?.id;

    if (!roomId || !this.wsService.connected) {
      return "Not connected";
    }

    if (content.trim().length > 0) {
      const message: WSMessage = {
        type: "message",
        payload: {
          action: "message:edit",
          roomId: roomId,
          messageId: messageId,
          content,
        },
      };

      this.wsService.sendMessage(message);
      return null;
    }
    return "Too small";
  }

  selectRoom(room: RoomDetails) {
    if (!this.wsService.connected) {
      return "Not connected";
    }

    this.roomService.selectedRoom.next(room);
    this.typingUsers = [];

    if (room) {
      this.wsService.sendMessage({
        type: "room.enter",
        payload: { roomId: room.id },
      });
    }
    return null;
  }

  selectRoomId(roomId: string) {
    this.roomService.getRoom(roomId).subscribe((room) => {
      if (!room) return;

      this.roomService.selectedRoom.next(room);
      this.typingUsers = [];

      this.wsService.sendMessage({
        type: "room.enter",
        payload: { roomId: roomId },
      });
    });
    return null;
  }

  selectedDirectRoomId(userId: string) {
    return this.roomService.getDirectRoom(userId).pipe(
      tap((room) => {
        if (!room) return;

        this.roomService.selectedRoom.next(room);
        this.typingUsers = [];

        this.wsService.sendMessage({
          type: "room.enter",
          payload: { roomId: room.id },
        });
      })
    );
  }

  createRoom(data: CreateRoomRequest) {
    return this.roomService.createRoom(data).pipe(
      tap((data) => {
        if (data) {
          this.rooms$.next();
          this.selectRoom(data);
        } else {
          console.error("Error creating room:", data);
        }
      })
    );
  }

  updateRoom(data: Partial<UpdateRoomRequest>) {
    const room = this.currentRoom();

    if (!room) {
      throw new Error("No room selected");
    }

    return this.roomService.updateRoom(room.id, data).pipe(
      tap((room) => {
        this.rooms$.next();
        this.roomService.selectedRoom.next(room);
      }),
      catchError((err) => {
        console.error("Error updating room:", err);
        return throwError(() => err);
      })
    );
  }

  joinRoom(newRoomId: string): Observable<Room> | null {
    if (!this.wsService.connected) {
      console.warn("Websocket not connected");
      return null;
    }

    return this.roomService.getRoom(newRoomId).pipe(
      tap((room) => {
        if (!room) return;

        this.roomService.joinRoom(room.id).subscribe({
          next: () => {
            this.reloadRooms();
            this.roomService.selectedRoom.next(room);
            this.typingUsers = [];

            this.wsService.sendMessage(
              JSON.stringify({
                type: "room.join",
                payload: { roomId: newRoomId },
              })
            );
          },
        });
      })
    );
  }

  leaveRoom() {
    const roomId = this.currentRoom()?.id;

    if (!roomId || !this.wsService.connected) {
      return "Not connected";
    }

    this.wsService.sendMessage(
      JSON.stringify({
        type: "room.leave",
        payload: { roomId: roomId },
      })
    );

    this.rooms$.next();
    this.typingUsers = [];

    this.roomService.selectedRoom.next(null);
    return null;
  }

  exitRoom() {
    const roomId = this.currentRoom()?.id;

    if (!roomId || !this.wsService.connected) {
      return "Not connected";
    }

    this.wsService.sendMessage(
      JSON.stringify({
        type: "room.exit",
        payload: { roomId: roomId },
      })
    );

    this.typingUsers = [];
    this.roomService.selectedRoom.next(null);

    return null;
  }

  reloadRooms() {
    this.rooms$.next();
  }
}
