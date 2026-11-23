"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { AuthApiError } from "@/lib/auth/api";
import { useAuth } from "@/lib/auth/auth-context";
import {
  isAuthMockEnabled,
  MOCK_OPS_EMAIL,
  MOCK_OPS_PASSWORD,
} from "@/lib/auth/mock";
import { MOCK_PARTNER_TEMP_PASSWORD } from "@/lib/auth/partner-mock-store";
import { getPostLoginPath } from "@/lib/auth/post-login";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();
  const errorId = useId();
  const mockEnabled = isAuthMockEnabled();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(trimmedEmail, password, { remember });
      router.replace(getPostLoginPath(user, searchParams.get("next")));
    } catch (err) {
      if (err instanceof AuthApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
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
            “Where the party dey, we dey: everything we need to celebrate,
            sorted.”
          </p>
        </blockquote>
      </div>

      <div className="login-shell__panel">
        <div className="login-shell__content">
          <h1 className="font-oswald text-[1.75rem] font-bold leading-[1.15] tracking-wide text-midnight-party sm:text-[1.9rem]">
            Welcome back to Party Wagon
          </h1>
          <p className="mt-2.5 font-outfit text-[14px] leading-relaxed text-[#7a7380]">
            Sign in to your account and we&apos;ll take you to the right
            dashboard for your role.
          </p>

          {mockEnabled ? (
            <div
              role="note"
              className="mt-4 rounded-lg border border-dashed border-lilac-luster/40 bg-lilac-luster/5 px-3 py-2.5 font-outfit text-[12px] leading-relaxed text-midnight-party/80"
            >
              <p className="font-semibold text-lilac-luster">
                Development mock authentication
              </p>
              <p className="mt-1">
                Backend auth is not ready. Operations:{" "}
                <span className="font-medium">{MOCK_OPS_EMAIL}</span> /{" "}
                <span className="font-medium">{MOCK_OPS_PASSWORD}</span>.
                Approved partners use their directory email with temporary
                password{" "}
                <span className="font-medium">{MOCK_PARTNER_TEMP_PASSWORD}</span>{" "}
                (then change password on first login). Disable with{" "}
                <code className="rounded bg-black/5 px-1">
                  NEXT_PUBLIC_AUTH_MOCK=false
                </code>
                .
              </p>
            </div>
          ) : null}

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
                  id={emailId}
                  name="email"
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  required
                  value={email}
                  disabled={loading}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder=" "
                  className="login-shell__input"
                />
                <label htmlFor={emailId} className="login-shell__label">
                  Email
                </label>
              </div>

              <div>
                <div className="login-shell__field">
                  <input
                    id={passwordId}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    minLength={8}
                    value={password}
                    disabled={loading}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder=" "
                    className="login-shell__input login-shell__input--password"
                  />
                  <label htmlFor={passwordId} className="login-shell__label">
                    Password
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

                <div className="mt-3 flex items-center justify-between gap-3">
                  <Link
                    href="/account/forgot-password"
                    className="font-outfit text-[13px] font-medium text-lilac-luster underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
                  >
                    Forgot password?
                  </Link>

                  <div className="inline-flex items-center gap-2">
                    <span className="font-outfit text-[13px] text-[#6f6874]">
                      Remember sign in details
                    </span>
                    <button
                      id={rememberId}
                      type="button"
                      role="switch"
                      aria-checked={remember}
                      aria-label="Remember sign in details"
                      disabled={loading}
                      onClick={() => setRemember((prev) => !prev)}
                      className="login-shell__switch"
                    >
                      <span
                        className="login-shell__switch-thumb"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
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
                  Logging in…
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="mt-7 text-center font-outfit text-[14px] text-[#7a7380]">
            Don&apos;t have an account?{" "}
            <span
              className="font-semibold text-lilac-luster/55"
              title="Registration UI is not available yet"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
