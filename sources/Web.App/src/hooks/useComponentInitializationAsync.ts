import { useEffect, useState } from "react";
import type { ComponentInitializationResult } from "src/hooks/types/ComponentInitializationResult";

interface IComponentInitializationState<TModel> {
  initialized: boolean;
  model: TModel | null;
}

export const useComponentInitializationAsync = <TModel>(
  initializer: () => Promise<TModel | null>,
): ComponentInitializationResult<TModel> => {
  const [initialized, setInitialized] = useState<
    IComponentInitializationState<TModel>
  >({
    initialized: false,
    model: null,
  });

  useEffect(() => {
    let isMounted = true;
    initializer()
      .then((model) => {
        if (isMounted) {
          setInitialized({
            initialized: true,
            model,
          });
        }
      })
      .catch(() => {
        // A failed initialization ends with no model; the component decides what to show.
        if (isMounted) {
          setInitialized({
            initialized: true,
            model: null,
          });
        }
      });
    return () => {
      isMounted = false;
    };
  }, [initializer]);

  return {
    initialized: initialized.initialized,
    model: initialized.model,
  };
};
