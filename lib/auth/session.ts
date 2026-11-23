import {
  ACCESS_TOKEN_STORAGE_KEY,
  AUTH_CHANGE_EVENT,
  OPS_SESSION_COOKIE,
  REFRESH_TOKEN_STORAGE_KEY,
  REMEMBER_ME_STORAGE_KEY,
} from "@/lib/auth/constants";
import type { AuthTokens } from "@/lib/auth/types";

export { OPS_SESSION_COOKIE };

function canUseStorage() {
  return typeof window !== "undefined";
}

function readTokenPair(storage: Storage): AuthTokens | null {
  try {
    const accessToken = storage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    const refreshToken = storage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    if (!accessToken || !refreshToken) return null;
    return { accessToken, refreshToken };
  } catch {
    return null;
  }
}

export function getRememberMePreference(): boolean {
  if (!canUseStorage()) return true;
  try {
    const stored = window.localStorage.getItem(REMEMBER_ME_STORAGE_KEY);
    if (stored === null) return true;
    return stored === "1";
  } catch {
    return true;
  }
}

export function setRememberMePreference(remember: boolean): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(REMEMBER_ME_STORAGE_KEY, remember ? "1" : "0");
  } catch {
    // Preference is best-effort only.
  }
}

export function getStoredTokens(): AuthTokens | null {
  if (!canUseStorage()) return null;
  return (
    readTokenPair(window.localStorage) ?? readTokenPair(window.sessionStorage)
  );
}

export function getAccessToken(): string | null {
  return getStoredTokens()?.accessToken ?? null;
}

export function persistTokens(
  tokens: AuthTokens,
  remember: boolean = getRememberMePreference(),
): void {
  if (!canUseStorage()) return;

  setRememberMePreference(remember);

  const primary = remember ? window.localStorage : window.sessionStorage;
  const secondary = remember ? window.sessionStorage : window.localStorage;

  try {
    primary.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken);
    primary.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
    secondary.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    secondary.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch {
    // Storage may be unavailable; in-memory auth still works for this page load.
  }

  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearTokens(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    window.sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    window.sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch {
    // Ignore storage failures on logout.
  }
  setOpsSessionCookie(false);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

/**
 * Lightweight presence cookie for proxy.ts Operations route gating.
 * Only set for ops_staff after a successful role-aware login.
 */
export function setOpsSessionCookie(active: boolean): void {
  if (!canUseStorage()) return;
  if (active) {
    document.cookie = `${OPS_SESSION_COOKIE}=1; path=/; SameSite=Lax; max-age=${60 * 60 * 24 * 7}`;
  } else {
    document.cookie = `${OPS_SESSION_COOKIE}=; path=/; SameSite=Lax; max-age=0`;
  }
}

export function subscribeToAuthChanges(onChange: () => void): () => void {
  if (!canUseStorage()) return () => undefined;
  window.addEventListener(AUTH_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
