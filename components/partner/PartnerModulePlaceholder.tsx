"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type PartnerModulePlaceholderProps = {
  title: string;
  description: string;
};

/**
 * Temporary module landing page until catalogue / booking modules land.
 */
export function PartnerModulePlaceholder({
  title,
  description,
}: PartnerModulePlaceholderProps) {
  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[900px] flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <article className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_10px_28px_rgba(51,16,56,0.05)] sm:p-8">
        <p className="font-outfit text-[11px] font-semibold uppercase tracking-[0.16em] text-midnight-party/45">
          Coming soon
        </p>
        <h1 className="mt-2 font-oswald text-[1.7rem] font-bold uppercase tracking-wide text-midnight-party sm:text-[2rem]">
          {title}
        </h1>
        <p className="mt-3 max-w-xl font-outfit text-[14px] leading-relaxed text-midnight-party/65">
          {description}
        </p>
        <Link
          href="/partner/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-midnight-party/15 bg-white px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to dashboard
        </Link>
      </article>
    </main>
  );
}
