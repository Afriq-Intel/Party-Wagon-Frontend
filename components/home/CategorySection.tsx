"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryCard } from "@/components/products/CategoryCard";
import { SeeAllLink } from "@/components/ui/SeeAllLink";
import { Reveal } from "@/components/ui/Reveal";
import { MOCK_CATEGORIES } from "@/lib/data/homepage";

export function CategorySection() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: "prev" | "next") {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = direction === "next" ? 200 : -200;
    node.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section
      className="bg-white px-4 py-12 sm:px-6 lg:px-8"
      aria-labelledby="categories-heading"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <h2
              id="categories-heading"
              className="max-w-[16ch] font-oswald text-3xl font-bold text-midnight-party sm:max-w-none sm:text-4xl"
            >
              Shop by products or services
            </h2>
            <div className="flex shrink-0 items-center gap-2 self-end pt-0 sm:self-auto sm:pt-1">
              <button
                type="button"
                onClick={() => scrollByCard("prev")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-midnight-party transition hover:border-lilac-luster hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster sm:h-10 sm:w-10"
                aria-label="Previous categories"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard("next")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-midnight-party transition hover:border-lilac-luster hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster sm:h-10 sm:w-10"
                aria-label="Next categories"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </Reveal>

        <div
          ref={scrollerRef}
          className="flex gap-5 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6"
        >
          {MOCK_CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <SeeAllLink href="/catalogue" />
        </div>
      </div>
    </section>
  );
}
