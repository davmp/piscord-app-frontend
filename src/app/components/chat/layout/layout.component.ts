import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SplitterModule } from "primeng/splitter";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CreateRoomComponent } from "../modals/create-room/create-room.component";

@Component({
  selector: "app-layout",
  imports: [
    RouterOutlet,
    CreateRoomComponent,
    SidebarComponent,
    SplitterModule,
  ],
  templateUrl: "./layout.component.html",
})
export class LayoutComponent {
  createRoomModalVisible = signal(false);

  handleOpenModal(type: string) {
    if (type === "createRoom") {
      this.createRoomModalVisible.set(true);
    }
  }
}
