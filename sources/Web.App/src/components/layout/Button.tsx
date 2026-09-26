import MuiButton from "@mui/material/Button";
import type React from "react";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  /** Renders the button as a router link to this path. */
  to?: string;
  onClick?: () => void;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary";
  size?: "medium" | "large";
  fullWidth?: boolean;
}

const Button: React.FC<Props> = ({
  children,
  to,
  onClick,
  variant = "contained",
  color = "primary",
  size = "medium",
  fullWidth = false,
}) => {
  if (to !== undefined) {
    return (
      <MuiButton
        component={RouterLink}
        to={to}
        variant={variant}
        color={color}
        size={size}
        fullWidth={fullWidth}
      >
        {children}
      </MuiButton>
    );
  }

  return (
    <MuiButton
      onClick={onClick}
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
