import Image from "next/image";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

/**
 * Placeholder until the password-reset UI is built.
 * Backend already exposes POST /auth/password/forgot and POST /auth/password/reset.
 */
export default function AccountForgotPasswordPage() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-[0_16px_40px_rgba(51,16,56,0.08)] sm:p-8">
          <Image
            src="/assets/brand/logo-lilac.svg"
            alt="Party Wagon"
            width={160}
            height={42}
            className="h-9 w-auto"
          />
          <p className="mt-4 font-outfit text-[11px] font-semibold uppercase tracking-[0.22em] text-radiant-rose">
            Your Account
          </p>
          <h1 className="mt-3 font-oswald text-3xl font-bold uppercase tracking-wide text-midnight-party">
            Reset password
          </h1>
          <p className="mt-3 font-outfit text-sm leading-relaxed text-midnight-party/65">
            Password reset is not wired in the UI yet. The backend supports{" "}
            <code className="rounded bg-[#faf7f9] px-1.5 py-0.5 text-xs">
              POST /auth/password/forgot
            </code>{" "}
            and{" "}
            <code className="rounded bg-[#faf7f9] px-1.5 py-0.5 text-xs">
              POST /auth/password/reset
            </code>
            .
          </p>
          <Link
            href="/account"
            className="mt-6 inline-flex rounded-full bg-lemon-twist px-5 py-2.5 font-outfit text-sm font-semibold uppercase tracking-wide text-midnight-party shadow-[4px_4px_0_0_rgba(51,16,56,0.3)] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lemon-twist"
          >
            Back to sign in
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
