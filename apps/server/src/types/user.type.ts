export type AuthProvider = "local" | "google" | "github";

export interface CreateUserInput {
  firstName: string;
  lastName?: string | null;
  email: string;
  password?: string | null;
  providerId?: string | null;
  provider?: AuthProvider;
}

