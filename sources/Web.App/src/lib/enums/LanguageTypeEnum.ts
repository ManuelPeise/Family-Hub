export const Languages = {
  ENGLISH: 0,
  GERMAN: 1,
} as const;

export type LanguageTypeEnum = (typeof Languages)[keyof typeof Languages];
