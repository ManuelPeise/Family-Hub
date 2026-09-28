import React from "react";
import { Button } from "@mui/material";

interface FormButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
}

const FormButton: React.FC<FormButtonProps> = ({
  label,
  onClick,
  disabled,
  size,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="contained"
      size={size}
    >
      {label}
    </Button>
  );
};

export default FormButton;
