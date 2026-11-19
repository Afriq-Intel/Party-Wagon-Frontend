import Link from "next/link";
import { ArrowRight } from "lucide-react";

type SeeAllLinkProps = {
  href: string;
  label?: string;
  className?: string;
};

export function SeeAllLink({
  href,
  label = "See All",
  className = "",
}: SeeAllLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 font-outfit text-sm font-semibold text-midnight-party transition hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster ${className}`}
    >
      {label}
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}
