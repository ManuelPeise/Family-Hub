import MuiStack from "@mui/material/Stack";
import type React from "react";

interface Props {
  children: React.ReactNode;
  /** Gap between the children in theme spacing units. */
  spacing?: number;
}

/** Stacks its children vertically with a consistent gap. */
const StackContainer: React.FC<Props> = ({ children, spacing = 2 }) => {
  return <MuiStack spacing={spacing}>{children}</MuiStack>;
};

export default StackContainer;
