import MuiButton from "@mui/material/Button";
import type React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useLoadingState } from "src/hooks/useLoadingState";

interface Props {
  label: string;
  disabled: boolean;
  size?: "small" | "medium" | "large";
}

const ButtonLoadingIndicator: React.FC = () => {
  return <CircularProgress size={12} color="inherit" />;
};

const SubmitButton: React.FC<Props> = ({ label, disabled, size }) => {
  const { isLoading } = useLoadingState();

  return (
    <MuiButton
      size={size}
      type="submit"
      variant="contained"
      disabled={disabled || isLoading}
    >
      {isLoading ? <ButtonLoadingIndicator /> : label}
    </MuiButton>
  );
};

export default SubmitButton;
