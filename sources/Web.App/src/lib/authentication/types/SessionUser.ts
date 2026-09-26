/** The signed-in user. Mirrors Shared.Models/Auth/SessionResponse. */
export interface SessionUser {
  userName: string;
  email: string;
  roles: string[];
}
