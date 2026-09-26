import MuiButton from "@mui/material/Button";
import type React from "react";

interface Props {
  label: string;
  /** Shown while the form is submitting. */
  loadingLabel: string;
  loading: boolean;
}

/** Full-width primary action of a form. Disabled while submitting to prevent double submission. */
const SubmitButton: React.FC<Props> = ({ label, loadingLabel, loading }) => {
  return (
    <MuiButton
      type="submit"
      variant="contained"
      size="large"
      fullWidth
      disabled={loading}
    >
      {loading ? loadingLabel : label}
    </MuiButton>
  );
};

export default SubmitButton;
