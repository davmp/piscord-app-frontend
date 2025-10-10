import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterOutlet } from "@angular/router";
import { SplitterModule } from "primeng/splitter";
import { ChatService } from "../../../services/chat/chat.service";
import { DeviceService } from "../../../services/device.service";
import { RoomService } from "../../../services/room/room.service";
import { CreateRoomComponent } from "../modals/create-room/create-room.component";
import { FindRoomComponent } from "../modals/find-room/find-room.component";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: "app-layout",
  imports: [
    RouterOutlet,
    CreateRoomComponent,
    FindRoomComponent,
    SidebarComponent,
    SplitterModule,
  ],
  templateUrl: "./layout.component.html",
})
export class LayoutComponent {
  private route = inject(ActivatedRoute);
  roomService = inject(RoomService);
  private chatService = inject(ChatService);
  private deviceService = inject(DeviceService);

  createRoomModalVisible = signal(false);
  findRoomModalVisible = signal(false);

  roomId: string | null = null;

  constructor() {
    this.chatService.connect();

    this.route.paramMap.subscribe((params) => {
      this.roomId = params.get("roomId");
      if (!this.roomId) {
        this.chatService.leaveRoom();
      } else if (
        !this.roomService.selectedRoom() ||
        this.roomId !== this.roomService.selectedRoom()?.id
      ) {
        this.chatService.selectRoomId(this.roomId);
      }
    });
  }

  handleOpenModal(type: string) {
    if (type === "createRoom") {
      this.createRoomModalVisible.set(true);
    } else if (type === "findRooms") {
      this.findRoomModalVisible.set(true);
    }
  }

  isMobile() {
    return this.deviceService.isMobile();
  }
}
