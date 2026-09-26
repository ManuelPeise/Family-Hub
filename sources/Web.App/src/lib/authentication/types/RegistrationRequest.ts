/** Mirrors Shared.Models/Auth/RegistrationRequest. The server emails a one-time password. */
export interface RegistrationRequest {
  firstName?: string;
  lastName?: string;
  email: string;
  userName: string;
}
