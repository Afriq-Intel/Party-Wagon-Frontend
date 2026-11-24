"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { Reveal } from "@/components/ui/Reveal";
import { MOCK_TESTIMONIALS } from "@/lib/data/homepage";

export function TestimonialsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: "prev" | "next") {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({
      left: direction === "next" ? 340 : -340,
      behavior: "smooth",
    });
  }

  return (
    <section
      className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2
              id="testimonials-heading"
              className="max-w-[14ch] font-oswald text-3xl font-bold text-midnight-party sm:max-w-none sm:text-4xl"
            >
              Hear from our customers
            </h2>
            <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => scrollByCard("prev")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/15 text-midnight-party transition hover:border-lilac-luster hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
                aria-label="Previous testimonials"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard("next")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/15 text-midnight-party transition hover:border-lilac-luster hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
                aria-label="Next testimonials"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </Reveal>

        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible"
        >
          {MOCK_TESTIMONIALS.map((testimonial, index) => (
            <Reveal
              key={testimonial.id}
              delayMs={index * 90}
              className="w-[min(86vw,340px)] shrink-0 lg:w-auto"
            >
              <TestimonialCard testimonial={testimonial} />
            </Reveal>
          ))}
        </div>

        <p className="mt-4 font-outfit text-xs text-midnight-party/50">
          Testimonial content is placeholder copy from the Figma layout for
          visual development only.
        </p>
      </div>
    </section>
  );
}
