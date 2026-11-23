import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

type PartnerApplicationSuccessProps = {
  referenceId: string;
  businessName: string;
};

export function PartnerApplicationSuccess({
  referenceId,
  businessName,
}: PartnerApplicationSuccessProps) {
  return (
    <Reveal className="rounded-[1.75rem] border border-midnight-party/10 bg-white p-6 shadow-[8px_8px_0_0_rgba(51,16,56,0.12)] sm:p-8 lg:p-10">
      <div className="mx-auto flex max-w-xl flex-col items-start text-left">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-lagoon/15 text-blue-lagoon">
          <CheckCircle2 size={32} aria-hidden="true" />
        </span>

        <p className="mt-5 font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-lilac-luster">
          Application received
        </p>
        <h2 className="mt-2 font-oswald text-3xl font-bold uppercase leading-none text-midnight-party sm:text-4xl">
          You&apos;re in the queue
        </h2>

        <p className="mt-4 font-outfit text-base leading-relaxed text-midnight-party/80 sm:text-lg">
          Thanks{businessName ? `, ${businessName}` : ""}. Your partner
          application has been{" "}
          <strong className="font-semibold text-midnight-party">
            submitted for Operations verification
          </strong>
          . We&apos;ll review your details before any next steps.
        </p>

        <div
          role="status"
          className="mt-6 w-full rounded-2xl border border-dashed border-lilac-luster/35 bg-lilac-luster/5 px-4 py-4"
        >
          <p className="font-outfit text-[12px] font-semibold uppercase tracking-wide text-lilac-luster">
            Reference
          </p>
          <p className="mt-1 font-outfit text-sm font-semibold text-midnight-party sm:text-base">
            {referenceId}
          </p>
          <p className="mt-3 font-outfit text-sm leading-relaxed text-midnight-party/70">
            No partner account has been created yet. You cannot log in or open a
            partner dashboard from this application. If approved, Operations
            will create your account and send secure temporary credentials
            separately.
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-lemon-twist px-6 py-3 font-outfit text-sm font-semibold uppercase tracking-wide text-midnight-party shadow-[5px_5px_0_0_rgba(51,16,56,0.35)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <Home size={18} aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </Reveal>
  );
}
