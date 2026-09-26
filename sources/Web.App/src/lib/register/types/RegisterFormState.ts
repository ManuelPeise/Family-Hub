import type { AuthenticationForm } from "src/lib/authentication/types/AuthenticationForm";
import type { RegisterModel } from "src/lib/register/types/RegisterModel";

export interface RegisterFormState extends AuthenticationForm<RegisterModel> {
  /** true once the account was created; the one-time password is on its way by email. */
  registered: boolean;
}
