import React from "react";
import isEqual from "lodash/isEqual";
import type { UseFormModelResult } from "src/hooks/types/UseFormModelResult";
import type { ValidationCallback } from "src/hooks/types/ValidationCallback";

/**
 * Holds a form's model. initialModel is read on the first render only, like useState; isModified
 * and resetModel refer to that first value.
 */
export const useFormModel = <TModel>(
  initialModel: TModel,
  validationCallback?: ValidationCallback<TModel>,
): UseFormModelResult<TModel> => {
  const [initial] = React.useState(initialModel);
  const [model, setModel] = React.useState(initialModel);

  // Functional update: consecutive updates in one event don't overwrite each other.
  const updateModel = React.useCallback((updates: Partial<TModel>) => {
    setModel((current) => ({ ...current, ...updates }));
  }, []);

  const resetModel = React.useCallback(() => {
    setModel(initial);
  }, [initial]);

  // Deep comparison, so memoized.
  const isModified = React.useMemo(
    () => !isEqual(model, initial),
    [model, initial],
  );

  const isValid = validationCallback ? validationCallback(model) : true;

  return { model, updateModel, resetModel, isValid, isModified };
};
