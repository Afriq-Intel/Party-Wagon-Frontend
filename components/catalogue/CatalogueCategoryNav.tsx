"use client";

import Image from "next/image";
import type { CatalogueCategory } from "@/types/catalogue";
import { Reveal } from "@/components/ui/Reveal";

const ACCENT_BORDER: Record<CatalogueCategory["accent"], string> = {
  lemon: "hover:border-lemon-twist hover:shadow-[6px_6px_0_0_rgba(255,194,0,0.45)]",
  rose: "hover:border-radiant-rose hover:shadow-[6px_6px_0_0_rgba(213,37,114,0.4)]",
  lilac: "hover:border-lilac-luster hover:shadow-[6px_6px_0_0_rgba(109,0,255,0.35)]",
  teal: "hover:border-blue-lagoon hover:shadow-[6px_6px_0_0_rgba(25,200,191,0.4)]",
  midnight:
    "hover:border-midnight-party hover:shadow-[6px_6px_0_0_rgba(51,16,56,0.35)]",
  offwhite:
    "hover:border-offwhite hover:shadow-[6px_6px_0_0_rgba(237,209,223,0.7)]",
};

type CatalogueCategoryNavProps = {
  categories: CatalogueCategory[];
  activeCategory: string | null;
  onSelect: (slug: string | null) => void;
};

export function CatalogueCategoryNav({
  categories,
  activeCategory,
  onSelect,
}: CatalogueCategoryNavProps) {
  return (
    <section
      id="catalogue-categories"
      className="scroll-mt-28 bg-offwhite/55 px-4 py-12 sm:px-6 lg:px-8"
      aria-labelledby="catalogue-categories-heading"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="catalogue-categories-heading"
                className="font-oswald text-3xl font-bold uppercase tracking-wide text-midnight-party sm:text-4xl"
              >
                Shop by Category
              </h2>
              <p className="mt-2 max-w-xl font-outfit text-sm text-midnight-party/70 sm:text-base">
                Tap a vibe: champagne, cold drinks, cocktails, beer, vodka,
                party food, and more.
              </p>
            </div>
            {activeCategory ? (
              <button
                type="button"
                onClick={() => onSelect(null)}
                className="rounded-full border border-midnight-party/20 bg-white px-4 py-2 font-outfit text-sm font-semibold text-midnight-party transition hover:bg-lemon-twist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
              >
                Clear category
              </button>
            ) : null}
          </div>
        </Reveal>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-4">
          {categories.map((category, index) => {
            const selected = activeCategory === category.slug;
            return (
              <li key={category.id}>
                <Reveal delayMs={Math.min(index * 50, 280)} className="h-full">
                  <button
                    type="button"
                    onClick={() =>
                      onSelect(selected ? null : category.slug)
                    }
                    aria-pressed={selected}
                    className={`group flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-white text-left transition duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                      selected
                        ? "border-lilac-luster shadow-[6px_6px_0_0_rgba(109,0,255,0.35)]"
                        : `border-black/10 ${ACCENT_BORDER[category.accent]}`
                    }`}
                  >
                    <div className="relative aspect-[5/4] overflow-hidden bg-[#f3eef2]">
                      <Image
                        src={category.image}
                        alt=""
                        fill
                        quality={90}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center transition duration-500 ease-out group-hover:scale-[1.07] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight-party/55 via-midnight-party/10 to-transparent" />
                      {selected ? (
                        <span className="absolute right-3 top-3 rounded-full bg-lemon-twist px-2.5 py-1 font-outfit text-[10px] font-bold uppercase tracking-wide text-midnight-party">
                          Selected
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col gap-1 px-3.5 py-3 sm:px-4 sm:py-3.5">
                      <span className="font-oswald text-lg font-semibold uppercase tracking-wide text-midnight-party transition group-hover:text-lilac-luster sm:text-xl">
                        {category.name}
                      </span>
                      <span className="font-outfit text-xs text-midnight-party/65 sm:text-sm">
                        {category.description}
                      </span>
                    </div>
                  </button>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
