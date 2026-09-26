import MuiLink from "@mui/material/Link";
import type React from "react";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  /** App-internal path. */
  to: string;
}

const Link: React.FC<Props> = ({ children, to }) => {
  return (
    <MuiLink component={RouterLink} to={to}>
      {children}
    </MuiLink>
  );
};

export default Link;
