export interface UseFormModelResult<TModel> {
  /** Current state of the form. */
  model: TModel;
  isModified: boolean;
  isValid: boolean;
  updateModel: (updates: Partial<TModel>) => void;
  resetModel: () => void;
  /** Replaces the baseline and the model, e.g. with the saved model after a submit. */
  commitModel: (savedModel: TModel) => void;
}
