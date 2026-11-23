import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { ABOUT_IMAGES, HUMAN_TENSIONS } from "@/lib/data/about";

export function HumanTension() {
  return (
    <section
      className="relative overflow-hidden bg-midnight-party text-white"
      aria-labelledby="human-tension-heading"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:px-8 lg:py-24">
        <Reveal>
          <div className="about-photo-hover relative overflow-hidden rounded-[2rem] border-[3px] border-lemon-twist shadow-[10px_10px_0_0_rgba(255,194,0,0.35)]">
            <div className="relative aspect-[4/5]">
              <Image
                src={ABOUT_IMAGES.tension}
                alt="Friends sharing drinks together outdoors"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-[center_30%]"
              />
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-lemon-twist">
              The Human Tension
            </p>
            <h2
              id="human-tension-heading"
              className="font-oswald text-[clamp(2.35rem,5vw,4.25rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em]"
            >
              Staying connected
              <span className="block text-radiant-rose">shouldn&apos;t be hard.</span>
            </h2>
            <p className="mt-5 max-w-xl font-outfit text-base leading-relaxed text-white/85 sm:text-lg">
              We believe that with the right tools every day can be a party,
              and that everyone deserves the chance to have a good time with the
              people they love, hassle-free.
            </p>
          </Reveal>

          <ul className="mt-10 space-y-4">
            {HUMAN_TENSIONS.map((item, index) => (
              <Reveal key={item.id} delayMs={80 + index * 90}>
                <li className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 px-5 py-5 transition duration-300 hover:-translate-y-1 hover:border-lemon-twist/50 hover:bg-white/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:px-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                    <h3 className="shrink-0 font-oswald text-2xl font-bold uppercase tracking-wide text-lemon-twist sm:w-44 sm:text-3xl">
                      {item.title}
                    </h3>
                    <p className="font-outfit text-sm leading-relaxed text-white/85 sm:text-base">
                      {item.copy}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
