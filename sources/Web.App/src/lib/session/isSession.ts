import type { Session } from "src/lib/session/types/Session.types";
import isRecord from "src/lib/utils/isRecord";

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

/** Narrows the body of GET api/Authentication/Session (SessionResponse) to a Session. */
const isSession = (value: unknown): value is Session =>
  isRecord(value) &&
  typeof value.userName === "string" &&
  typeof value.email === "string" &&
  isStringArray(value.roles) &&
  isStringArray(value.scopes);

export default isSession;
