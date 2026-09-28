import React from "react";
import { useTranslation } from "react-i18next";
import Typography from "src/components/labels/Typography";
import useAuthenticationState from "src/hooks/useAuthenticationState";

/** Start page after login. The app bar and drawer come from the AuthenticatedLayout. */
const HomePage: React.FC = () => {
  const { t } = useTranslation("home");
  const { session } = useAuthenticationState();

  return (
    <>
      <Typography variant="h2" component="h1">
        {t("titleGreeting", { name: session?.userName ?? "" })}
      </Typography>
      <Typography color="text.secondary">{t("textWelcome")}</Typography>
    </>
  );
};

export default HomePage;
