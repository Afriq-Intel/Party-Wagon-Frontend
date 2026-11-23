import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ADDITIONAL_SERVICES, CORE_SERVICES } from "@/lib/data/services";

export function ServicesExplore() {
  return (
    <section
      id="explore-services"
      className="relative scroll-mt-28 overflow-hidden bg-white"
      aria-labelledby="explore-services-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <p className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-lilac-luster">
            Explore our services
          </p>
          <h2
            id="explore-services-heading"
            className="max-w-3xl font-oswald text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-midnight-party"
          >
            The people who
            <span className="block text-radiant-rose">make the night</span>
          </h2>
          <p className="mt-5 max-w-2xl font-outfit text-base leading-relaxed text-midnight-party/75 sm:text-lg">
            Beyond drinks and platters, connect with the services that turn a
            gathering into a proper celebration.
          </p>
        </Reveal>

        <div className="mt-12 space-y-8 lg:mt-16 lg:space-y-12">
          {CORE_SERVICES.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              reverse={index % 2 === 1}
              delayMs={index * 60}
            />
          ))}
        </div>

        <div className="mt-20 lg:mt-28">
          <Reveal>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-blue-lagoon">
                  More vibes loading
                </p>
                <h3 className="font-oswald text-[clamp(1.85rem,4vw,3rem)] font-bold uppercase leading-[0.95] text-midnight-party">
                  Coming soon
                </h3>
              </div>
              <p className="max-w-md font-outfit text-sm leading-relaxed text-midnight-party/70 sm:text-right">
                Extra services under business review. Register interest and
                we&apos;ll keep you posted.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ADDITIONAL_SERVICES.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                variant="compact"
                delayMs={index * 80}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
