import Link from "next/link";
import { CategoryIcon } from "@/components/products/CategoryIcon";
import type { CategoryItem } from "@/types/homepage";

type CategoryCardProps = {
  category: CategoryItem;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/catalogue?category=${category.slug}`}
      className="group flex w-[152px] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-7 transition duration-300 hover:-translate-y-1 hover:border-lilac-luster/45 hover:shadow-[5px_5px_0_0_rgba(109,0,255,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster sm:w-[172px] sm:py-8"
    >
      <div className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
        <span
          className="absolute inset-0 rounded-full bg-lilac-luster/0 transition duration-300 group-hover:scale-110 group-hover:bg-lilac-luster/10"
          aria-hidden="true"
        />
        <span className="relative transition duration-300 group-hover:scale-110 group-hover:-rotate-6">
          <CategoryIcon slug={category.slug} />
        </span>
      </div>
      <span className="text-center font-outfit text-sm font-medium text-lilac-luster transition duration-300 group-hover:text-midnight-party sm:text-base">
        {category.name}
      </span>
    </Link>
  );
}
