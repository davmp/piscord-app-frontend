import { Component, computed, inject, input } from "@angular/core";
import { HeaderComponent } from "../../components/chat/header/header.component";
import { RoomService } from "../../services/room/room.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-chat",
  imports: [HeaderComponent],
  templateUrl: "./chat.component.html",
  styles: ``,
})
export class ChatComponent {
  private route = inject(ActivatedRoute);
  private roomService = inject(RoomService);

  roomId: string | null = null;

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.roomId = params.get("roomId");
      if (this.roomId && this.roomId !== this.roomService.selectedRoom()?.id) {
        this.roomService.getRoom(this.roomId).subscribe((room) => {
          this.roomService.selectRoom(room);
        });
      }
    });
  }

  inputPlaceholder = computed(() =>
    this.roomService.selectedRoom()
      ? `Converse com @${this.roomService.selectedRoom()?.display_name}`
      : "Select a room to start chatting"
  );
}
