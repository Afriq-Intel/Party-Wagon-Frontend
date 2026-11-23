import Image from "next/image";
import { ExpandingLogo } from "@/components/home/ExpandingLogo";

/**
 * Hero visual is the approved Figma homepage composition.
 * Logo expands on scroll; hero PNG remains unchanged.
 */
export function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-lilac-luster"
      aria-labelledby="hero-heading"
    >
      <h1 id="hero-heading" className="sr-only">
        You meet a girl at the party: She says take me home
      </h1>

      <div className="flex items-end px-[4.5%] pb-1 pt-3 sm:pt-4 lg:px-[5%] lg:pt-5">
        <ExpandingLogo />
      </div>

      <div className="relative w-full overflow-hidden">
        <Image
          src="/assets/banners/hero-banner.jpg"
          alt="You meet a girl at the party: she says take me home. Friends celebrating at a lively party."
          width={1440}
          height={820}
          priority
          sizes="100vw"
          className="block h-auto w-full animate-fade-up"
          style={{ width: "100%", height: "auto" }}
        />

        {/* Mask the cropped raster logo so only the SVG wordmark remains */}
        <div
          className="pointer-events-none absolute left-0 top-0 bg-lilac-luster"
          style={{ width: "23%", height: "12%" }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
