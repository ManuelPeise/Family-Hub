import type { ValidationErrors } from "src/hooks/types/ValidationErrors";

export interface UseFormModelResult<TModel, TMessage extends string = string> {
  /** Current state of the form. */
  model: TModel;
  /** Merges the given fields into the model. */
  updateModel: (updates: Partial<TModel>) => void;
  /** Result of the validation callback for the current model. */
  errors: ValidationErrors<TModel, TMessage>;
  /** true when the validation callback reports no errors (always true without a callback). */
  isValid: boolean;
}
