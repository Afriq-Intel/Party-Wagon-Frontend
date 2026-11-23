import Image from "next/image";
import Link from "next/link";
import { ExpandingLogo } from "@/components/home/ExpandingLogo";
import { FloatingShapes } from "@/components/ui/FloatingShapes";
import { HeroPhotoTint } from "@/components/ui/HeroPhotoTint";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { BrandCtaLink } from "@/components/ui/BrandCtaLink";
import type { ServiceCategory } from "@/types/services";
import { getServiceEnquiryHref } from "@/lib/data/services";

type ServiceCategoryHeroProps = {
  category: ServiceCategory;
};

export function ServiceCategoryHero({ category }: ServiceCategoryHeroProps) {
  return (
    <section
      className="relative overflow-hidden bg-midnight-party text-white"
      aria-labelledby={`${category.slug}-heading`}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={category.heroImage}
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 lg:pb-24">
        <Reveal className="max-w-3xl">
          <nav
            aria-label="Breadcrumb"
            className="mb-5 font-outfit text-xs font-medium uppercase tracking-[0.16em] text-white/75"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/services"
                  className="transition hover:text-lemon-twist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lemon-twist"
                >
                  Party Services
                </Link>
              </li>
              <li aria-hidden="true" className="text-white/40">
                /
              </li>
              <li className="text-lemon-twist">{category.name}</li>
            </ol>
          </nav>

          <p className="mb-4 font-outfit text-xs font-semibold uppercase tracking-[0.2em] text-lemon-twist sm:text-sm">
            {category.shortName}
            <span className="mx-2 text-white/40">|</span>
            Party Wagon services
          </p>

          <h1
            id={`${category.slug}-heading`}
            className="font-oswald text-[clamp(2.75rem,8vw,5.75rem)] font-bold uppercase leading-[0.9] tracking-[-0.02em] drop-shadow-[0_2px_18px_rgba(51,16,56,0.45)]"
          >
            {category.headline}
          </h1>

          <p className="mt-6 max-w-xl font-outfit text-base leading-relaxed text-white/95 sm:text-lg">
            {category.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <BrandCtaLink href="#providers">Browse providers</BrandCtaLink>
            <a
              href={getServiceEnquiryHref(category.slug)}
              className="inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-3 font-outfit text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lemon-twist"
            >
              Send an enquiry
            </a>
          </div>
        </Reveal>
      </div>

      <Marquee
        messages={category.marquee}
        tone="rose"
        direction="left"
        className="relative z-10"
      />
    </section>
  );
}
