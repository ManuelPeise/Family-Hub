import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MuiTextField from "@mui/material/TextField";
import type React from "react";
import { useState } from "react";
import { VisibilityIcon, VisibilityOffIcon } from "src/components/layout/icons";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Shown instead of the helper text and marks the field as invalid. */
  error?: string;
  helperText?: string;
  autoComplete: "current-password" | "new-password";
  showPasswordLabel: string;
  hidePasswordLabel: string;
  required?: boolean;
}

const PasswordField: React.FC<Props> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  autoComplete,
  showPasswordLabel,
  hidePasswordLabel,
  required = false,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <MuiTextField
      label={label}
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      error={error !== undefined}
      helperText={error ?? helperText}
      type={visible ? "text" : "password"}
      autoComplete={autoComplete}
      required={required}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                aria-label={visible ? hidePasswordLabel : showPasswordLabel}
                onClick={() => {
                  setVisible((current) => !current);
                }}
              >
                {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default PasswordField;
