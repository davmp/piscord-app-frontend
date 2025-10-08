import { Component, effect, inject, output, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { SkeletonModule } from "primeng/skeleton";
import type { Room } from "../../../models/rooms.models";
import { RoomService } from "../../../services/room/room.service";
import { buttonThemes } from "../../../themes/form.themes";
import { UserInfoComponent } from "./user-info/user-info.component";
import { ChatService } from "../../../services/chat/chat.service";

@Component({
  selector: "app-sidebar",
  imports: [
    UserInfoComponent,
    ButtonModule,
    AvatarModule,
    SkeletonModule,
    RouterLink,
  ],
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent {
  readonly roomService = inject(RoomService);
  private readonly chatService = inject(ChatService);

  isLoading = signal(false);
  rooms = signal<Room[]>([]);

  openModal = output<"createRoom" | "findRooms">();

  constructor() {
    this.loadRooms();

    effect(() => {
      this.chatService.roomChanged();
      this.loadRooms();
    });
  }

  get loading() {
    return this.isLoading();
  }

  get roomsList() {
    return this.rooms();
  }

  get ghost() {
    return buttonThemes.ghost;
  }

  loadRooms() {
    this.isLoading.set(true);
    this.roomService.getMyRooms().subscribe((rooms) => {
      this.rooms.set(rooms.data);
    });
    this.isLoading.set(false);
  }

  onSelectRoom(room: Room) {
    this.chatService.selectRoom(room);
  }

  handleOpenModal(type: "createRoom" | "findRooms") {
    this.openModal.emit(type);
  }
}
