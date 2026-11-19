import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FloatingShapes } from "@/components/ui/FloatingShapes";
import { Reveal } from "@/components/ui/Reveal";

export function PartyPlannerBanner() {
  return (
    <section
      className="relative overflow-hidden bg-lilac-luster text-white"
      aria-labelledby="planner-heading"
    >
      <FloatingShapes variant="lilac" />
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
              Party Wagon <span className="mx-2 text-white/40">|</span> Good
              times start here
            </p>
          </div>

          <h2
            id="planner-heading"
            className="font-oswald text-5xl font-bold uppercase leading-none text-lemon-twist sm:text-6xl lg:text-7xl"
          >
            Party Planner
          </h2>

          <p className="mt-6 max-w-md font-outfit text-base leading-relaxed text-white/90 sm:text-lg">
            Tell us what you’re celebrating, how many guests are coming, and
            what vibe you want. Our AI planner creates a personalized party plan
            with ideas, essentials, and next steps.
          </p>

          <Link
            href="/planner"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-lemon-twist px-6 py-3 font-outfit text-sm font-semibold uppercase tracking-wide text-midnight-party shadow-[5px_5px_0_0_rgba(51,16,56,0.35)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Try Now
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </Reveal>

        <Reveal
          delayMs={140}
          className="group relative aspect-[4/5] overflow-hidden sm:aspect-[3/4] lg:absolute lg:inset-y-0 lg:left-1/2 lg:aspect-auto lg:right-[calc((100%-100vw)/2)]"
        >
          <Image
            src="/assets/banners/planner-crowd.jpg"
            alt="Friends dancing and laughing together at a party"
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-[center_36%] transition duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-lilac-luster/90 to-transparent lg:hidden"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-lilac-luster to-transparent lg:block"
            aria-hidden="true"
          />
        </Reveal>
      </div>
    </section>
  );
}
