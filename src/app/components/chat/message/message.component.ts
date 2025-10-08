import { Component, input } from "@angular/core";
import { Avatar } from "primeng/avatar";
import { DisplayMessage } from "../../../models/message.models";

@Component({
  selector: "app-message",
  imports: [Avatar],
  templateUrl: "./message.component.html",
})
export class MessageComponent {
  message = input<DisplayMessage>();
  diffTime = input<boolean>(true);

  get formattedDate(): string {
    const createdAt = this.message()?.created_at;
    if (!createdAt) return "";

    const date = new Date(createdAt);
    return date.toLocaleTimeString(["pt-BR"], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  get formattedFullDate(): string {
    const createdAt = this.message()?.created_at;
    if (!createdAt) return "";

    const date = new Date(createdAt);
    return date.toLocaleString(["pt-BR"], {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
}
