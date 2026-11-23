import { AuthApiError } from "@/lib/auth/api-error";
import {
  isAuthMockEnabled,
  isMockAccessToken,
  mockFetchCurrentUser,
  mockLoginWithEmailPassword,
  mockLogoutRemote,
  mockRefreshAuthTokens,
} from "@/lib/auth/mock";
import {
  clearTokens,
  getAccessToken,
  getStoredTokens,
  persistTokens,
} from "@/lib/auth/session";
import type {
  AuthApiErrorBody,
  AuthTokens,
  AuthUser,
  LoginResponse,
  RefreshTokenResponse,
} from "@/lib/auth/types";

export { AuthApiError };

function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!base) {
    throw new AuthApiError(
      "API base URL is not configured. Set NEXT_PUBLIC_API_URL.",
      500,
    );
  }
  return base.replace(/\/$/, "");
}

async function parseError(response: Response): Promise<AuthApiError> {
  let body: AuthApiErrorBody | null = null;
  try {
    body = (await response.json()) as AuthApiErrorBody;
  } catch {
    body = null;
  }

  const message =
    body?.error ||
    body?.message ||
    (response.status === 401
      ? "Invalid email or password"
      : response.status === 403
        ? "Account is not active"
        : `Request failed (${response.status})`);

  return new AuthApiError(message, response.status, body?.details);
}

async function requestJson<T>(
  path: string,
  init?: RequestInit & { auth?: boolean },
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  if (init?.auth) {
    const token = getAccessToken();
    if (!token) {
      throw new AuthApiError("Not authenticated", 401);
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers,
    });
  } catch {
    throw new AuthApiError(
      "Unable to reach the authentication server. Check that the API is running and NEXT_PUBLIC_API_URL is correct.",
      0,
    );
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/** POST /auth/login — body: { email, password } */
export async function loginWithEmailPassword(
  email: string,
  password: string,
): Promise<AuthTokens> {
  if (isAuthMockEnabled()) {
    return mockLoginWithEmailPassword(email, password);
  }

  const data = await requestJson<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!data?.tokens?.accessToken || !data?.tokens?.refreshToken) {
    throw new AuthApiError("Login response was missing tokens", 500);
  }

  return data.tokens;
}

/** GET /auth/me — Authorization: Bearer <accessToken> */
export async function fetchCurrentUser(): Promise<AuthUser> {
  if (isAuthMockEnabled()) {
    return mockFetchCurrentUser(getAccessToken());
  }

  return requestJson<AuthUser>("/auth/me", {
    method: "GET",
    auth: true,
  });
}

/** POST /auth/token/refresh — body: { refreshToken } */
export async function refreshAuthTokens(): Promise<AuthTokens> {
  if (isAuthMockEnabled()) {
    const stored = getStoredTokens();
    if (!stored?.refreshToken || !isMockAccessToken(stored.accessToken)) {
      throw new AuthApiError("No refresh token available", 401);
    }
    const tokens = await mockRefreshAuthTokens(stored.refreshToken);
    persistTokens(tokens);
    return tokens;
  }

  const stored = getStoredTokens();
  if (!stored?.refreshToken) {
    throw new AuthApiError("No refresh token available", 401);
  }

  const tokens = await requestJson<RefreshTokenResponse>("/auth/token/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken: stored.refreshToken }),
  });

  if (!tokens?.accessToken || !tokens?.refreshToken) {
    throw new AuthApiError("Refresh response was missing tokens", 500);
  }

  persistTokens(tokens);
  return tokens;
}

/** POST /auth/logout — optional body: { refreshToken } */
export async function logoutRemote(): Promise<void> {
  if (isAuthMockEnabled()) {
    try {
      await mockLogoutRemote();
    } finally {
      clearTokens();
    }
    return;
  }

  const stored = getStoredTokens();
  try {
    await requestJson<void>("/auth/logout", {
      method: "POST",
      body: JSON.stringify(
        stored?.refreshToken ? { refreshToken: stored.refreshToken } : {},
      ),
    });
  } finally {
    clearTokens();
  }
}

/**
 * Loads the current user, refreshing the access token once if needed.
 */
export async function resolveAuthenticatedUser(): Promise<AuthUser | null> {
  const stored = getStoredTokens();
  if (!stored) return null;

  try {
    return await fetchCurrentUser();
  } catch (error) {
    if (!(error instanceof AuthApiError) || error.status !== 401) {
      throw error;
    }
  }

  try {
    await refreshAuthTokens();
    return await fetchCurrentUser();
  } catch {
    clearTokens();
    return null;
  }
}
