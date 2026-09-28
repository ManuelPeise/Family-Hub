import MuiTypography from "@mui/material/Typography";
import type { TypographyProps } from "@mui/material/Typography";
import type React from "react";

interface Props {
  children: React.ReactNode;
  variant?: TypographyProps["variant"];
  /** The rendered element, e.g. "h1" for a page title shown with a smaller variant. */
  component?: React.ElementType;
  color?: "text.primary" | "text.secondary";
  align?: "left" | "center";
}

const Typography: React.FC<Props> = ({
  children,
  variant = "body1",
  component,
  color,
  align,
}) => {
  return (
    <MuiTypography
      variant={variant}
      component={component ?? "p"}
      color={color}
      align={align}
    >
      {children}
    </MuiTypography>
  );
};

export default Typography;
