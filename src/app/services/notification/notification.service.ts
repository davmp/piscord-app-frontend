import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import type { Message } from "../../models/message.models";
import type { NotificationsResponse } from "../../models/notification.models";
import { WebsocketService } from "../chat/ws.service";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private readonly notificationApiUrl =
    "http://127.0.0.1:8000/api/notifications";
  private wsService = inject(WebsocketService);
  private http = inject(HttpClient);

  messageSubscription: Subject<Message> = new Subject();
  notificationSubscription: Subject<true> = new Subject();

  constructor() {
    this.subscribeToNotifications();
  }

  private subscribeToNotifications(): void {
    this.wsService.connection().subscribe({
      next: (message) => {
        if (!message.data) {
          return;
        }

        if (message.type === "notification") {
          this.notificationSubscription.next(true);
        }
        if (message.type === "message_notification") {
          this.messageSubscription.next(message.data);
        }
      },
    });
  }

  getMyNotifications() {
    return this.http.get<NotificationsResponse>(this.notificationApiUrl);
  }

  deleteNotification(notificationId: string) {
    return this.http.delete(`${this.notificationApiUrl}/${notificationId}`);
  }

  deleteAllMyNotifications() {
    return this.http.delete(`${this.notificationApiUrl}/delete-all`);
  }

  getUnreadNotificationCount() {
    return this.http.get<number>(`${this.notificationApiUrl}/unread-count`);
  }

  markAsRead(notificationId: string) {
    return this.http.put(
      `${this.notificationApiUrl}/${notificationId}/read`,
      {}
    );
  }

  markAllAsRead() {
    return this.http.put(`${this.notificationApiUrl}/read-all`, {});
  }
}
