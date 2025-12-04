import type { MessagePreview } from "./message.models";

export interface GetRooms<T = Room> {
  data: T[];
  total: number;
}

export interface Room {
  id: string;
  displayName: string;
  description?: string;
  picture?: string;
  type: "public" | "private" | "direct";
  lastMessage?: MessagePreview;
}

export interface RoomDetails {
  id: string;
  displayName: string;
  description?: string;
  picture?: string;
  type: "public" | "private" | "direct";
  maxMembers?: number;
  members: RoomMember[];
  isMember: boolean;
  isAdmin: boolean;
  ownerId: string;
  updatedAt: string;
  createdAt: string;
}

export interface DirectRoomDetails extends RoomDetails {
  id: string;
  displayName: string;
  description?: string;
  picture?: string;
  type: "private";
  maxMembers?: 2;
  members: RoomMember[];
  admins: [];
  isMember: true;
  isAdmin: false;
  ownerId: string;
  updatedAt: string;
  createdAt: string;
}

export interface PublicRoom {
  id: string;
  displayName: string;
  description?: string;
  picture?: string;
  updatedAt: Date;
  type: "public";
  maxMembers?: number;
  memberCount: number;
  ownerId: string;
  isMember: boolean;
}

export interface CreateRoomRequest {
  name?: string;
  description?: string;
  picture?: string;
  type: "public" | "private" | "direct";
  members: string[];
  admins: string[];
  maxMembers: number;
}

export interface UpdateRoomRequest {
  name?: string;
  description?: string;
  picture?: string;
  addMembers: string[];
  removeMembers: string[];
  maxMembers?: number;
}

export interface RoomMember {
  userId: string;
  username: string;
  picture?: string;
  isAdmin: boolean;
  isOnline: boolean;
  isMe: boolean;
}
