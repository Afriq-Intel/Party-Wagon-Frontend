import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type BrandCtaLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "filled" | "outline";
  className?: string;
};

/**
 * Homepage CTA pattern — pill + offset shadow + arrow.
 * Matches Party Planner / About cloud button energy.
 */
export function BrandCtaLink({
  href,
  children,
  variant = "filled",
  className = "",
}: BrandCtaLinkProps) {
  if (variant === "outline") {
    return (
      <Link
        href={href}
        className={`group inline-flex items-center gap-3 rounded-full border border-current py-1 pl-5 pr-1 font-outfit text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:bg-midnight-party hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midnight-party ${className}`}
      >
        {children}
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-current transition group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full bg-lemon-twist px-6 py-3 font-outfit text-sm font-semibold uppercase tracking-wide text-midnight-party shadow-[5px_5px_0_0_rgba(51,16,56,0.35)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lemon-twist motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${className}`}
    >
      {children}
      <ArrowRight
        size={18}
        className="transition group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        aria-hidden="true"
      />
    </Link>
  );
}
