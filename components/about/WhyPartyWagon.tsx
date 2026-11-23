import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { ABOUT_IMAGES, BRAND_USPS } from "@/lib/data/about";

export function WhyPartyWagon() {
  return (
    <section
      className="relative overflow-hidden bg-white"
      aria-labelledby="why-party-wagon-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-end lg:gap-14">
          <Reveal>
            <p className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-radiant-rose">
              Why Party Wagon?
            </p>
            <h2
              id="why-party-wagon-heading"
              className="font-oswald text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-midnight-party"
            >
              What sets us
              <span className="block text-lilac-luster">apart</span>
            </h2>
          </Reveal>

          <Reveal delayMs={100}>
            <div className="about-photo-hover relative overflow-hidden rounded-[2rem] border-[3px] border-midnight-party shadow-[10px_10px_0_0_rgba(213,37,114,0.22)]">
              <div className="relative aspect-[16/10]">
                <Image
                  src={ABOUT_IMAGES.usp}
                  alt="Young friends dancing and celebrating together outdoors"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-[center_40%]"
                />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {BRAND_USPS.map((usp, index) => (
            <Reveal key={usp.id} delayMs={index * 100}>
              <article
                className={`flex h-full flex-col rounded-[1.75rem] border-[3px] border-midnight-party p-7 shadow-[7px_7px_0_0_rgba(51,16,56,0.16)] transition duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-8 ${
                  index === 0
                    ? "bg-lemon-twist text-midnight-party"
                    : "bg-lilac-luster text-white"
                }`}
              >
                <span
                  className={`mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 font-outfit text-sm font-bold ${
                    index === 0
                      ? "border-midnight-party bg-white"
                      : "border-white bg-midnight-party text-lemon-twist"
                  }`}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <h3 className="font-oswald text-3xl font-bold uppercase leading-[1.05] tracking-wide sm:text-4xl">
                  {usp.title}
                </h3>
                <p
                  className={`mt-4 font-outfit text-base leading-relaxed sm:text-lg ${
                    index === 0 ? "text-midnight-party/85" : "text-white/90"
                  }`}
                >
                  {usp.copy}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
