import { ApiError } from "src/lib/api/types/ApiError";
import type { AuthenticationError } from "src/lib/authentication/types/AuthenticationError";
import type { AuthTranslationKey } from "src/lib/authentication/types/AuthTranslationKey";
import isRecord from "src/lib/utils/isRecord";

const toCamelCase = (key: string): string =>
  key.charAt(0).toLowerCase() + key.slice(1);

/** Maps a failed login or registration request to translation keys for the form. */
const parseAuthenticationError = (
  error: unknown,
  context: "login" | "register",
): AuthenticationError => {
  if (!(error instanceof ApiError)) {
    // axios throws a network error when the server can't be reached.
    return { messageKey: "errorNetwork", fieldErrors: {} };
  }

  const { status, body } = error;

  if (status >= 502 && status <= 504) {
    // The dev proxy answers with these when the API isn't running.
    return { messageKey: "errorNetwork", fieldErrors: {} };
  }

  if (status === 400 && isRecord(body) && isRecord(body.errors)) {
    const fieldErrors: Partial<Record<string, AuthTranslationKey>> = {};
    for (const key of Object.keys(body.errors)) {
      fieldErrors[toCamelCase(key)] = "errorFieldInvalid";
    }

    return { messageKey: "errorValidation", fieldErrors };
  }

  if (status === 400) {
    return {
      messageKey:
        context === "login"
          ? "errorInvalidCredentials"
          : "errorRegistrationFailed",
      fieldErrors: {},
    };
  }

  return { messageKey: "errorUnknown", fieldErrors: {} };
};

export default parseAuthenticationError;
