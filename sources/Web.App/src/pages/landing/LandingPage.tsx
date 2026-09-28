import React from "react";
import backgroundImage from "src/assets/schottland.jpg";
import LandingHero from "src/components/layout/LandingHero";
import { useLocalization } from "src/hooks/useLocalization";

const LandingPage: React.FC = () => {
  const { getResource } = useLocalization();

  return (
    <LandingHero
      backgroundImage={backgroundImage}
      appName={getResource("common:labelAppName")}
      title={getResource("common:captionAppTitle")}
      subtitle={getResource("common:labelAppSubTitle")}
      primaryLabel={getResource("common:labelRequestAccess")}
      primaryTo="/register"
      secondaryLabel={getResource("common:labelLogin")}
      secondaryTo="/login"
    />
  );
};

export default LandingPage;
