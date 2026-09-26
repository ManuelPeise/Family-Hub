import { useState } from "react";
import type { ValidationCallback } from "src/hooks/types/ValidationCallback";
import { useFormModel } from "src/hooks/useFormModel";
import parseAuthenticationError from "src/lib/authentication/parseAuthenticationError";
import type { AuthenticationForm } from "src/lib/authentication/types/AuthenticationForm";
import type { AuthTranslationKey } from "src/lib/authentication/types/AuthTranslationKey";

/**
 * Shared form flow of login and registration: client validation (shown after the first submit),
 * server errors (shown at once, cleared when the field changes) and the submitting state.
 */
const useAuthenticationForm = <TModel extends object>(
  initialModel: TModel,
  validate: ValidationCallback<TModel, AuthTranslationKey>,
  context: "login" | "register",
  onSubmit: (model: TModel) => Promise<void>,
): AuthenticationForm<TModel> => {
  const { model, updateModel, errors, isValid } = useFormModel(
    initialModel,
    validate,
  );

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<AuthTranslationKey | null>(null);
  const [serverErrors, setServerErrors] = useState<
    Partial<Record<string, AuthTranslationKey>>
  >({});

  const fieldError = (field: keyof TModel & string) =>
    serverErrors[field] ?? (submitted ? errors[field] : undefined);

  const change = (changes: Partial<TModel>) => {
    updateModel(changes);
    setServerErrors((current) =>
      Object.fromEntries(
        Object.entries(current).filter(([field]) => !(field in changes)),
      ),
    );
  };

  const submitAsync = async () => {
    setSubmitted(true);
    setFormError(null);
    if (!isValid) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(model);
    } catch (error) {
      const parsed = parseAuthenticationError(error, context);
      setFormError(parsed.messageKey);
      setServerErrors(parsed.fieldErrors);
    } finally {
      setSubmitting(false);
    }
  };

  const submit = () => {
    void submitAsync();
  };

  return { model, change, fieldError, formError, submitting, submit };
};

export default useAuthenticationForm;
