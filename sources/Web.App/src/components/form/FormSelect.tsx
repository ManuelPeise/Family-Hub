import { MenuItem, TextField } from "@mui/material";
import React from "react";

interface Props {
  label: string;
  value: number;
  options: { label: string; value: number }[];
  error?: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}

const FormSelect: React.FC<Props> = (props) => {
  const { label, value, options, error, disabled, onChange } = props;

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Typed as string, but MUI passes the MenuItem's number value through.
      const selectedValue = Number(e.target.value);
      const selected = options.find((option) => option.value === selectedValue);

      if (selected) {
        onChange(selected.value);
      }
    },
    [options, onChange],
  );

  return (
    <TextField
      select
      label={label}
      value={value}
      variant="standard"
      onChange={handleChange}
      error={!!error}
      helperText={error}
      fullWidth
      disabled={disabled}
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          selected={value === option.value}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default FormSelect;
