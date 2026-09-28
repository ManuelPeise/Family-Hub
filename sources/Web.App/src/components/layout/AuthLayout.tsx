import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import MuiTypography from "@mui/material/Typography";
import type React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ArrowBackIcon } from "src/lib/utils/icons";
import imageBackground from "src/lib/utils/imageBackground";

interface Props {
  /** URL of the background photo (imported asset). */
  backgroundImage?: string;
  title: string;
  intro?: string;
  backLabel: string;
  backTo: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** Frame for login and registration: no app bar, one card centered on the page. */
const AuthLayout: React.FC<Props> = ({
  backgroundImage,
  title,
  intro,
  backLabel,
  backTo,
  children,
  footer,
}) => {
  return (
    <Box
      component="main"
      sx={[
        {
          flex: 1,
          display: "grid",
          placeItems: "center",
          bgcolor: "background.default",
          px: 2,
          py: { xs: 3, sm: 5 },
        },
        backgroundImage !== undefined &&
          imageBackground(backgroundImage, "uniform"),
      ]}
    >
      <Box sx={{ width: "100%", maxWidth: 460 }}>
        <MuiLink
          component={RouterLink}
          to={backTo}
          sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2 }}
        >
          <ArrowBackIcon fontSize="small" />
          {backLabel}
        </MuiLink>

        <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, borderRadius: 2 }}>
          <Stack
            spacing={1}
            sx={{
              mb: { xs: 3, sm: 4 },
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <MuiTypography variant="h3" component="h1">
              {title}
            </MuiTypography>
            {intro && (
              <MuiTypography color="text.secondary">{intro}</MuiTypography>
            )}
          </Stack>
          {children}
        </Paper>

        {footer && <Box sx={{ textAlign: "center", mt: 3 }}>{footer}</Box>}
      </Box>
    </Box>
  );
};

export default AuthLayout;
