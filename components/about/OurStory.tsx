import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { ABOUT_IMAGES } from "@/lib/data/about";

export function OurStory() {
  return (
    <section
      className="relative overflow-hidden bg-white"
      aria-labelledby="our-story-heading"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8 lg:py-24">
        <Reveal className="order-2 lg:order-1">
          <p className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-lilac-luster">
            Our Story
          </p>
          <h2
            id="our-story-heading"
            className="font-oswald text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-midnight-party"
          >
            Make memories.
            <span className="block text-radiant-rose">Leave the planning.</span>
          </h2>

          <div className="mt-6 space-y-5 font-outfit text-base leading-relaxed text-midnight-party/85 sm:text-lg">
            <p>
              Making and maintaining connections can be difficult because of
              rising costs and the challenges of getting together. Party Wagon
              believes everyone deserves to enjoy time with people they love
              without the hassle.
            </p>
            <p>
              With just a click, Party Wagon brings the party to customers by
              curating and delivering party essentials to their doorstep. Gather
              your favourite people and have a blast, without all the fuss.
            </p>
            <p className="font-semibold text-midnight-party">
              Let&apos;s make memories, and leave the planning to us!
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={140} className="order-1 lg:order-2">
          <div className="relative">
            <div
              className="absolute -left-4 -top-4 h-24 w-24 rounded-[35%] bg-lemon-twist/70 sm:-left-6 sm:-top-6 sm:h-32 sm:w-32"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-5 -right-3 h-20 w-28 rounded-[45%] bg-blue-lagoon/55 sm:-bottom-7 sm:-right-5 sm:h-28 sm:w-36"
              aria-hidden="true"
            />
            <div className="about-photo-hover relative overflow-hidden rounded-[2rem] border-[3px] border-midnight-party shadow-[10px_10px_0_0_rgba(109,0,255,0.22)]">
              <div className="relative aspect-[5/6] sm:aspect-[4/5]">
                <Image
                  src={ABOUT_IMAGES.story}
                  alt="Young friends dancing and celebrating outdoors with drinks"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-[center_42%]"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
