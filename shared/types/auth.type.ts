import { Role } from "../../backend/src/enums/role.enum";

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  verified: boolean;
  active: boolean;
  googleId?: string | null;
  createdAt: string;
  updatedAt: string;
  role: Role;
  _count: {
    followers: number;
    following: number;
    posts: number;
    visitsReceived: number;
  };
}

export interface CreateUserRequest {
  email: string;
  username: string;
  name: string;
  password: string;
  avatar?: string;
  bio?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthResponse {
  user: User;
  tokens: TokenResponse;
}
