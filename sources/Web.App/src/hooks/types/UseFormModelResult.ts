export interface UseFormModelResult<TModel> {
  /** Current state of the form. */
  model: TModel;
  isModified: boolean;
  isValid: boolean;
  updateModel: (updates: Partial<TModel>) => void;
  resetModel: () => void;
}
