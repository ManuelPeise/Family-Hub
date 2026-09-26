import type { AuthTranslationKey } from "src/lib/authentication/types/AuthTranslationKey";

export interface AuthenticationForm<TModel> {
  model: TModel;
  /** Updates fields and clears their server errors. */
  change: (changes: Partial<TModel>) => void;
  /** Server error for the field, or the client error once the form was submitted. */
  fieldError: (field: keyof TModel & string) => AuthTranslationKey | undefined;
  /** Message shown above the form, or null. */
  formError: AuthTranslationKey | null;
  submitting: boolean;
  submit: () => void;
}
