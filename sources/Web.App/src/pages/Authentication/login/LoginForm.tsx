import React from "react";
import Form from "src/components/form/Form";
import FormTextField from "src/components/form/FormTextField";
import SubmitButton from "src/components/form/SubmitButton";
import { useFormModel } from "src/hooks/useFormModel";
import { useLocalization } from "src/hooks/useLocalization";
import useAuthenticationState from "src/hooks/useAuthenticationState";
import type { AuthenticationRequest } from "src/lib/authentication/types/Authentication.types";
import { useLoadingState } from "src/hooks/useLoadingState";

const initialModel: AuthenticationRequest = {
  userNameOrEmail: "",
  password: "",
};

const LoginForm: React.FC = () => {
  const { getResource } = useLocalization();
  const authenticationState = useAuthenticationState();
  const { handleIsLoadingChanged } = useLoadingState();

  const { model, isModified, isValid, updateModel } =
    useFormModel<AuthenticationRequest>(initialModel);

  const handleSubmit = React.useCallback(async () => {
    try {
      handleIsLoadingChanged(true);

      await authenticationState.handleLogin(model);
    } finally {
      handleIsLoadingChanged(false);
    }
  }, [authenticationState, model, handleIsLoadingChanged]);

  return (
    <Form onSubmit={handleSubmit}>
      <FormTextField
        label={getResource("common:labelUserNameOrEmail")}
        autoComplete="username"
        type="text"
        required
        value={model.userNameOrEmail}
        onChange={(value) => {
          updateModel({ userNameOrEmail: value });
        }}
      />

      <FormTextField
        label={getResource("common:labelPassword")}
        type="password"
        required
        value={model.password}
        onChange={(value) => {
          updateModel({ password: value });
        }}
      />

      <SubmitButton
        label={getResource("common:labelLogin")}
        disabled={!isValid || !isModified}
      />
    </Form>
  );
};

export default LoginForm;
