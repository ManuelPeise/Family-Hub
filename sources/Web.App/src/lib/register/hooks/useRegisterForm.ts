import { useState } from "react";
import type { ValidationErrors } from "src/hooks/types/ValidationErrors";
import { register } from "src/lib/authentication/authenticationService";
import useAuthenticationForm from "src/lib/authentication/hooks/useAuthenticationForm";
import type { AuthTranslationKey } from "src/lib/authentication/types/AuthTranslationKey";
import type { RegisterFormState } from "src/lib/register/types/RegisterFormState";
import type { RegisterModel } from "src/lib/register/types/RegisterModel";

const initialModel: RegisterModel = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
};

const userNamePattern = /^[a-zA-Z0-9._-]{3,64}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegister = (
  model: RegisterModel,
): ValidationErrors<RegisterModel, AuthTranslationKey> => ({
  userName: userNamePattern.test(model.userName.trim())
    ? undefined
    : "errorUserNameInvalid",
  email: emailPattern.test(model.email.trim())
    ? undefined
    : "errorEmailInvalid",
});

/** Empty optional fields are sent as absent, not as empty strings. */
const optional = (value: string): string | undefined =>
  value.trim() || undefined;

const useRegisterForm = (): RegisterFormState => {
  const [registered, setRegistered] = useState(false);

  const form = useAuthenticationForm(
    initialModel,
    validateRegister,
    "register",
    async (model) => {
      await register({
        firstName: optional(model.firstName),
        lastName: optional(model.lastName),
        userName: model.userName.trim(),
        email: model.email.trim(),
      });
      setRegistered(true);
    },
  );

  return { ...form, registered };
};

export default useRegisterForm;
