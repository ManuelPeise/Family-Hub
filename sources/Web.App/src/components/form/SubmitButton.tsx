import MuiButton from "@mui/material/Button";
import type React from "react";

interface Props {
  label: string;
  /** Shown while the form is submitting. */
  loadingLabel: string;
  loading: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
}

/** Full-width primary action of a form. Disabled while submitting to prevent double submission. */
const SubmitButton: React.FC<Props> = ({
  label,
  loadingLabel,
  loading,
  disabled,
  size,
}) => {
  return (
    <MuiButton
      size={size}
      type="submit"
      variant="contained"
      disabled={loading || disabled}
    >
      {loading ? loadingLabel : label}
    </MuiButton>
  );
};

export default SubmitButton;
