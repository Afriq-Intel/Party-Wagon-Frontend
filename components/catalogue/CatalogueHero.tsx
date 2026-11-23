import Image from "next/image";
import type { CSSProperties } from "react";
import { ExpandingLogo } from "@/components/home/ExpandingLogo";
import { FloatingShapes } from "@/components/ui/FloatingShapes";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { BrandCtaLink } from "@/components/ui/BrandCtaLink";
import { AboutHeroBackground } from "@/components/about/AboutHeroBackground";
import { ABOUT_IMAGES, ABOUT_MARQUEE } from "@/lib/data/about";

const CATALOGUE_COLLAGE = {
  primary: ABOUT_IMAGES.heroPrimary,
  secondary: ABOUT_IMAGES.heroSecondary,
  tertiary: ABOUT_IMAGES.heroTertiary,
} as const;

export function CatalogueHero() {
  return (
    <section
      className="relative overflow-hidden bg-lilac-luster text-white"
      aria-labelledby="catalogue-intro-heading"
    >
      <AboutHeroBackground />
      <FloatingShapes variant="lilac" className="opacity-35" />

      {/* Homepage-matching logo — links back to Home, same as About */}
      <div className="relative z-10 flex items-end px-[4.5%] pb-1 pt-3 sm:pt-4 lg:px-[5%] lg:pt-5">
        <ExpandingLogo />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:px-8 lg:pb-20 lg:pt-10">
        <Reveal className="relative z-10">
          <p className="mb-4 font-outfit text-xs font-semibold uppercase tracking-[0.2em] text-lemon-twist sm:text-sm">
            Party Essentials
            <span className="mx-2 text-white/40">|</span>
            The plug for all your party needs
          </p>

          <h1
            id="catalogue-intro-heading"
            className="font-oswald text-[clamp(3.25rem,11vw,7.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.02em] drop-shadow-[0_2px_18px_rgba(51,16,56,0.35)]"
          >
            Find Your
            <span className="block text-lemon-twist">Party Favourites</span>
          </h1>

          <p className="mt-6 max-w-lg font-outfit text-base leading-relaxed text-white/95 sm:text-lg">
            Browse drinks, cocktails, and party food, then stack your cart for
            the night. Where the party dey, we dey.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BrandCtaLink href="#catalogue-products">
              Shop the catalogue
            </BrandCtaLink>
            <a
              href="#catalogue-categories"
              className="inline-flex items-center gap-2 rounded-full border border-white/45 px-5 py-3 font-outfit text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lemon-twist"
            >
              Browse categories
            </a>
          </div>
        </Reveal>

        <Reveal
          delayMs={120}
          className="relative z-10 min-h-[22rem] sm:min-h-[28rem] lg:min-h-[34rem]"
        >
          <div
            className="about-hero-float absolute left-0 top-[6%] z-20 w-[58%] sm:w-[52%]"
            style={
              {
                "--float-rotate": "-4deg",
                "--float-x": "6px",
                "--float-y": "-14px",
                "--float-scale": "1.045",
              } as CSSProperties
            }
          >
            <div className="overflow-hidden rounded-[1.75rem] border-[3px] border-midnight-party shadow-[8px_8px_0_0_rgba(51,16,56,0.35)]">
              <div className="relative aspect-[4/5]">
                <Image
                  src={CATALOGUE_COLLAGE.primary}
                  alt="Friends dancing and laughing together at a celebration"
                  fill
                  priority
                  sizes="(max-width: 1024px) 55vw, 28vw"
                  className="about-hero-float__media object-cover object-center"
                />
              </div>
            </div>
          </div>

          <div
            className="about-hero-float absolute right-0 top-0 z-10 w-[48%] sm:w-[44%]"
            style={
              {
                "--float-rotate": "5deg",
                "--float-x": "-8px",
                "--float-y": "-10px",
                "--float-scale": "1.05",
              } as CSSProperties
            }
          >
            <div className="overflow-hidden rounded-[1.75rem] border-[3px] border-lemon-twist shadow-[8px_8px_0_0_rgba(255,194,0,0.45)]">
              <div className="relative aspect-[3/4]">
                <Image
                  src={CATALOGUE_COLLAGE.secondary}
                  alt="Friends celebrating with joyful dance moves"
                  fill
                  sizes="(max-width: 1024px) 45vw, 24vw"
                  className="about-hero-float__media object-cover object-[center_28%]"
                />
              </div>
            </div>
          </div>

          <div
            className="about-hero-float absolute bottom-0 right-[8%] z-30 w-[62%] sm:w-[56%]"
            style={
              {
                "--float-rotate": "-2deg",
                "--float-x": "4px",
                "--float-y": "-12px",
                "--float-scale": "1.04",
              } as CSSProperties
            }
          >
            <div className="overflow-hidden rounded-[1.75rem] border-[3px] border-white shadow-[8px_8px_0_0_rgba(255,255,255,0.28)]">
              <div className="relative aspect-[5/4]">
                <Image
                  src={CATALOGUE_COLLAGE.tertiary}
                  alt="Friends dancing with drinks under a bright sky"
                  fill
                  sizes="(max-width: 1024px) 60vw, 30vw"
                  className="about-hero-float__media object-cover object-[center_35%]"
                />
              </div>
            </div>
          </div>

          <span
            className="absolute left-[42%] top-[38%] z-40 h-16 w-16 rounded-[40%] bg-radiant-rose/80 blur-[1px] animate-float sm:h-20 sm:w-20"
            aria-hidden="true"
          />
          <span
            className="absolute bottom-[22%] left-[4%] z-40 h-12 w-12 rounded-full bg-blue-lagoon/85 animate-soft-pulse"
            aria-hidden="true"
          />
          <span
            className="absolute right-[4%] top-[42%] z-40 text-lemon-twist animate-spin-slow"
            aria-hidden="true"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1.5 13.8 8.2 20.5 10 13.8 11.8 12 18.5 10.2 11.8 3.5 10 10.2 8.2 12 1.5Z" />
            </svg>
          </span>
        </Reveal>
      </div>

      <Marquee
        messages={ABOUT_MARQUEE}
        tone="rose"
        direction="left"
        className="relative z-10"
      />
    </section>
  );
}
