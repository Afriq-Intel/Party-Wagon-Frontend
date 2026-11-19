import Image from "next/image";
import type { TestimonialItem } from "@/types/homepage";
import { StarRating } from "@/components/ui/StarRating";

type TestimonialCardProps = {
  testimonial: TestimonialItem;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-lilac-luster/30 hover:shadow-[5px_5px_0_0_rgba(255,194,0,0.55)] sm:p-6">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-midnight-party">
          <Image
            src={testimonial.avatar}
            alt=""
            fill
            sizes="96px"
            quality={92}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <StarRating rating={testimonial.rating} size={15} />
      </div>
      <p className="font-outfit text-sm leading-relaxed text-midnight-party/90 sm:text-base">
        “{testimonial.quote}”
      </p>
      <p className="mt-auto font-outfit text-sm font-bold text-midnight-party">
        {testimonial.name}
      </p>
    </article>
  );
}
