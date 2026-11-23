import Image from "next/image";
import { FloatingShapes } from "@/components/ui/FloatingShapes";
import { Reveal } from "@/components/ui/Reveal";
import { BrandCtaLink } from "@/components/ui/BrandCtaLink";
import { SERVICE_IMAGES } from "@/lib/data/services";

export function ServicesCta() {
  return (
    <section
      className="relative overflow-hidden bg-lilac-luster text-white"
      aria-labelledby="services-cta-heading"
    >
      <FloatingShapes variant="lilac" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:px-8 lg:py-24">
        <Reveal className="relative z-10">
          <p className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-lemon-twist">
            Enquiry open. Bookings coming soon
          </p>
          <h2
            id="services-cta-heading"
            className="font-oswald text-[clamp(2.75rem,8vw,5.75rem)] font-bold uppercase leading-[0.88] tracking-[-0.02em]"
          >
            Your Party.
            <span className="block">Your Vibe.</span>
            <span className="block text-lemon-twist">Our Plug.</span>
          </h2>
          <p className="mt-6 max-w-md font-outfit text-base leading-relaxed text-white/90 sm:text-lg">
            Tell us what you&apos;re planning. Let&apos;s make it happen!
          </p>
          <div className="mt-8">
            <BrandCtaLink href="/planner?intent=enquiry">
              Let&apos;s Plan Your Party
            </BrandCtaLink>
          </div>
        </Reveal>

        <Reveal delayMs={140} className="relative z-10">
          <div className="about-photo-hover relative overflow-hidden rounded-[2rem] border-[3px] border-white shadow-[10px_10px_0_0_rgba(51,16,56,0.35)]">
            <div className="relative aspect-[5/4]">
              <Image
                src={SERVICE_IMAGES.cta}
                alt="Friends toasting with champagne glasses amid falling confetti"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                quality={90}
                className="object-cover object-[center_35%]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
