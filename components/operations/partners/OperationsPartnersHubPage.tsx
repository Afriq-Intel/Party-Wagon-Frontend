"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, Users } from "lucide-react";
import { usePartnerApplications } from "@/lib/operations/partner-applications-context";

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

export function OperationsPartnersHubPage() {
  const { totalCount, pendingCount, partnerDirectoryCount } =
    usePartnerApplications();

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1100px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div>
        <h1 className="font-oswald text-[1.7rem] font-bold uppercase leading-[1.05] tracking-wide text-midnight-party sm:text-[2rem]">
          Manage Partners
        </h1>
        <p className="mt-1.5 max-w-2xl font-outfit text-[13px] leading-relaxed text-midnight-party/60 sm:text-[14px]">
          Review applications, approve partners into the directory, and track
          secure temporary-credential delivery status. Passwords stay out of
          Operations.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="rounded-2xl border border-midnight-party/10 bg-white px-4 py-3">
          <p className="font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/55">
            Total applications
          </p>
          <p className="mt-0.5 font-oswald text-2xl font-bold text-midnight-party">
            {totalCount}
          </p>
        </div>
        <div className="rounded-2xl border border-lemon-twist/40 bg-lemon-twist/15 px-4 py-3">
          <p className="font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/55">
            Pending verification
          </p>
          <p className="mt-0.5 font-oswald text-2xl font-bold text-midnight-party">
            {pendingCount}
          </p>
        </div>
        <div className="rounded-2xl border border-lilac-luster/25 bg-lilac-luster/8 px-4 py-3">
          <p className="font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/55">
            Directory partners
          </p>
          <p className="mt-0.5 font-oswald text-2xl font-bold text-midnight-party">
            {partnerDirectoryCount}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/operations/partners/applications"
          className={`${cardClass} group p-5 transition hover:border-lilac-luster/30 hover:shadow-[0_14px_32px_rgba(109,0,255,0.08)]`}
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-lemon-twist/20 text-midnight-party">
            <ClipboardList size={20} aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-oswald text-xl font-bold uppercase tracking-wide text-midnight-party">
            Applications
          </h2>
          <p className="mt-2 font-outfit text-[13px] leading-relaxed text-midnight-party/60">
            Review submitted Darkstore and Service Provider applications,
            filter by status, and take verification actions.
            {pendingCount > 0
              ? ` ${pendingCount} pending verification.`
              : " No applications are pending verification."}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 font-outfit text-[13px] font-semibold text-lilac-luster transition group-hover:gap-3">
            Open applications
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        </Link>

        <Link
          href="/operations/partners/directory"
          className={`${cardClass} group p-5 transition hover:border-lilac-luster/30 hover:shadow-[0_14px_32px_rgba(109,0,255,0.08)]`}
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-lilac-luster/15 text-lilac-luster">
            <Users size={20} aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-oswald text-xl font-bold uppercase tracking-wide text-midnight-party">
            Partner Directory
          </h2>
          <p className="mt-2 font-outfit text-[13px] leading-relaxed text-midnight-party/60">
            Browse provisioned partners, capabilities, verification and account
            status, plus secure credential-delivery status.
            {partnerDirectoryCount > 0
              ? ` ${partnerDirectoryCount} partner${partnerDirectoryCount === 1 ? "" : "s"} in the directory.`
              : " No partners provisioned yet."}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 font-outfit text-[13px] font-semibold text-lilac-luster transition group-hover:gap-3">
            Open directory
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        </Link>
      </div>
    </main>
  );
}
