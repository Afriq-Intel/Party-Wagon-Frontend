import { Suspense } from "react";
import { RequirePartnerChangePasswordAuth } from "@/components/auth/RequireAuth";
import { PartnerChangePasswordForm } from "@/components/auth/PartnerChangePasswordForm";

function ChangePasswordFallback() {
  return (
    <div className="login-shell login-shell--loading">
      <p className="font-outfit text-sm text-midnight-party/65">Loading…</p>
    </div>
  );
}

export default function PartnerChangePasswordPage() {
  return (
    <RequirePartnerChangePasswordAuth>
      <main className="login-page">
        <div className="login-page__frame">
          <Suspense fallback={<ChangePasswordFallback />}>
            <PartnerChangePasswordForm />
          </Suspense>
        </div>
      </main>
    </RequirePartnerChangePasswordAuth>
  );
}
