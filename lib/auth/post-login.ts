import {
  findPartnerAccountByEmail,
  partnerRequiresPasswordChange,
} from "@/lib/auth/partner-mock-store";
import { getDashboardPathForRole } from "@/lib/auth/roles";
import type { AuthUser } from "@/lib/auth/types";

export const PARTNER_CHANGE_PASSWORD_PATH = "/partner/change-password";

/**
 * Role-aware post-login destination.
 * Partners with pending_first_login must change password before the dashboard.
 */
export function getPostLoginPath(
  user: AuthUser,
  nextParam: string | null = null,
): string {
  if (user.role === "vendor") {
    const partner = findPartnerAccountByEmail(user.email);
    // Prefer live store status; fall back to auth user status from /me.
    if (
      partnerRequiresPasswordChange(partner) ||
      (!partner && user.status === "pending_first_login")
    ) {
      return PARTNER_CHANGE_PASSWORD_PATH;
    }
    return getDashboardPathForRole("vendor");
  }

  const fallback = getDashboardPathForRole(user.role);
  if (!nextParam || !nextParam.startsWith("/") || nextParam.startsWith("//")) {
    return fallback;
  }

  // Only honour same-origin relative paths for the user's role workspace.
  if (user.role === "ops_staff" && nextParam.startsWith("/operations")) {
    return nextParam;
  }

  return fallback;
}
