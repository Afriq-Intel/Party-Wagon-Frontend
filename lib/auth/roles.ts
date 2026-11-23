import type { AuthRole } from "@/lib/auth/types";

/**
 * Roles permitted to enter the Operations workspace.
 * Sourced from backend seed_rbac.sql (`ops_staff`).
 */
export const OPERATIONS_ROLES: readonly AuthRole[] = ["ops_staff"] as const;

export function isOperationsRole(role: AuthRole | null | undefined): boolean {
  if (!role) return false;
  return OPERATIONS_ROLES.includes(role);
}

/**
 * Post-login destination for each backend role.
 * Unbuilt workspaces still get a dedicated route shell so redirects stay correct.
 */
export function getDashboardPathForRole(
  role: AuthRole | null | undefined,
): string {
  switch (role) {
    case "ops_staff":
      return "/operations/dashboard";
    case "driver":
      return "/driver/dashboard";
    case "vendor":
      return "/partner/dashboard";
    case "store_staff":
      return "/store/dashboard";
    case "customer":
    default:
      return "/account/dashboard";
  }
}
