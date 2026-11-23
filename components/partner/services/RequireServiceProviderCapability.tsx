"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import {
  findPartnerAccountByEmail,
  getPartnerCapability,
} from "@/lib/auth/partner-mock-store";
import { partnerCapabilityLabel } from "@/lib/data/operations-partner-applications";

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

/**
 * Gates service-provider modules (My Services, Bookings, etc.).
 * Darkstore / unsupported capabilities see a clear workspace notice.
 *
 * Always keeps `{children}` in the React tree (hidden when blocked) so
 * Next.js instant-navigation validation can still see nested route segments.
 */
export function RequireServiceProviderCapability({
  children,
  moduleName = "My Services",
}: {
  children: ReactNode;
  moduleName?: string;
}) {
  const { status, user } = useAuth();
  const partner = user ? findPartnerAccountByEmail(user.email) : undefined;
  const capability = partner
    ? getPartnerCapability(partner.partnerId)
    : null;

  const isAllowed =
    status === "authenticated" && capability === "service_provider";

  const showRestrictedNotice =
    status === "authenticated" &&
    Boolean(user) &&
    capability !== "service_provider";

  const capabilityLabel = capability
    ? partnerCapabilityLabel(capability)
    : "an unsupported capability";

  return (
    <>
      {!isAllowed ? (
        showRestrictedNotice ? (
          <main className="mx-auto flex w-full min-w-0 max-w-[900px] flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <article className={`${cardClass} p-6 sm:p-8`}>
              <p className="font-outfit text-[11px] font-semibold uppercase tracking-[0.16em] text-midnight-party/45">
                Capability restricted
              </p>
              <h1 className="mt-2 font-oswald text-[1.7rem] font-bold uppercase tracking-wide text-midnight-party sm:text-[2rem]">
                {moduleName} unavailable
              </h1>
              <p className="mt-3 max-w-xl font-outfit text-[14px] leading-relaxed text-midnight-party/65">
                This partner is provisioned as {capabilityLabel}. {moduleName} is
                available to service provider workspaces only.
              </p>
              <Link
                href="/partner/dashboard"
                className="mt-6 inline-flex items-center justify-center rounded-full border border-midnight-party/15 bg-white px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
              >
                Back to dashboard
              </Link>
            </article>
          </main>
        ) : (
          <div className="flex flex-1 items-center justify-center px-4 py-10">
            <p className="font-outfit text-sm text-midnight-party/65">
              {status === "loading" ? "Checking session…" : "Redirecting…"}
            </p>
          </div>
        )
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
