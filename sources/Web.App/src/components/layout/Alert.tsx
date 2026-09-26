import MuiAlert from "@mui/material/Alert";
import type React from "react";

interface Props {
  children: React.ReactNode;
  severity: "error" | "warning" | "info" | "success";
}

/** Shows its icon too, so the state is never communicated by color alone. */
const Alert: React.FC<Props> = ({ children, severity }) => {
  return <MuiAlert severity={severity}>{children}</MuiAlert>;
};

export default Alert;
