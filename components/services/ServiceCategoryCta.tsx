import { FloatingShapes } from "@/components/ui/FloatingShapes";
import { Reveal } from "@/components/ui/Reveal";
import { BrandCtaLink } from "@/components/ui/BrandCtaLink";
import type { ServiceCategory } from "@/types/services";
import { getServiceEnquiryHref } from "@/lib/data/services";

type ServiceCategoryCtaProps = {
  category: ServiceCategory;
};

export function ServiceCategoryCta({ category }: ServiceCategoryCtaProps) {
  return (
    <section
      className="relative overflow-hidden bg-radiant-rose text-white"
      aria-labelledby={`${category.slug}-cta-heading`}
    >
      <FloatingShapes variant="mixed" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal className="max-w-2xl">
          <p className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-lemon-twist">
            Enquiry open. Bookings coming soon
          </p>
          <h2
            id={`${category.slug}-cta-heading`}
            className="font-oswald text-[clamp(2.5rem,7vw,4.75rem)] font-bold uppercase leading-[0.9] tracking-[-0.02em]"
          >
            Ready to lock in
            <span className="block text-lemon-twist">your {category.shortName.toLowerCase()}?</span>
          </h2>
          <p className="mt-5 max-w-lg font-outfit text-base leading-relaxed text-white/90 sm:text-lg">
            Tell us the date, guest count, and vibe. We&apos;ll help you connect
            with the right {category.shortName.toLowerCase()}. No booking is
            confirmed until you hear back from us.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BrandCtaLink href={getServiceEnquiryHref(category.slug)}>
              Let&apos;s plan your party
            </BrandCtaLink>
            <a
              href="/services"
              className="inline-flex items-center rounded-full border border-white/50 px-5 py-3 font-outfit text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lemon-twist"
            >
              All services
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
