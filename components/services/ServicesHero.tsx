import Image from "next/image";
import { ExpandingLogo } from "@/components/home/ExpandingLogo";
import { FloatingShapes } from "@/components/ui/FloatingShapes";
import { HeroPhotoTint } from "@/components/ui/HeroPhotoTint";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { BrandCtaLink } from "@/components/ui/BrandCtaLink";
import { SERVICE_IMAGES, SERVICES_MARQUEE } from "@/lib/data/services";

export function ServicesHero() {
  return (
    <section
      className="relative overflow-hidden bg-midnight-party text-white"
      aria-labelledby="party-services-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={SERVICE_IMAGES.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-[center_35%]"
        />
        <HeroPhotoTint />
      </div>

      <FloatingShapes variant="lilac" className="opacity-25" />

      <div className="relative z-10 flex items-end px-[4.5%] pb-1 pt-3 sm:pt-4 lg:px-[5%] lg:pt-5">
        <ExpandingLogo />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8 lg:pb-24 lg:pt-16">
        <Reveal className="max-w-3xl">
          <p className="mb-4 font-outfit text-xs font-semibold uppercase tracking-[0.2em] text-lemon-twist sm:text-sm">
            Party Services
            <span className="mx-2 text-white/40">|</span>
            More than drinks and food
          </p>

          <h1
            id="party-services-heading"
            className="font-oswald text-[clamp(3rem,10vw,6.75rem)] font-bold uppercase leading-[0.88] tracking-[-0.02em] drop-shadow-[0_2px_18px_rgba(51,16,56,0.45)]"
          >
            We Bring the
            <span className="block text-lemon-twist">Party to Life</span>
          </h1>

          <p className="mt-6 max-w-xl font-outfit text-base leading-relaxed text-white/95 sm:text-lg">
            From the music to the cocktails and the food, we&apos;ve got the
            people and services to make your celebration one to remember.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <BrandCtaLink href="#explore-services">
              Explore Our Services
            </BrandCtaLink>
            <a
              href="/planner?intent=enquiry"
              className="inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-3 font-outfit text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lemon-twist"
            >
              Let&apos;s Plan Your Party
            </a>
          </div>
        </Reveal>
      </div>

      <Marquee
        messages={SERVICES_MARQUEE}
        tone="rose"
        direction="left"
        className="relative z-10"
      />
    </section>
  );
}
