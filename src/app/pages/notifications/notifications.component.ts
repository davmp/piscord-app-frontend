import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Avatar } from "primeng/avatar";
import type { Notification } from "../../models/notification.models";
import { NotificationService } from "../../services/notification/notification.service";
import * as formThemes from "../../themes/form.themes";

@Component({
  selector: "app-notifications",
  imports: [Avatar, RouterLink],
  templateUrl: "./notifications.component.html",
})
export class NotificationsComponent {
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  isLoading = signal(false);
  notifications = signal([] as Notification[]);

  readonly buttonThemes = formThemes.buttonThemes;

  constructor() {
    this.loadNotifications();

    this.notificationService.notificationSubscription.subscribe(() =>
      this.loadNotifications()
    );
  }

  loadNotifications() {
    this.isLoading.set(true);

    this.notificationService.getMyNotifications().subscribe((res) => {
      this.notifications.set(res.data as Notification[]);
    });

    this.isLoading.set(false);
  }

  handleClickNotification(notification: Notification) {
    this.handleReadNotification(notification.id);

    if (notification.link) {
      this.router.navigate([notification.link]);
    }
  }

  handleReadNotification(notificationId: string) {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        this.notificationService.notificationSubscription.next(true);
      },
      error: (err) => {
        console.error("Error reading notification: ", err);
      },
    });
  }

  handleReadAllNotifications() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notificationService.notificationSubscription.next(true);
      },
      error: (err) => {
        console.error("Error reading alll notifications: ", err);
      },
    });
  }

  handleDeleteNotification(notificationId: string) {
    this.notificationService.deleteNotification(notificationId).subscribe({
      next: () => {
        this.notificationService.notificationSubscription.next(true);
      },
      error: (err) => {
        console.error("Error deleting notification: ", err);
      },
    });
  }

  handleDeleteAllNotifications() {
    this.notificationService.deleteAllMyNotifications().subscribe({
      next: () => {
        this.notificationService.notificationSubscription.next(true);
      },
      error: (err) => {
        console.error("Error deleting all notifications: ", err);
      },
    });
  }

  formattedDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = now.getDate() - date.getDate();

    if (diffDays < 1) {
      return date.toLocaleTimeString(["pt-BR"], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else {
      return date.toLocaleDateString(["pt-BR"], {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    }
  }
}
