import type { CustomTypeOptions } from "i18next";

export type Language = "en" | "de";

type Resources = CustomTypeOptions["resources"];

export type ResourceNamespace = keyof Resources;

/** A translation key prefixed with its namespace, e.g. "auth:labelLogin". */
export type ResourceKey = {
  [
    TNamespace in ResourceNamespace
  ]: `${TNamespace}:${keyof Resources[TNamespace] & string}`;
}[ResourceNamespace];

export interface UseLocalisationResult {
  getResource: (key: ResourceKey) => string;
  selectLanguage: (lang: Language) => void;
}
