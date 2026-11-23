"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import {
  completePartnerFirstLoginPasswordChange,
  findPartnerAccountByEmail,
  getPartnerCapability,
  MOCK_PARTNER_TEMP_PASSWORD,
} from "@/lib/auth/partner-mock-store";
import { partnerCapabilityLabel } from "@/lib/data/operations-partner-applications";
import { getDashboardPathForRole } from "@/lib/auth/roles";

export function PartnerChangePasswordForm() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const passwordId = useId();
  const confirmId = useId();
  const errorId = useId();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const partner = user ? findPartnerAccountByEmail(user.email) : undefined;
  const capability = partner
    ? getPartnerCapability(partner.partnerId)
    : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!partner) {
      setError("Partner account not found for this session.");
      return;
    }

    setLoading(true);
    try {
      const result = completePartnerFirstLoginPasswordChange(
        partner.partnerId,
        password,
        confirm,
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }

      await refreshUser();
      router.replace(getDashboardPathForRole("vendor"));
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <div className="login-shell__media">
        <Image
          src="/assets/about/party-laugh.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 44vw, 100vw"
          className="object-cover object-[center_30%]"
        />
        <div className="login-shell__overlay" aria-hidden="true" />
        <div className="login-shell__brand">
          <Link
            href="/"
            aria-label="Back to Party Wagon home"
            className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          >
            <Image
              src="/assets/brand/logo-dark.svg"
              alt="Party Wagon"
              width={148}
              height={40}
              priority
              className="h-8 w-auto sm:h-9"
            />
          </Link>
        </div>
        <blockquote className="login-shell__quote">
          <p>
            “First login done right: set your password, then we continue the
            party.”
          </p>
        </blockquote>
      </div>

      <div className="login-shell__panel">
        <div className="login-shell__content">
          <p className="font-outfit text-[11px] font-semibold uppercase tracking-[0.16em] text-lilac-luster">
            Partner first login
          </p>
          <h1 className="mt-2 font-oswald text-[1.75rem] font-bold leading-[1.15] tracking-wide text-midnight-party sm:text-[1.9rem]">
            Change your password
          </h1>
          <p className="mt-2.5 font-outfit text-[14px] leading-relaxed text-[#7a7380]">
            You must replace the temporary password before opening the partner
            dashboard.
            {partner ? (
              <>
                {" "}
                Signed in as{" "}
                <span className="font-semibold text-midnight-party">
                  {partner.businessName}
                </span>
                {capability ? (
                  <>
                    {" "}
                    ({partnerCapabilityLabel(capability)})
                  </>
                ) : null}
                .
              </>
            ) : null}
          </p>

          <div
            role="note"
            className="mt-4 rounded-lg border border-dashed border-lilac-luster/40 bg-lilac-luster/5 px-3 py-2.5 font-outfit text-[12px] leading-relaxed text-midnight-party/80"
          >
            Temporary passwords are never shown in Operations. For this mock,
            the initial password is{" "}
            <span className="font-medium">{MOCK_PARTNER_TEMP_PASSWORD}</span>.
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7"
            noValidate
            aria-describedby={error ? errorId : undefined}
          >
            {error ? (
              <div
                id={errorId}
                role="alert"
                className="mb-4 rounded-lg border border-radiant-rose/30 bg-radiant-rose/10 px-3 py-2.5 font-outfit text-sm text-midnight-party"
              >
                {error}
              </div>
            ) : null}

            <div className="space-y-4">
              <div className="login-shell__field">
                <input
                  id={passwordId}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  disabled={loading}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder=" "
                  className="login-shell__input login-shell__input--password"
                />
                <label htmlFor={passwordId} className="login-shell__label">
                  New password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                  className="login-shell__toggle"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} aria-hidden="true" />
                  ) : (
                    <Eye size={17} aria-hidden="true" />
                  )}
                </button>
              </div>

              <div className="login-shell__field">
                <input
                  id={confirmId}
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirm}
                  disabled={loading}
                  onChange={(event) => setConfirm(event.target.value)}
                  placeholder=" "
                  className="login-shell__input"
                />
                <label htmlFor={confirmId} className="login-shell__label">
                  Confirm password
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-shell__submit"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  Saving…
                </>
              ) : (
                "Save password & continue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
