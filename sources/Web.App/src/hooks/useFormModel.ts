import React from "react";
import isEqual from "lodash/isEqual";
import type { UseFormModelResult } from "src/hooks/types/UseFormModelResult";
import type { ValidationCallback } from "src/hooks/types/ValidationCallback";

/**
 * Holds a form's model. initialModel is read on the first render only, like useState; isModified
 * and resetModel refer to that first value until commitModel replaces it (e.g. after a save).
 */
export const useFormModel = <TModel>(
  initialModel: TModel,
  validationCallback?: ValidationCallback<TModel>,
): UseFormModelResult<TModel> => {
  const [initial, setInitial] = React.useState(initialModel);
  const [model, setModel] = React.useState(initialModel);

  // Functional update: consecutive updates in one event don't overwrite each other.
  const updateModel = React.useCallback((updates: Partial<TModel>) => {
    setModel((current) => ({ ...current, ...updates }));
  }, []);

  const resetModel = React.useCallback(() => {
    setModel(initial);
  }, [initial]);

  // Makes the saved model the new baseline, so the form is no longer modified.
  const commitModel = React.useCallback((savedModel: TModel) => {
    setInitial(savedModel);
    setModel(savedModel);
  }, []);

  // Deep comparison, so memoized.
  const isModified = React.useMemo(
    () => !isEqual(model, initial),
    [model, initial],
  );

  const isValid = validationCallback ? validationCallback(model) : true;

  return { model, updateModel, resetModel, commitModel, isValid, isModified };
};
