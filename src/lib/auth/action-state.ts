export interface AuthActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
  info?: string;
}

export const initialAuthActionState: AuthActionState = {};
