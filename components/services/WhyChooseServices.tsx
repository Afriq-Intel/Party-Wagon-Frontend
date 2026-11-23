import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICE_IMAGES, SERVICE_REASONS } from "@/lib/data/services";

const TONES = [
  "bg-lemon-twist text-midnight-party",
  "bg-lilac-luster text-white",
  "bg-radiant-rose text-white",
  "bg-blue-lagoon text-midnight-party",
] as const;

export function WhyChooseServices() {
  return (
    <section
      className="relative overflow-hidden bg-offwhite/35"
      aria-labelledby="why-services-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-end lg:gap-14">
          <Reveal>
            <p className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-radiant-rose">
              Why choose Party Wagon?
            </p>
            <h2
              id="why-services-heading"
              className="font-oswald text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-midnight-party"
            >
              Party essentials
              <span className="block text-lilac-luster">plus the people</span>
            </h2>
            <p className="mt-5 max-w-md font-outfit text-base leading-relaxed text-midnight-party/75 sm:text-lg">
              We&apos;re not just the store for drinks and food. We&apos;re the
              plug that helps you gather your people and make the night land.
            </p>
          </Reveal>

          <Reveal delayMs={100}>
            <div className="about-photo-hover relative overflow-hidden rounded-[2rem] border-[3px] border-midnight-party shadow-[10px_10px_0_0_rgba(109,0,255,0.22)]">
              <div className="relative aspect-[16/10]">
                <Image
                  src={SERVICE_IMAGES.why}
                  alt="Joyful celebration with guests dancing in colourful traditional attire"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                  className="object-cover object-[center_40%]"
                />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {SERVICE_REASONS.map((reason, index) => (
            <Reveal key={reason.id} delayMs={index * 90}>
              <article
                className={`flex h-full flex-col rounded-[1.75rem] border-[3px] border-midnight-party p-7 shadow-[7px_7px_0_0_rgba(51,16,56,0.14)] transition duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-8 ${TONES[index]}`}
              >
                <span
                  className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-midnight-party/25 bg-white/25 font-outfit text-sm font-bold"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-oswald text-2xl font-bold uppercase leading-[1.05] tracking-wide sm:text-3xl">
                  {reason.title}
                </h3>
                <p className="mt-4 font-outfit text-base leading-relaxed opacity-90">
                  {reason.copy}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
