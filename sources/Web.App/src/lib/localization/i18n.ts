import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import type { Language } from "src/hooks/types/UseLocalisationResult";
import commonDe from "src/lib/localization/resources/de/common.de.json";
import commonEn from "src/lib/localization/resources/en/common.en.json";
import notificationDe from "src/lib/localization/resources/de/notification.de.json";
import notificationEn from "src/lib/localization/resources/en/notification.en.json";
import navigationDe from "src/lib/localization/resources/de/navigation.de.json";
import navigationEn from "src/lib/localization/resources/en/navigation.en.json";

export const defaultNS = "common";

export const resources = {
  de: {
    common: commonDe,
    notification: notificationDe,
    navigation: navigationDe,
  },
  en: {
    common: commonEn,
    notification: notificationEn,
    navigation: navigationEn,
  },
} as const;

export const supportedLanguages: Language[] = ["de", "en"] as const;

i18n.on("languageChanged", (language) => {
  document.documentElement.lang = language;
});

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    ns: Object.keys(resources.en),
    supportedLngs: supportedLanguages,
    fallbackLng: "en",
    load: "languageOnly",
    initAsync: false,
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "language",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
