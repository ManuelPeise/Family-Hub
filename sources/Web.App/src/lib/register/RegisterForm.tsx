import React from "react";
import { useTranslation } from "react-i18next";
import Form from "src/components/form/Form";
import SubmitButton from "src/components/form/SubmitButton";
import TextField from "src/components/form/TextField";
import Alert from "src/components/layout/Alert";
import type { RegisterFormState } from "src/lib/register/types/RegisterFormState";

interface Props {
  form: RegisterFormState;
}

const RegisterForm: React.FC<Props> = ({ form }) => {
  const { t } = useTranslation("auth");
  const { model, change, fieldError, formError, submitting, submit } = form;

  const errorText = (field: keyof typeof model) => {
    const key = fieldError(field);
    return key === undefined ? undefined : t(key);
  };

  return (
    <Form onSubmit={submit}>
      {formError && <Alert severity="error">{t(formError)}</Alert>}

      <TextField
        label={t("labelFirstName")}
        autoComplete="given-name"
        autoFocus
        value={model.firstName}
        onChange={(value) => {
          change({ firstName: value });
        }}
        error={errorText("firstName")}
        helperText={t("helperOptional")}
      />

      <TextField
        label={t("labelLastName")}
        autoComplete="family-name"
        value={model.lastName}
        onChange={(value) => {
          change({ lastName: value });
        }}
        error={errorText("lastName")}
        helperText={t("helperOptional")}
      />

      <TextField
        label={t("labelUserName")}
        autoComplete="username"
        required
        value={model.userName}
        onChange={(value) => {
          change({ userName: value });
        }}
        error={errorText("userName")}
        helperText={t("helperUserName")}
      />

      <TextField
        label={t("labelEmail")}
        type="email"
        autoComplete="email"
        required
        value={model.email}
        onChange={(value) => {
          change({ email: value });
        }}
        error={errorText("email")}
      />

      <SubmitButton
        label={t("buttonRegister")}
        loadingLabel={t("buttonRegisterLoading")}
        loading={submitting}
      />
    </Form>
  );
};

export default RegisterForm;
