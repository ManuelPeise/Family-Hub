import { TextField } from "@mui/material";
import React from "react";

interface IProps {
  label: string;
  value: string;
  type?: "text" | "password" | "email";
  autoComplete?: string;
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
}

const FormTextField: React.FC<IProps> = (props) => {
  const { label, value, onChange, error, type, autoComplete } = props;

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <TextField
      label={label}
      value={value}
      variant="standard"
      autoComplete={autoComplete ?? "off"}
      onChange={handleChange}
      error={!!error}
      helperText={error}
      type={type ?? "text"}
      fullWidth
    />
  );
};

export default FormTextField;
