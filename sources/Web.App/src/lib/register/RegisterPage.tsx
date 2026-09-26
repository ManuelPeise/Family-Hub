import React from "react";
import { useTranslation } from "react-i18next";
import backgroundImage from "src/assets/schottland.jpg";
import Alert from "src/components/layout/Alert";
import AuthLayout from "src/components/layout/AuthLayout";
import Button from "src/components/layout/Button";
import Link from "src/components/layout/Link";
import Stack from "src/components/layout/Stack";
import Typography from "src/components/layout/Typography";
import useRegisterForm from "src/lib/register/hooks/useRegisterForm";
import RegisterForm from "src/lib/register/RegisterForm";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation("auth");
  const form = useRegisterForm();

  if (form.registered) {
    return (
      <AuthLayout
        backgroundImage={backgroundImage}
        title={t("titleRegistrationDone")}
        backLabel={t("labelBackToStart")}
        backTo="/"
      >
        <Stack spacing={3}>
          <Alert severity="success">{t("textRegistrationDone")}</Alert>
          <Button to="/login" size="large" fullWidth>
            {t("buttonGoToLogin")}
          </Button>
        </Stack>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      backgroundImage={backgroundImage}
      title={t("titleRegister")}
      intro={t("introRegister")}
      backLabel={t("labelBackToStart")}
      backTo="/"
      footer={
        <Typography>
          {t("textHasAccount")} <Link to="/login">{t("linkLogin")}</Link>
        </Typography>
      }
    >
      <RegisterForm form={form} />
    </AuthLayout>
  );
};

export default RegisterPage;
