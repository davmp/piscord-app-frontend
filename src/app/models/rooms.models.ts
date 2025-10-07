import type { GroupMessage } from "./message.models";

export interface GetRooms {
  data: Room[];
  total: number;
}

export interface Room {
  id: string;
  display_name: string;
  description?: string;
  picture?: string;
  updatedAt: Date;
  last_message: GroupMessage | null;
}

export interface CreateRoomRequest {
  name: string;
  description?: string;
  picture?: string;
}
