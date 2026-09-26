import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import type React from "react";

interface Props {
  /** Announced to screen readers. */
  label: string;
}

const FullPageLoader: React.FC<Props> = ({ label }) => {
  return (
    <Box
      role="status"
      aria-label={label}
      sx={{
        flex: 1,
        display: "grid",
        placeItems: "center",
        bgcolor: "background.default",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default FullPageLoader;
