export type Session = {
  userName: string;
  email: string;
  roles: string[];
  scopes: string[];
};

export type SessionContextValue = {
  session: Session | null;
  setSession: UpdateSessionCallback;
};

export type UpdateSessionCallback = (session: Session | null) => void;
