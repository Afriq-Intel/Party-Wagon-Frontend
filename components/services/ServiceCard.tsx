import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PartyService } from "@/types/services";
import { getServiceExploreHref } from "@/lib/data/services";
import { Reveal } from "@/components/ui/Reveal";

type ServiceCardProps = {
  service: PartyService;
  variant?: "editorial" | "compact";
  reverse?: boolean;
  delayMs?: number;
};

export function ServiceCard({
  service,
  variant = "editorial",
  reverse = false,
  delayMs = 0,
}: ServiceCardProps) {
  const href = getServiceExploreHref(service);
  const isComingSoon = service.availability === "coming-soon";
  const label = isComingSoon
    ? `${service.name}: coming soon, send an enquiry`
    : `Explore ${service.name}`;

  if (variant === "compact") {
    return (
      <Reveal delayMs={delayMs} className="h-full">
        <article
          id={`service-${service.slug}`}
          className="service-card-hover group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border-[3px] border-midnight-party bg-white shadow-[7px_7px_0_0_rgba(51,16,56,0.16)] transition duration-300 hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <Link
            href={href}
            className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
            aria-label={label}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                quality={90}
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              {isComingSoon ? (
                <span className="absolute left-4 top-4 rounded-full bg-lemon-twist px-3 py-1 font-outfit text-[10px] font-bold uppercase tracking-[0.14em] text-midnight-party">
                  Coming Soon
                </span>
              ) : null}
            </div>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h3 className="font-oswald text-2xl font-bold uppercase leading-tight tracking-wide text-midnight-party">
                {service.name}
              </h3>
              <p className="mt-3 flex-1 font-outfit text-sm leading-relaxed text-midnight-party/75">
                {service.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-outfit text-xs font-semibold uppercase tracking-[0.14em] text-lilac-luster">
                {isComingSoon ? "Register Interest" : "Explore Service"}
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Link>
        </article>
      </Reveal>
    );
  }

  return (
    <Reveal delayMs={delayMs}>
      <article
        id={`service-${service.slug}`}
        className="service-card-hover group overflow-hidden rounded-[2rem] border-[3px] border-midnight-party bg-white shadow-[10px_10px_0_0_rgba(51,16,56,0.14)] transition duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        <Link
          href={href}
          aria-label={label}
          className={`grid focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-lilac-luster lg:grid-cols-2 ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="relative min-h-[16rem] overflow-hidden sm:min-h-[20rem] lg:min-h-[26rem]">
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={90}
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>

          <div className="relative flex flex-col justify-center bg-offwhite/40 p-7 sm:p-10 lg:p-12">
            <p className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-radiant-rose">
              Core service
            </p>
            <h3 className="font-oswald text-[clamp(2rem,4vw,3.25rem)] font-bold uppercase leading-[0.95] tracking-[-0.01em] text-midnight-party">
              {service.name}
            </h3>
            <p className="mt-4 max-w-md font-outfit text-base leading-relaxed text-midnight-party/80 sm:text-lg">
              {service.description}
            </p>
            <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-lilac-luster px-6 py-3 font-outfit text-sm font-semibold uppercase tracking-wide text-white shadow-[5px_5px_0_0_rgba(51,16,56,0.28)] transition group-hover:-translate-y-0.5 group-hover:bg-midnight-party motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
              Explore Service
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                aria-hidden="true"
              />
            </span>
            <p className="mt-3 font-outfit text-xs text-midnight-party/55">
              Browse providers in this category.
            </p>
          </div>
        </Link>
      </article>
    </Reveal>
  );
}
