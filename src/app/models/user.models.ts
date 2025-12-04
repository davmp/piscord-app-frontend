export interface User {
  id: string;
  username: string;
  picture?: string;
}

export interface Profile extends User {
  bio?: string;
  isOnline: boolean;
  directChatId: string;
  createdAt: string;
}

export interface UpdateProfileRequest {
  username?: string;
  picture?: string;
  password?: string;
  bio?: string;
}
