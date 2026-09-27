import React from "react";
import Form from "src/components/form/Form";
import FormTextField from "src/components/form/FormTextField";
import SubmitButton from "src/components/form/SubmitButton";
import { useFormModel } from "src/hooks/useFormModel";
import { useLocalization } from "src/hooks/useLocalization";
import useAuthenticationState from "src/hooks/useAuthenticationState";
import type { AuthenticationRequest } from "src/lib/authentication/types/Authentication.types";

const initialModel: AuthenticationRequest = {
  emailOrUsername: "",
  password: "",
};

const LoginForm: React.FC = () => {
  const { getResource } = useLocalization();
  const authenticationState = useAuthenticationState();
  const { model, isModified, isValid, updateModel } =
    useFormModel<AuthenticationRequest>(initialModel);

  const handleSubmit = React.useCallback(async () => {
    await authenticationState.handleLogin(model);
  }, [authenticationState, model]);
  return (
    <Form onSubmit={handleSubmit}>
      <FormTextField
        label={getResource("auth:labelUserNameOrEmail")}
        autoComplete="username"
        required
        value={model.emailOrUsername}
        onChange={(value) => {
          updateModel({ emailOrUsername: value });
        }}
      />

      <FormTextField
        label={getResource("auth:labelPassword")}
        autoComplete="current-password"
        required
        value={model.password}
        onChange={(value) => {
          updateModel({ password: value });
        }}
      />

      <SubmitButton
        label={getResource("auth:buttonLogin")}
        loadingLabel={getResource("auth:buttonLoginLoading")}
        loading={!isValid || !isModified}
      />
    </Form>
  );
};

export default LoginForm;
