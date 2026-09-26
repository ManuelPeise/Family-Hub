import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import type React from "react";

interface Props {
  children: React.ReactNode;
  onSubmit: () => void;
}

/** A form with consistent field spacing. Validation is done by the app, not the browser. */
const Form: React.FC<Props> = ({ children, onSubmit }) => {
  return (
    <Box
      component="form"
      noValidate
      onSubmit={(event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Stack spacing={2.5}>{children}</Stack>
    </Box>
  );
};

export default Form;
