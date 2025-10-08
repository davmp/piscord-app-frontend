import type { MessagePreviewResponse } from "./message.models";

export interface GetRooms<T = Room> {
  data: T[];
  total: number;
}
export interface Room {
  id: string;
  display_name: string;
  description?: string;
  picture?: string;
  updatedAt: Date;
  last_message: MessagePreviewResponse | null;
  type: "public" | "private" | "direct";
  max_members?: number;
  members_count: number;
  is_member: boolean;
  is_admin: boolean;
  owner_id: string;
}

export interface PublicRoom {
  id: string;
  display_name: string;
  description?: string;
  picture?: string;
  updatedAt: Date;
  type: "public";
  max_members?: number;
  members_count: number;
  owner_id: string;

  is_member: boolean;
}

export interface CreateRoomRequest {
  name: string;
  description?: string;
  picture?: string;
}
