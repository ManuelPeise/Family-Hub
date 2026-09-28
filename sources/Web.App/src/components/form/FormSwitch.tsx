import { Switch, FormControlLabel } from "@mui/material";
import React from "react";

interface IProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

const FormSwitch: React.FC<IProps> = (props) => {
  const { label, checked, onChange, disabled } = props;

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    },
    [onChange],
  );

  return (
    <FormControlLabel
      control={
        <Switch checked={checked} onChange={handleChange} disabled={disabled} />
      }
      label={label}
    />
  );
};

export default FormSwitch;
