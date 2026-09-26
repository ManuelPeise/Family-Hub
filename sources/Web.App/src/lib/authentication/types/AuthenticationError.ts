import type { AuthTranslationKey } from "src/lib/authentication/types/AuthTranslationKey";

export interface AuthenticationError {
  /** Message shown above the form. */
  messageKey: AuthTranslationKey;
  /** Field errors from ASP.NET ValidationProblemDetails, keyed by camelCase field name. */
  fieldErrors: Partial<Record<string, AuthTranslationKey>>;
}
