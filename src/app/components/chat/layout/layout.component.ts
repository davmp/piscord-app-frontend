import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SplitterModule } from "primeng/splitter";
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
  createRoomModalVisible = signal(false);
  findRoomModalVisible = signal(false);

  handleOpenModal(type: string) {
    if (type === "createRoom") {
      this.createRoomModalVisible.set(true);
    } else if (type === "findRooms") {
      this.findRoomModalVisible.set(true);
    }
  }
}
