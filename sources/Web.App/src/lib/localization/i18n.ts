import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import type { Language } from "src/hooks/types/UseLocalisationResult";
import authDe from "src/lib/localization/resources/de/auth.de.json";
import commonDe from "src/lib/localization/resources/de/common.de.json";
import homeDe from "src/lib/localization/resources/de/home.de.json";
import landingDe from "src/lib/localization/resources/de/landing.de.json";
import authEn from "src/lib/localization/resources/en/auth.en.json";
import commonEn from "src/lib/localization/resources/en/common.en.json";
import homeEn from "src/lib/localization/resources/en/home.en.json";
import landingEn from "src/lib/localization/resources/en/landing.en.json";

export const defaultNS = "common";

export const resources = {
  de: {
    common: commonDe,
    auth: authDe,
    landing: landingDe,
    home: homeDe,
  },
  en: {
    common: commonEn,
    auth: authEn,
    landing: landingEn,
    home: homeEn,
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
