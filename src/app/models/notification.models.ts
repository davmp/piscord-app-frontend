export type NotificationType =
"new_message"|
"user_joined"|
"user_left"|
"friend_request"|
"friend_request_accepted"|
"room_invite"|
"mention"|
"system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  actionUrl?: string;
  picture?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  data: Notification[];
  total: number;
}

export interface WSNotification {
  id: string;
  type: string;
  objectId: string;
}
