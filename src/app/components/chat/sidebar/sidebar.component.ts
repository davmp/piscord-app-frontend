import { Component, inject, output, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { SkeletonModule } from "primeng/skeleton";
import type { Room } from "../../../models/rooms.models";
import { RoomService } from "../../../services/room/room.service";
import { buttonThemes } from "../../../themes/form.themes";
import { UserInfoComponent } from "./user-info/user-info.component";

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
  styles: ``,
})
export class SidebarComponent {
  readonly roomService = inject(RoomService);
  isLoading = signal(false);
  rooms = signal<Room[]>([]);

  openModal = output<"createRoom">();

  ngOnInit() {
    this.loadRooms();
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
    this.roomService.getRooms().subscribe((rooms) => {
      this.rooms.set(rooms.data);
      if (this.rooms().length > 0) {
        this.roomService.selectRoom(this.rooms()[0]);
        // this.loadMessages(true);
      }
    });
    this.isLoading.set(false);
  }

  onSelectRoom(room: Room) {
    this.roomService.selectRoom(room);
    // this.loadMessages();
  }

  handleOpenModal(type: "createRoom") {
    this.openModal.emit(type);
  }
}
