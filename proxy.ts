import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { OPS_SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Protects Operations workspace routes.
 * Shared login is at /account; unauthenticated ops requests redirect there.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicOpsRoute =
    pathname === "/operations/login" ||
    pathname.startsWith("/operations/login/") ||
    pathname === "/operations/forgot-password" ||
    pathname.startsWith("/operations/forgot-password/");

  if (isPublicOpsRoute) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.get(OPS_SESSION_COOKIE)?.value === "1";
  if (!hasSession) {
    const loginUrl = new URL("/account", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/operations", "/operations/:path*"],
};
