import type { LucideIcon } from "lucide-react";
import {
  Beer,
  BottleWine,
  CupSoda,
  Headphones,
  Martini,
  Wine,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  champagne: Wine,
  "soft-drinks": CupSoda,
  cocktails: Martini,
  beer: Beer,
  vodka: BottleWine,
  dj: Headphones,
};

type CategoryIconProps = {
  slug: string;
  className?: string;
};

/** Cohesive Lucide set for shop categories — Lilac Luster, bolder stroke. */
export function CategoryIcon({ slug, className = "" }: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[slug] ?? Wine;

  return (
    <Icon
      absoluteStrokeWidth
      strokeWidth={2.35}
      className={`h-[1.85rem] w-[1.85rem] text-lilac-luster sm:h-8 sm:w-8 ${className}`}
      aria-hidden="true"
    />
  );
}
