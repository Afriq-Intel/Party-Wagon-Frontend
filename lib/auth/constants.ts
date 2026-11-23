/** Cookie readable by Next.js proxy for Operations route gating. */
export const OPS_SESSION_COOKIE = "party-wagon-ops-session";

export const ACCESS_TOKEN_STORAGE_KEY = "party-wagon-access-token";
export const REFRESH_TOKEN_STORAGE_KEY = "party-wagon-refresh-token";
export const REMEMBER_ME_STORAGE_KEY = "party-wagon-remember-me";
export const AUTH_CHANGE_EVENT = "party-wagon-auth-change";

/**
 * Browser persistence for mock partner auth mutations (password + status).
 * Secrets stay in this private key — never read into Operations UI.
 */
export const PARTNER_MOCK_AUTH_STORAGE_KEY = "party-wagon-partner-mock-auth-v1";
