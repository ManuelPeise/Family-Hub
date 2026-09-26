import type authEn from "src/lib/localization/resources/en/auth.en.json";

/** A key of the "auth" resource file. Validation and API errors are passed around as keys, not text. */
export type AuthTranslationKey = keyof typeof authEn;
