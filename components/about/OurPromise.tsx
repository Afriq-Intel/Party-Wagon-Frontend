import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { ABOUT_IMAGES } from "@/lib/data/about";

export function OurPromise() {
  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="our-promise-heading"
    >
      <div className="relative min-h-[28rem] sm:min-h-[34rem] lg:min-h-[42rem]">
        <Image
          src={ABOUT_IMAGES.promise}
          alt="Friends celebrating together in a lively night crowd"
          fill
          sizes="100vw"
          className="object-cover object-[center_28%] transition duration-700 ease-out hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
          priority={false}
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-midnight-party/90 via-midnight-party/70 to-lilac-luster/55"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-midnight-party/80 via-transparent to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex min-h-[28rem] max-w-7xl items-end px-4 py-16 sm:min-h-[34rem] sm:px-6 lg:min-h-[42rem] lg:items-center lg:px-8 lg:py-24">
          <Reveal className="max-w-3xl">
            <p className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-lemon-twist">
              Our Promise
            </p>
            <h2
              id="our-promise-heading"
              className="font-oswald text-[clamp(2.5rem,6vw,5.25rem)] font-bold uppercase leading-[0.9] tracking-[-0.02em] text-white"
            >
              With just a click,
              <span className="block text-lemon-twist">we bring the party.</span>
            </h2>
            <p className="mt-6 max-w-2xl font-outfit text-base leading-relaxed text-white/90 sm:text-xl">
              With just a click of a button, we promise to bring the party to
              you, helping to build even stronger connections across Ghana.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
