export type AuthProvider = "local" | "google";

export interface CreateUserInput {
  firstName: string;
  lastName?: string | null;
  email: string;
  password?: string | null;
  googleId?: string | null;
  provider?: AuthProvider;
}
