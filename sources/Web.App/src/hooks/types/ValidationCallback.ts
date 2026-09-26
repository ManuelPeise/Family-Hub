import type { ValidationErrors } from "src/hooks/types/ValidationErrors";

/** Validates the whole model. Keep it outside the component so it stays a pure function. */
export type ValidationCallback<TModel, TMessage extends string = string> = (
  model: TModel,
) => ValidationErrors<TModel, TMessage>;
