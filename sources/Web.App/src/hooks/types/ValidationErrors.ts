/** Error message (or translation key) per field. A missing entry means the field is valid. */
export type ValidationErrors<
  TModel,
  TMessage extends string = string,
> = Partial<Record<keyof TModel, TMessage>>;
