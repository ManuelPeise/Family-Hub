import type { Shadows } from "@mui/material/styles";

/*
 * Restrained elevation: soft, low-opacity shadows that grow slowly with the level.
 * Dark mode relies on the background.paper / background.elevated surface steps instead,
 * because shadows are barely visible on dark backgrounds.
 */

const createShadow = (level: number): string => {
  const offsetY = Math.ceil(level / 2);
  const blur = level * 2 + 2;
  const opacity = Math.min(0.05 + level * 0.005, 0.14);

  return `0 1px 2px rgba(15, 23, 42, 0.04), 0 ${String(offsetY)}px ${String(blur)}px rgba(15, 23, 42, ${String(opacity)})`;
};

export const shadows: Shadows = [
  "none",
  createShadow(1),
  createShadow(2),
  createShadow(3),
  createShadow(4),
  createShadow(5),
  createShadow(6),
  createShadow(7),
  createShadow(8),
  createShadow(9),
  createShadow(10),
  createShadow(11),
  createShadow(12),
  createShadow(13),
  createShadow(14),
  createShadow(15),
  createShadow(16),
  createShadow(17),
  createShadow(18),
  createShadow(19),
  createShadow(20),
  createShadow(21),
  createShadow(22),
  createShadow(23),
  createShadow(24),
];
