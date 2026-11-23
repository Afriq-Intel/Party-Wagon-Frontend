import Image from "next/image";
import { FloatingShapes } from "@/components/ui/FloatingShapes";
import { Reveal } from "@/components/ui/Reveal";
import { BrandCtaLink } from "@/components/ui/BrandCtaLink";
import { PARTNER_APPLY_PATH } from "@/lib/data/partner-application";

export function PartnerBanner() {
  return (
    <section
      className="relative overflow-hidden bg-radiant-rose text-white"
      aria-labelledby="partner-banner-heading"
    >
      <FloatingShapes variant="mixed" />
      <div className="relative mx-auto min-h-0 max-w-7xl lg:min-h-[34rem]">
        <Reveal className="relative z-10 px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8 lg:py-16 lg:pr-12">
          <div className="mb-6 flex items-center gap-3">
            <span
              className="text-lemon-twist animate-spin-slow"
              aria-hidden="true"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1.5 13.8 8.2 20.5 10 13.8 11.8 12 18.5 10.2 11.8 3.5 10 10.2 8.2 12 1.5Z" />
              </svg>
            </span>
            <p className="font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-white/90 sm:text-sm">
              Partner with Party Wagon
            </p>
          </div>

          <h2
            id="partner-banner-heading"
            className="font-oswald text-5xl font-bold uppercase leading-none text-lemon-twist sm:text-6xl lg:text-7xl"
          >
            Become a Partner
          </h2>

          <p className="mt-6 max-w-md font-outfit text-base leading-relaxed text-white/90 sm:text-lg">
            Got a darkstore or party service? Join the plug that brings the
            party. Apply today. Operations verifies every application before
            any account is created.
          </p>

          <div className="mt-8">
            <BrandCtaLink href={PARTNER_APPLY_PATH}>
              Become a Partner
            </BrandCtaLink>
          </div>
        </Reveal>

        <Reveal
          delayMs={140}
          className="group relative aspect-[4/5] overflow-hidden sm:aspect-[3/4] lg:absolute lg:inset-y-0 lg:left-1/2 lg:aspect-auto lg:right-[calc((100%-100vw)/2)]"
        >
          <Image
            src="/assets/services/mobile-bar-services.jpg"
            alt="Mobile bar service partner pouring drinks at an event"
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-[center_22%] transition duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-radiant-rose/90 to-transparent lg:hidden"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-radiant-rose to-transparent lg:block"
            aria-hidden="true"
          />
        </Reveal>
      </div>
    </section>
  );
}
