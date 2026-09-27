import React from "react";
import { useTranslation } from "react-i18next";
import backgroundImage from "src/assets/schottland.jpg";
import LandingHero from "src/components/layout/LandingHero";

const LandingPage: React.FC = () => {
  const { t } = useTranslation("landing");
  const { t: tCommon } = useTranslation();

  return (
    <LandingHero
      backgroundImage={backgroundImage}
      appName={tCommon("labelAppName")}
      title={t("title")}
      subtitle={t("subtitle")}
      primaryLabel={t("buttonRegister")}
      primaryTo="/register"
      secondaryLabel={t("buttonLogin")}
      secondaryTo="/login"
    />
  );
};

export default LandingPage;
