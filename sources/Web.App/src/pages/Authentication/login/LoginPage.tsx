import React from "react";
import { useTranslation } from "react-i18next";
import backgroundImage from "src/assets/schottland.jpg";
import AuthLayout from "src/components/layout/AuthLayout";
import Link from "src/components/layout/Link";
import Typography from "src/components/layout/Typography";
import LoginForm from "src/pages/Authentication/login/LoginForm";

const LoginPage: React.FC = () => {
  const { t } = useTranslation("auth");

  return (
    <AuthLayout
      backgroundImage={backgroundImage}
      title={t("titleLogin")}
      backLabel={t("labelBackToStart")}
      backTo="/"
      footer={
        <Typography>
          {t("textNoAccount")} <Link to="/register">{t("linkRegister")}</Link>
        </Typography>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
