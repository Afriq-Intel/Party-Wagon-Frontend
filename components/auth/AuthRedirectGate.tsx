"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { getPostLoginPath } from "@/lib/auth/post-login";

/**
 * For the shared login page: send already-authenticated users to their dashboard.
 * Keeps the first client render identical to the server to avoid hydration mismatches.
 */
export function AuthRedirectGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status, user } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (status === "authenticated" && user) {
      router.replace(getPostLoginPath(user));
    }
  }, [ready, status, user, router]);

  const showGate =
    !ready ||
    status === "loading" ||
    (status === "authenticated" && Boolean(user));

  if (showGate) {
    return (
      <div className="login-shell login-shell--loading">
        <p className="font-outfit text-sm text-midnight-party/65">
          {!ready || status === "loading"
            ? "Checking session…"
            : "Redirecting to your dashboard…"}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
