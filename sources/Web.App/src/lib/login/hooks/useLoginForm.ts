import type { ValidationErrors } from "src/hooks/types/ValidationErrors";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthenticationForm from "src/lib/authentication/hooks/useAuthenticationForm";
import useAuthenticationState from "src/lib/authentication/hooks/useAuthenticationState";
import type { AuthenticationForm } from "src/lib/authentication/types/AuthenticationForm";
import type { AuthTranslationKey } from "src/lib/authentication/types/AuthTranslationKey";
import type { LoginModel } from "src/lib/login/types/LoginModel";
import isRecord from "src/lib/utils/isRecord";

const initialModel: LoginModel = { userNameOrEmail: "", password: "" };

const validateLogin = (
  model: LoginModel,
): ValidationErrors<LoginModel, AuthTranslationKey> => ({
  userNameOrEmail: model.userNameOrEmail.trim()
    ? undefined
    : "errorUserNameOrEmailRequired",
  password: model.password ? undefined : "errorPasswordRequired",
});

/** Login form state. After success it returns to the page that required the login, or /home. */
const useLoginForm = (): AuthenticationForm<LoginModel> => {
  const { login } = useAuthenticationState();
  const navigate = useNavigate();
  const location = useLocation();

  const state: unknown = location.state;
  const redirectTo =
    isRecord(state) && typeof state.from === "string" ? state.from : "/home";

  return useAuthenticationForm(
    initialModel,
    validateLogin,
    "login",
    async (model) => {
      await login({
        userNameOrEmail: model.userNameOrEmail.trim(),
        password: model.password,
      });
      await navigate(redirectTo, { replace: true });
    },
  );
};

export default useLoginForm;
