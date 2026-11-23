/**
 * DEVELOPMENT-ONLY mock authentication.
 *
 * Temporary stand-in while the backend auth endpoint is unavailable.
 * Enable with NEXT_PUBLIC_AUTH_MOCK=true. Remove or disable this module
 * when real /auth/login and /auth/me are ready — api.ts will fall back
 * to the network layer automatically.
 *
 * Supports:
 * - Operations: MOCK_OPS_EMAIL / MOCK_OPS_PASSWORD → ops_staff
 * - Partners: approved directory emails + temp/new password → vendor
 *
 * Do NOT treat these credentials or tokens as production secrets.
 * Partner passwords are never exposed in Operations UI.
 */

import type { AuthTokens, AuthUser } from "@/lib/auth/types";
import { AuthApiError } from "@/lib/auth/api-error";
import {
  buildVendorAuthUser,
  findPartnerAccountByEmail,
  findPartnerAccountByPartnerId,
  verifyPartnerMockPassword,
} from "@/lib/auth/partner-mock-store";

export const MOCK_OPS_EMAIL = "ops@partywagon.com";
export const MOCK_OPS_PASSWORD = "Ops123456";

const MOCK_OPS_ACCESS_TOKEN = "mock-ops-access-token";
const MOCK_OPS_REFRESH_TOKEN = "mock-ops-refresh-token";
const MOCK_VENDOR_ACCESS_PREFIX = "mock-vendor-access:";
const MOCK_VENDOR_REFRESH_PREFIX = "mock-vendor-refresh:";

/** Demo Operations user matching the dashboard design reference. */
export const MOCK_OPS_USER: AuthUser = {
  id: "mock-ops-user-001",
  email: MOCK_OPS_EMAIL,
  phone: "+233000000000",
  status: "active",
  role: "ops_staff",
  profile: {
    first_name: "Mary",
    last_name: "Mensah",
    preferred_name: "Mary",
  },
};

export function isAuthMockEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_MOCK === "true";
}

export function isMockAccessToken(token: string | null | undefined): boolean {
  if (!token) return false;
  return (
    token === MOCK_OPS_ACCESS_TOKEN ||
    token.startsWith(MOCK_VENDOR_ACCESS_PREFIX)
  );
}

function partnerIdFromAccessToken(token: string): string | null {
  if (!token.startsWith(MOCK_VENDOR_ACCESS_PREFIX)) return null;
  return token.slice(MOCK_VENDOR_ACCESS_PREFIX.length) || null;
}

function vendorTokensForPartnerId(partnerId: string): AuthTokens {
  return {
    accessToken: `${MOCK_VENDOR_ACCESS_PREFIX}${partnerId}`,
    refreshToken: `${MOCK_VENDOR_REFRESH_PREFIX}${partnerId}`,
  };
}

function delay(ms = 280): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function mockLoginWithEmailPassword(
  email: string,
  password: string,
): Promise<AuthTokens> {
  await delay();

  const normalised = email.trim().toLowerCase();

  // Operations path — unchanged credentials and tokens.
  if (
    normalised === MOCK_OPS_EMAIL.toLowerCase() &&
    password === MOCK_OPS_PASSWORD
  ) {
    return {
      accessToken: MOCK_OPS_ACCESS_TOKEN,
      refreshToken: MOCK_OPS_REFRESH_TOKEN,
    };
  }

  // Partner / vendor path — approved directory accounts only.
  const partner = findPartnerAccountByEmail(normalised);
  if (!partner) {
    throw new AuthApiError("Invalid email or password", 401);
  }

  if (partner.accountStatus === "suspended") {
    throw new AuthApiError("Account is not active", 403);
  }

  if (partner.verificationStatus !== "verified") {
    throw new AuthApiError("Account is not active", 403);
  }

  if (!verifyPartnerMockPassword(partner.partnerId, password)) {
    throw new AuthApiError("Invalid email or password", 401);
  }

  return vendorTokensForPartnerId(partner.partnerId);
}

export async function mockFetchCurrentUser(
  accessToken: string | null,
): Promise<AuthUser> {
  await delay(120);

  if (!accessToken || !isMockAccessToken(accessToken)) {
    throw new AuthApiError("Not authenticated", 401);
  }

  if (accessToken === MOCK_OPS_ACCESS_TOKEN) {
    return { ...MOCK_OPS_USER };
  }

  const partnerId = partnerIdFromAccessToken(accessToken);
  if (!partnerId) {
    throw new AuthApiError("Not authenticated", 401);
  }

  const partner = findPartnerAccountByPartnerId(partnerId);
  if (!partner) {
    throw new AuthApiError("Not authenticated", 401);
  }
  if (partner.accountStatus === "suspended") {
    throw new AuthApiError("Account is not active", 403);
  }

  return buildVendorAuthUser(partner);
}

export async function mockRefreshAuthTokens(
  refreshToken?: string | null,
): Promise<AuthTokens> {
  await delay(120);

  if (
    refreshToken &&
    refreshToken.startsWith(MOCK_VENDOR_REFRESH_PREFIX)
  ) {
    const partnerId = refreshToken.slice(MOCK_VENDOR_REFRESH_PREFIX.length);
    const partner = findPartnerAccountByPartnerId(partnerId);
    if (!partner) {
      throw new AuthApiError("No refresh token available", 401);
    }
    return vendorTokensForPartnerId(partnerId);
  }

  // Default / Ops refresh — preserve previous behaviour.
  return {
    accessToken: MOCK_OPS_ACCESS_TOKEN,
    refreshToken: MOCK_OPS_REFRESH_TOKEN,
  };
}

export async function mockLogoutRemote(): Promise<void> {
  await delay(80);
}
