import { ShoppingBag } from "lucide-react";
import { BrandCtaLink } from "@/components/ui/BrandCtaLink";

export function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-midnight-party/20 bg-offwhite/50 px-6 py-16 text-center sm:py-20">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-lilac-luster/10 text-lilac-luster">
        <ShoppingBag size={28} aria-hidden="true" />
      </span>
      <h2 className="mt-6 font-oswald text-3xl font-bold uppercase tracking-wide text-midnight-party sm:text-4xl">
        Cart dey empty
      </h2>
      <p className="mt-3 max-w-md font-outfit text-base leading-relaxed text-midnight-party/70">
        Nothing in the wagon yet. Browse the catalogue and stack your party
        favourites.
      </p>
      <div className="mt-8">
        <BrandCtaLink href="/catalogue">Back to catalogue</BrandCtaLink>
      </div>
    </div>
  );
}
