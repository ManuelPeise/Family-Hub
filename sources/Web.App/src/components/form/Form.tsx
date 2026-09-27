import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import React from "react";

interface Props {
  children: React.ReactNode;
  /** Errors are handled by the caller; the form only ignores new submits until this settles. */
  onSubmit: () => void | Promise<void>;
}

/** A form with consistent field spacing. Validation is done by the app, not the browser. */
const Form: React.FC<Props> = ({ children, onSubmit }) => {
  // A ref, not state: it only blocks a second submit (e.g. Enter pressed twice) and needs no render.
  const isSubmittingRef = React.useRef(false);

  const submit = async (): Promise<void> => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    try {
      await onSubmit();
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void submit();
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Stack spacing={2.5}>{children}</Stack>
    </Box>
  );
};

export default Form;
