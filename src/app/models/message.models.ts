import type { User } from "./user.models";

export interface MessagePaginationResult {
  data: Message[];
  total: number;
  page: number;
  size: number;
}

export interface Message {
  id: string;
  roomId: string;
  author: User;
  content: string;
  fileUrl?: string;
  replyTo?: MessagePreview;
  isDeleted: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessagePreview {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface SelectedMessageEdit {
  id: string;
  content: string;
}

export interface WSMessage {
  type: string;
  payload?: {
    [key: string]: any;
  };
}

export interface WSResponse {
  type: string;
  success: boolean;
  data: {
    id: string;
    roomId: string;
    content: string;
    fileUrl?: string;
    author: User;
    replyTo?: MessagePreview;
    sentAt: string;
  };
}

export interface SendMessage {
  content: string;
  fileUrl: string | null;
  replyTo: MessagePreview | null;
}
