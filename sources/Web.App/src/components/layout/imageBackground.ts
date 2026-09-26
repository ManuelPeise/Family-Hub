import type { CSSObject, Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

/**
 * Full-cover background photo under an overlay in the page background color, so text stays
 * readable on any photo: a light veil in light mode, a dark one in dark mode.
 * "hero" leaves the top right of the photo visible and covers the bottom left, where the text sits.
 * "uniform" covers the whole photo evenly, for pages with text spread over the background.
 * Returns an sx function to combine with other styles: sx={[styles, imageBackground(...)]}.
 */
const imageBackground =
  (image: string, overlay: "hero" | "uniform") =>
  (theme: Theme): CSSObject => {
    const veil = (opacity: number) =>
      theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / ${String(opacity)})`
        : alpha(theme.palette.background.default, opacity);

    const gradient =
      overlay === "hero"
        ? `linear-gradient(20deg, ${veil(0.94)} 0%, ${veil(0.82)} 45%, ${veil(0.3)} 100%)`
        : `linear-gradient(${veil(0.82)}, ${veil(0.82)})`;

    return {
      backgroundImage: `${gradient}, url("${image}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  };

export default imageBackground;
