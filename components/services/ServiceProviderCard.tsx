import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { ServiceProvider } from "@/types/services";
import { getServiceEnquiryHref } from "@/lib/data/services";
import { Reveal } from "@/components/ui/Reveal";

type ServiceProviderCardProps = {
  provider: ServiceProvider;
  delayMs?: number;
};

export function ServiceProviderCard({
  provider,
  delayMs = 0,
}: ServiceProviderCardProps) {
  const enquiryHref = getServiceEnquiryHref(
    `${provider.categorySlug}/${provider.slug}`,
  );
  const leadPackage = provider.packages[0];

  return (
    <Reveal delayMs={delayMs} className="h-full">
      <article className="service-card-hover group flex h-full flex-col overflow-hidden rounded-[1.75rem] border-[3px] border-midnight-party bg-white shadow-[7px_7px_0_0_rgba(51,16,56,0.14)] transition duration-300 hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={provider.image}
            alt={provider.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            quality={90}
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          {provider.verified ? (
            <span className="absolute left-4 top-4 rounded-full bg-lemon-twist px-3 py-1 font-outfit text-[10px] font-bold uppercase tracking-[0.14em] text-midnight-party">
              Demo · Verified
            </span>
          ) : (
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 font-outfit text-[10px] font-bold uppercase tracking-[0.14em] text-midnight-party">
              Demo listing
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="font-oswald text-2xl font-bold uppercase leading-tight tracking-wide text-midnight-party">
            {provider.name}
          </h3>

          <p className="mt-2 inline-flex items-start gap-1.5 font-outfit text-xs font-medium uppercase tracking-[0.08em] text-lilac-luster">
            <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              {provider.location}
              <span className="text-midnight-party/45"> · </span>
              {provider.coverage}
            </span>
          </p>

          <p className="mt-3 flex-1 font-outfit text-sm leading-relaxed text-midnight-party/75">
            {provider.description}
          </p>

          {leadPackage ? (
            <div className="mt-4 rounded-xl border border-midnight-party/10 bg-offwhite/50 px-3.5 py-3">
              <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.14em] text-midnight-party/50">
                Available package
              </p>
              <p className="mt-1 font-outfit text-sm font-semibold text-midnight-party">
                {leadPackage.name}
              </p>
              <p className="mt-0.5 font-oswald text-lg font-bold uppercase tracking-wide text-radiant-rose">
                {leadPackage.priceLabel}
              </p>
              {provider.packages.length > 1 ? (
                <p className="mt-1 font-outfit text-xs text-midnight-party/55">
                  +{provider.packages.length - 1} more package
                  {provider.packages.length - 1 === 1 ? "" : "s"}
                </p>
              ) : null}
            </div>
          ) : null}

          <Link
            href={enquiryHref}
            className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-lilac-luster px-5 py-2.5 font-outfit text-xs font-semibold uppercase tracking-wide text-white shadow-[4px_4px_0_0_rgba(51,16,56,0.25)] transition hover:-translate-y-0.5 hover:bg-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            aria-label={`Enquire about ${provider.name}. Booking not confirmed online yet`}
          >
            Enquire
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <p className="mt-2 font-outfit text-[11px] text-midnight-party/50">
            Enquiry only. No booking is confirmed yet.
          </p>
        </div>
      </article>
    </Reveal>
  );
}
