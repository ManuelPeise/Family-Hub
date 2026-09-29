import React from "react";
import { useTranslation } from "react-i18next";
import type {
  Language,
  ResourceKey,
  ResourceNamespace,
  UseLocalisationResult,
} from "src/hooks/types/UseLocalisationResult";

const namespaces: ResourceNamespace[] = [
  "common",
  "navigation",
  "notification",
];

export const useLocalization = (): UseLocalisationResult => {
  const { t, i18n } = useTranslation(namespaces);

  const getResource = React.useCallback(
    (key: ResourceKey): string => {
      return t(key);
    },
    [t],
  );

  const selectLanguage = React.useCallback(
    (lang: Language): void => {
      void i18n.changeLanguage(lang);
    },
    [i18n],
  );

  return {
    getResource,
    selectLanguage,
  };
};
