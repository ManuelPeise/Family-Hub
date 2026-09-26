import React from "react";
import type { UseFormModelResult } from "src/hooks/types/UseFormModelResult";
import type { ValidationCallback } from "src/hooks/types/ValidationCallback";
import type { ValidationErrors } from "src/hooks/types/ValidationErrors";

export const useFormModel = <
  TModel extends object,
  TMessage extends string = string,
>(
  initialModel: TModel,
  validationCallback?: ValidationCallback<TModel, TMessage>,
): UseFormModelResult<TModel, TMessage> => {
  const [model, setModel] = React.useState(initialModel);

  const updateModel = (updates: Partial<TModel>) => {
    setModel((prevModel) => ({ ...prevModel, ...updates }));
  };

  // Derived from the model on every render, so errors can never be out of date.
  const errors: ValidationErrors<TModel, TMessage> =
    validationCallback?.(model) ?? {};
  const isValid = Object.values(errors).every(
    (message) => message === undefined,
  );

  return { model, updateModel, errors, isValid };
};
