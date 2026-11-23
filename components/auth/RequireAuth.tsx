"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import {
  findPartnerAccountByEmail,
  partnerRequiresPasswordChange,
} from "@/lib/auth/partner-mock-store";
import {
  getPostLoginPath,
  PARTNER_CHANGE_PASSWORD_PATH,
} from "@/lib/auth/post-login";
import { getDashboardPathForRole } from "@/lib/auth/roles";
import type { AuthRole } from "@/lib/auth/types";

type RequireAuthProps = {
  children: ReactNode;
  /** If set, only these roles may view the page. Others are sent to their own dashboard. */
  allowedRoles?: readonly AuthRole[];
};

/**
 * Client auth gate for workspace routes.
 *
 * Always keeps `{children}` in the React tree (hidden while gating) so
 * Next.js Cache Components / instant-navigation validation can still see
 * nested route segments. Omitting children during the loading state is what
 * caused `dashboard/page.tsx` to be "dropped from rendering".
 */
export function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const router = useRouter();
  const { status, user } = useAuth();

  const roleAllowed =
    !allowedRoles || (user ? allowedRoles.includes(user.role) : false);

  const isAllowed =
    status === "authenticated" && Boolean(user) && roleAllowed;

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !user) {
      router.replace("/account");
      return;
    }

    if (!roleAllowed) {
      router.replace(getPostLoginPath(user));
    }
  }, [status, user, roleAllowed, router]);

  const gateMessage =
    status === "loading" ? "Checking session…" : "Redirecting…";

  return (
    <>
      {!isAllowed ? (
        <div className="flex min-h-screen items-center justify-center bg-[#f6f2f5] px-4">
          <p className="font-outfit text-sm text-midnight-party/65">
            {gateMessage}
          </p>
        </div>
      ) : null}

      <div
        className={isAllowed ? "contents" : "hidden"}
        aria-hidden={!isAllowed}
        // Keep the route segment mounted for Cache Components validation
        // even while the session gate is unresolved.
      >
        {children}
      </div>
    </>
  );
}

/** Convenience gate for Operations routes. */
export function RequireOperationsAuth({ children }: { children: ReactNode }) {
  return <RequireAuth allowedRoles={["ops_staff"]}>{children}</RequireAuth>;
}

/**
 * Partner dashboard gate — vendor role required, and first-login password
 * change must be completed before dashboard access.
 */
export function RequirePartnerDashboardAuth({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { status, user } = useAuth();

  const partner =
    user?.role === "vendor"
      ? findPartnerAccountByEmail(user.email)
      : undefined;
  const needsPasswordChange = partnerRequiresPasswordChange(partner);
  const roleAllowed = user?.role === "vendor";
  const isAllowed =
    status === "authenticated" &&
    Boolean(user) &&
    roleAllowed &&
    !needsPasswordChange;

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !user) {
      router.replace("/account");
      return;
    }

    if (user.role !== "vendor") {
      router.replace(getDashboardPathForRole(user.role));
      return;
    }

    // Change-password lives outside this workspace layout, so pathname
    // checks are unnecessary here — and usePathname() blocks prerender.
    if (needsPasswordChange) {
      router.replace(PARTNER_CHANGE_PASSWORD_PATH);
    }
  }, [status, user, needsPasswordChange, router]);

  const gateMessage =
    status === "loading" ? "Checking session…" : "Redirecting…";

  return (
    <>
      {!isAllowed ? (
        <div className="flex min-h-screen items-center justify-center bg-[#f6f2f5] px-4">
          <p className="font-outfit text-sm text-midnight-party/65">
            {gateMessage}
          </p>
        </div>
      ) : null}
      <div
        className={isAllowed ? "contents" : "hidden"}
        aria-hidden={!isAllowed}
      >
        {children}
      </div>
    </>
  );
}

/** Partner change-password gate — vendor only; active partners skip to dashboard. */
export function RequirePartnerChangePasswordAuth({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { status, user } = useAuth();

  const partner =
    user?.role === "vendor"
      ? findPartnerAccountByEmail(user.email)
      : undefined;
  const needsPasswordChange = partnerRequiresPasswordChange(partner);
  const isAllowed =
    status === "authenticated" &&
    user?.role === "vendor" &&
    needsPasswordChange;

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !user) {
      router.replace("/account");
      return;
    }

    if (user.role !== "vendor") {
      router.replace(getPostLoginPath(user));
      return;
    }

    if (!needsPasswordChange) {
      router.replace(getDashboardPathForRole("vendor"));
    }
  }, [status, user, needsPasswordChange, router]);

  const gateMessage =
    status === "loading" ? "Checking session…" : "Redirecting…";

  return (
    <>
      {!isAllowed ? (
        <div className="flex min-h-screen items-center justify-center bg-[#f6f2f5] px-4">
          <p className="font-outfit text-sm text-midnight-party/65">
            {gateMessage}
          </p>
        </div>
      ) : null}
      <div
        className={isAllowed ? "contents" : "hidden"}
        aria-hidden={!isAllowed}
      >
        {children}
      </div>
    </>
  );
}
