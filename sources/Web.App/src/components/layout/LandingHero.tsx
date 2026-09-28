import Box from "@mui/material/Box";
import MuiButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import MuiTypography from "@mui/material/Typography";
import type React from "react";
import { Link as RouterLink } from "react-router-dom";
import imageBackground from "src/lib/utils/imageBackground";

interface Props {
  /** URL of the background photo (imported asset). */
  backgroundImage?: string;
  appName: string;
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel: string;
  secondaryTo: string;
}

/** Full-height landing section: app name on top, headline and the two entry actions at the bottom. */
const LandingHero: React.FC<Props> = ({
  backgroundImage,
  appName,
  title,
  subtitle,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}) => {
  return (
    <Box
      component="main"
      sx={[
        {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: { xs: 4, sm: 6 },
          bgcolor: "background.default",
          px: { xs: 3, sm: 6, md: 10 },
          pt: { xs: 3, sm: 5 },
          pb: { xs: 5, sm: 8, md: 10 },
        },
        backgroundImage !== undefined &&
          imageBackground(backgroundImage, "hero"),
      ]}
    >
      <MuiTypography variant="h5" component="p">
        {appName}
      </MuiTypography>

      <Stack spacing={{ xs: 3, sm: 4 }} sx={{ maxWidth: 720 }}>
        <MuiTypography variant="h1" sx={{ textWrap: "balance" }}>
          {title}
        </MuiTypography>

        <MuiTypography color="text.secondary" sx={{ maxWidth: "40ch" }}>
          {subtitle}
        </MuiTypography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <MuiButton
            component={RouterLink}
            to={primaryTo}
            variant="contained"
            size="large"
          >
            {primaryLabel}
          </MuiButton>
          <MuiButton
            component={RouterLink}
            to={secondaryTo}
            variant="outlined"
            size="large"
          >
            {secondaryLabel}
          </MuiButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default LandingHero;
