export interface Message {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  timestamp: Date;
}

export interface GroupMessage {
  id: string;
  content: string;
  created_at: string;
  username: string;
}
