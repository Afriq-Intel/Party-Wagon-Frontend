import Image from "next/image";
import { FloatingShapes } from "@/components/ui/FloatingShapes";
import { Reveal } from "@/components/ui/Reveal";
import { BrandCtaLink } from "@/components/ui/BrandCtaLink";
import { ABOUT_IMAGES } from "@/lib/data/about";

export function ClosingCta() {
  return (
    <section
      className="relative overflow-hidden bg-radiant-rose text-white"
      aria-labelledby="closing-cta-heading"
    >
      <FloatingShapes variant="mixed" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:px-8 lg:py-24">
        <Reveal className="relative z-10">
          <p className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-lemon-twist">
            The plug for all your party needs
          </p>
          <h2
            id="closing-cta-heading"
            className="font-oswald text-[clamp(3rem,9vw,6.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.02em]"
          >
            Ready, Set,
            <span className="block text-lemon-twist">Enjoy!</span>
          </h2>
          <p className="mt-6 max-w-md font-outfit text-base leading-relaxed text-white/90 sm:text-lg">
            Explore drinks, platters, and finger foods, then let Party Wagon
            bring the party to your doorstep.
          </p>
          <div className="mt-8">
            <BrandCtaLink href="/catalogue">Explore the catalogue</BrandCtaLink>
          </div>
        </Reveal>

        <Reveal delayMs={140} className="relative z-10">
          <div className="about-photo-hover relative overflow-hidden rounded-[2rem] border-[3px] border-white shadow-[10px_10px_0_0_rgba(51,16,56,0.35)]">
            <div className="relative aspect-[5/4]">
              <Image
                src={ABOUT_IMAGES.closing}
                alt="Friends celebrating outdoors with drinks"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-[center_30%]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
