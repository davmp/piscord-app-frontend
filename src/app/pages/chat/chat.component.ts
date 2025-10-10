import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Button } from "primeng/button";
import { Textarea } from "primeng/textarea";
import { HeaderComponent } from "../../components/chat/header/header.component";
import { MessageComponent } from "../../components/chat/message/message.component";
import {
  type DisplayMessage,
  type WSResponse,
} from "../../models/message.models";
import { ChatService } from "../../services/chat/chat.service";
import { MessageService } from "../../services/chat/message.service";
import { WebsocketService } from "../../services/chat/ws.service";
import { DeviceService } from "../../services/device.service";
import { RoomService } from "../../services/room/room.service";
import * as formThemes from "../../themes/form.themes";

@Component({
  selector: "app-chat",
  imports: [HeaderComponent, MessageComponent, Textarea, FormsModule, Button],
  templateUrl: "./chat.component.html",
  styles: ``,
})
export class ChatComponent {
  private roomService = inject(RoomService);
  private chatService = inject(ChatService);
  private wsService = inject(WebsocketService);
  private messageService = inject(MessageService);
  private deviceService = inject(DeviceService);

  buttonThemes = formThemes.buttonThemes;
  inputThemes = formThemes.inputThemes;

  roomId: string | null = null;
  newMessageContent = "";

  messages = signal<DisplayMessage[]>([]);
  loadingMessages = false;
  page = 1;
  pageSize = 20;

  inputPlaceholder = computed(() => {
    if (this.roomService.selectedRoom()) {
      return this.roomService.selectedRoom()?.type === "direct"
        ? `Converse com @${this.roomService.selectedRoom()?.display_name}`
        : `Conversar em ${this.roomService.selectedRoom()?.display_name}`;
    }
    return "Selecione uma sala para começar a conversar";
  });

  messagesDisplay = computed(() => {
    return this.messages().map((message, index) => {
      const previousMessage = this.messages()[index + 1];

      const currentDate = new Date(message.created_at);
      currentDate.setHours(currentDate.getHours() + 3);
      const previousDate = previousMessage
        ? new Date(previousMessage.created_at)
        : null;
      const showDateSeparator =
        !previousDate ||
        currentDate.toDateString() !== previousDate.toDateString();

      let diffTime = true;
      if (previousMessage && previousMessage.user_id === message.user_id) {
        const prevTime = new Date(previousMessage.created_at).getTime();
        const currTime = new Date(message.created_at).getTime();

        if (currTime - prevTime <= 300000) {
          diffTime = false;
        }
      }

      return { message, showDateSeparator, diffTime };
    });
  });

  constructor() {
    effect(() => {
      this.chatService.roomChanged();
      this.fetchMessages();
    });
  }

  ngOnInit() {
    this.subscribeToMessages();
  }

  fetchMessages() {
    const roomId = this.roomService.selectedRoom()?.id;

    if (!roomId) return;

    this.loadingMessages = true;

    this.messageService
      .getMessages(roomId, this.page, this.pageSize)
      .subscribe({
        next: (result) => {
          const messages = result.data.map((msg) => ({
            id: msg.id,
            room_id: msg.room_id,
            user_id: msg.user_id,
            username: msg.username,
            picture: msg.picture,
            content: msg.content,
            created_at: msg.created_at,
            is_own_message: msg.is_own_message,
          }));
          this.messages.set(messages);
        },
        error: () => {},
      });

    this.loadingMessages = false;
  }

  subscribeToMessages(): void {
    this.wsService.connect().subscribe({
      next: (wsMessage: WSResponse) => {
        if (wsMessage.type === "new_message" && wsMessage.data) {
          const message = {
            ...wsMessage.data.message,
            is_own_message: wsMessage.data.is_own_message,
          };
          this.messages.set([message, ...(this.messages() ?? [])]);
        }
      },
    });
  }

  sendMessage(): void {
    if (this.newMessageContent.trim() && this.roomService.selectedRoom()) {
      const err = this.chatService.sendMessage(this.newMessageContent);
      if (err) {
        console.error("Error sending message: ", err);
        return;
      }
      this.newMessageContent = "";
    }
  }

  isMobile() {
    return this.deviceService.isMobile();
  }

  dateSeparator(dateString: string) {
    var fulldays = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];

    var months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    const date = new Date(dateString);

    var dt = new Date(dateString),
      dtDat = dt.getDate(),
      month = months[dt.getMonth()],
      diffDays = new Date().getDate() - dtDat,
      diffMonths = new Date().getMonth() - dt.getMonth(),
      diffYears = new Date().getFullYear() - dt.getFullYear();

    if (diffYears === 0 && diffDays === 0 && diffMonths === 0) {
      return "Hoje";
    } else if (diffYears === 0 && diffDays === 1) {
      return "Ontem";
    } else if (diffYears === 0 && diffDays < -1 && diffDays > -7) {
      return fulldays[dt.getDay()];
    } else if (diffYears >= 1) {
      return month + " " + date + ", " + date.getFullYear();
    }

    return date.toLocaleDateString(["pt-BR"], {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
  }
}
