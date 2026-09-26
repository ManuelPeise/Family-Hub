import MuiTextField from "@mui/material/TextField";
import type React from "react";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Shown instead of the helper text and marks the field as invalid. */
  error?: string;
  helperText?: string;
  type?: "text" | "email";
  autoComplete?: string;
  autoFocus?: boolean;
  required?: boolean;
}

const TextField: React.FC<Props> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  type = "text",
  autoComplete,
  autoFocus = false,
  required = false,
}) => {
  return (
    <MuiTextField
      label={label}
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      error={error !== undefined}
      helperText={error ?? helperText}
      type={type}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      required={required}
    />
  );
};

export default TextField;
