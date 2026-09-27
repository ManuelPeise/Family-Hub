import React from "react";

export const useLoadingState = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleIsLoadingChanged = React.useCallback((loading: boolean): void => {
    setIsLoading(loading);
  }, []);

  return {
    isLoading: isLoading,
    handleIsLoadingChanged: handleIsLoadingChanged,
  };
};
