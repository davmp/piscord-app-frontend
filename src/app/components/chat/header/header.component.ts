import { Component, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Avatar } from "primeng/avatar";
import { Button } from "primeng/button";
import { DeviceService } from "../../../services/device.service";
import { RoomService } from "../../../services/room/room.service";
import { buttonThemes } from "../../../themes/form.themes";

@Component({
  selector: "app-header",
  imports: [Avatar, Button, RouterLink],
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  roomService = inject(RoomService);
  private deviceService = inject(DeviceService);

  selectedRoom = computed(() => this.roomService.selectedRoom());

  get ghost() {
    return buttonThemes.ghost;
  }

  isMobile() {
    return this.deviceService.isMobile();
  }
}
