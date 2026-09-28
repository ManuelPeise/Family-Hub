import React from "react";
import Button from "@mui/material/Button";

interface FormCancelButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  size?: "small" | "medium" | "large";
}

const FormCancelButton: React.FC<FormCancelButtonProps> = ({
  onClick,
  label,
  disabled,
  size,
}) => {
  return (
    <Button onClick={onClick} disabled={disabled} color="secondary" size={size}>
      {label}
    </Button>
  );
};

export default FormCancelButton;
