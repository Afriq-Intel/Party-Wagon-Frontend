"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { BRAND_PERSONALITIES, BRAND_VALUES } from "@/lib/data/about";

const toneStyles = {
  lemon: "bg-lemon-twist text-midnight-party border-midnight-party",
  rose: "bg-radiant-rose text-white border-midnight-party",
  lilac: "bg-lilac-luster text-white border-midnight-party",
  blue: "bg-blue-lagoon text-midnight-party border-midnight-party",
  midnight: "bg-midnight-party text-white border-lemon-twist",
} as const;

export function OurValues() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      className="relative overflow-hidden bg-offwhite"
      aria-labelledby="our-values-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-lilac-luster">
            Our Values
          </p>
          <h2
            id="our-values-heading"
            className="font-oswald text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-midnight-party"
          >
            How we show up
          </h2>
          <p className="mt-4 font-outfit text-base leading-relaxed text-midnight-party/80 sm:text-lg">
            Five values. Four personalities. One vibe: fun, friendly, vibrant,
            and innovative.
          </p>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {BRAND_PERSONALITIES.map((trait) => (
              <li
                key={trait}
                className="rounded-full border-2 border-midnight-party bg-white px-4 py-1.5 font-outfit text-xs font-semibold uppercase tracking-[0.12em] text-midnight-party shadow-[3px_3px_0_0_rgba(51,16,56,0.2)]"
              >
                {trait}
              </li>
            ))}
          </ul>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-5 xl:gap-4">
          {BRAND_VALUES.map((value, index) => {
            const isActive = active === value.id;

            return (
              <Reveal key={value.id} delayMs={index * 70}>
                <li className="h-full">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(value.id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(value.id)}
                    onBlur={() => setActive(null)}
                    className={`about-value-card group flex h-full w-full flex-col rounded-[1.5rem] border-[3px] p-6 text-left shadow-[6px_6px_0_0_rgba(51,16,56,0.18)] transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midnight-party motion-reduce:transition-none sm:p-7 ${toneStyles[value.tone]} ${
                      isActive
                        ? "-translate-y-1.5 rotate-[-1deg] shadow-[8px_8px_0_0_rgba(51,16,56,0.28)]"
                        : "hover:-translate-y-1 hover:rotate-[-0.6deg]"
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70">
                      0{index + 1}
                    </span>
                    <h3 className="mt-3 font-oswald text-[clamp(1.65rem,4vw,1.85rem)] font-bold uppercase leading-none tracking-tight xl:text-[1.85rem]">
                      {value.title}
                    </h3>
                    <p className="mt-4 font-outfit text-sm leading-relaxed opacity-90 sm:text-base xl:text-sm">
                      {value.blurb}
                    </p>
                  </button>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
