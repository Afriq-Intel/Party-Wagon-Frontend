import { Suspense } from "react";
import { AuthRedirectGate } from "@/components/auth/AuthRedirectGate";
import { LoginForm } from "@/components/auth/LoginForm";

function LoginFallback() {
  return (
    <div className="login-shell login-shell--loading">
      <p className="font-outfit text-sm text-midnight-party/65">Loading…</p>
    </div>
  );
}

export default function AccountLoginPage() {
  return (
    <main className="login-page">
      <div className="login-page__frame">
        <AuthRedirectGate>
          <Suspense fallback={<LoginFallback />}>
            <LoginForm />
          </Suspense>
        </AuthRedirectGate>
      </div>
    </main>
  );
}
