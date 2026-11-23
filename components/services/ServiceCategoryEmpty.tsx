import Link from "next/link";
import { SearchX } from "lucide-react";
import { getServiceEnquiryHref } from "@/lib/data/services";

type ServiceCategoryEmptyProps = {
  categorySlug: string;
  categoryName: string;
  hasProvidersInCategory: boolean;
  onReset?: () => void;
};

export function ServiceCategoryEmpty({
  categorySlug,
  categoryName,
  hasProvidersInCategory,
  onReset,
}: ServiceCategoryEmptyProps) {
  return (
    <div className="rounded-[1.75rem] border-[3px] border-dashed border-midnight-party/25 bg-offwhite/40 px-6 py-14 text-center sm:px-10">
      <span
        className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-lilac-luster/10 text-lilac-luster"
        aria-hidden="true"
      >
        <SearchX size={28} />
      </span>
      <h3 className="font-oswald text-3xl font-bold uppercase tracking-wide text-midnight-party">
        {hasProvidersInCategory
          ? "No matches for that search"
          : "No providers onboarded yet"}
      </h3>
      <p className="mx-auto mt-3 max-w-md font-outfit text-sm leading-relaxed text-midnight-party/70 sm:text-base">
        {hasProvidersInCategory
          ? "Try a different name, location, or clear your filters to see everyone in this category."
          : `We're still onboarding ${categoryName.toLowerCase()} partners. Send an enquiry and we'll help you plan in the meantime.`}
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        {hasProvidersInCategory && onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center rounded-full border-[2px] border-midnight-party px-5 py-2.5 font-outfit text-xs font-semibold uppercase tracking-wide text-midnight-party transition hover:bg-midnight-party hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          >
            Clear filters
          </button>
        ) : null}
        <Link
          href={getServiceEnquiryHref(categorySlug)}
          className="inline-flex items-center rounded-full bg-lemon-twist px-5 py-2.5 font-outfit text-xs font-semibold uppercase tracking-wide text-midnight-party shadow-[4px_4px_0_0_rgba(51,16,56,0.25)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lemon-twist motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          Send an enquiry
        </Link>
      </div>
    </div>
  );
}
