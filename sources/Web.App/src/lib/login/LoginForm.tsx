import React from "react";
import { useTranslation } from "react-i18next";
import Form from "src/components/form/Form";
import PasswordField from "src/components/form/PasswordField";
import SubmitButton from "src/components/form/SubmitButton";
import TextField from "src/components/form/TextField";
import Alert from "src/components/layout/Alert";
import useLoginForm from "src/lib/login/hooks/useLoginForm";

const LoginForm: React.FC = () => {
  const { t } = useTranslation("auth");
  const { model, change, fieldError, formError, submitting, submit } =
    useLoginForm();

  const errorText = (field: keyof typeof model) => {
    const key = fieldError(field);
    return key === undefined ? undefined : t(key);
  };

  return (
    <Form onSubmit={submit}>
      {formError && <Alert severity="error">{t(formError)}</Alert>}

      <TextField
        label={t("labelUserNameOrEmail")}
        autoComplete="username"
        autoFocus
        required
        value={model.userNameOrEmail}
        onChange={(value) => {
          change({ userNameOrEmail: value });
        }}
        error={errorText("userNameOrEmail")}
      />

      <PasswordField
        label={t("labelPassword")}
        autoComplete="current-password"
        required
        value={model.password}
        onChange={(value) => {
          change({ password: value });
        }}
        error={errorText("password")}
        helperText={t("helperPassword")}
        showPasswordLabel={t("labelShowPassword")}
        hidePasswordLabel={t("labelHidePassword")}
      />

      <SubmitButton
        label={t("buttonLogin")}
        loadingLabel={t("buttonLoginLoading")}
        loading={submitting}
      />
    </Form>
  );
};

export default LoginForm;
