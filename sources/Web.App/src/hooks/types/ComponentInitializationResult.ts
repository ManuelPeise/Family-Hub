export interface ComponentInitializationResult<TModel> {
  initialized: boolean;
  model: TModel | null;
}
