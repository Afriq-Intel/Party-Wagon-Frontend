import Image from "next/image";
import { ExpandingLogo } from "@/components/home/ExpandingLogo";
import { FloatingShapes } from "@/components/ui/FloatingShapes";
import { HeroPhotoTint } from "@/components/ui/HeroPhotoTint";
import { Reveal } from "@/components/ui/Reveal";

export function PartnerApplyHero() {
  return (
    <section
      className="relative overflow-hidden bg-midnight-party text-white"
      aria-labelledby="partner-apply-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/assets/services/mobile-bar-services.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-[center_28%]"
        />
        <HeroPhotoTint />
      </div>

      <FloatingShapes variant="mixed" className="opacity-25" />

      <div className="relative z-10 flex items-end px-[4.5%] pb-1 pt-3 sm:pt-4 lg:px-[5%] lg:pt-5">
        <ExpandingLogo />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8 lg:pb-20 lg:pt-14">
        <Reveal className="max-w-3xl">
          <p className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-lemon-twist sm:text-sm">
            Public partner application
          </p>
          <h1
            id="partner-apply-heading"
            className="font-oswald text-[clamp(2.75rem,8vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.02em] drop-shadow-[0_2px_18px_rgba(51,16,56,0.45)]"
          >
            Join the
            <span className="block text-lemon-twist">Party Wagon plug</span>
          </h1>
          <p className="mt-5 max-w-xl font-outfit text-base leading-relaxed text-white/90 sm:text-lg">
            Apply as a Darkstore, Service Provider, or both. Your application
            goes to Operations for verification first. No account or dashboard
            access until you&apos;re approved.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
