import type { CreateUserInput } from "../types/user.type.js";

export interface LoginDto {
  email: string;
}

export type RegisterDto = CreateUserInput;

export interface GoogleLoginDto {
  idToken: string;
}

