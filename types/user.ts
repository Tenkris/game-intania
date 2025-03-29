export interface User {
  email: string;
  level_id: number;
  user_image: string;
  attack: number;
  defense: number;
  speed: number;
  critical: number;
  hp: number;
}

export interface UserWithToken {
  user: User;
  token: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
