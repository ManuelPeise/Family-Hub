/** Narrows an unknown value (e.g. parsed JSON or router state) to a plain object. */
const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export default isRecord;
