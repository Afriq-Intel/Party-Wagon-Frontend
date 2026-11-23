/** Types aligned with Part-Wagon-Backend auth module contracts. */

export type AuthRole =
  | "customer"
  | "store_staff"
  | "driver"
  | "vendor"
  | "ops_staff"
  | string;

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginResponse = {
  tokens: AuthTokens;
  message: string;
};

export type RefreshTokenResponse = AuthTokens;

export type AuthUserProfile = {
  first_name: string | null;
  last_name: string | null;
  preferred_name: string | null;
} | null;

export type AuthUser = {
  id: string;
  email: string;
  phone: string;
  status: string;
  role: AuthRole;
  profile: AuthUserProfile;
};

export type AuthApiErrorBody = {
  error?: string;
  details?: unknown;
  message?: string;
};
