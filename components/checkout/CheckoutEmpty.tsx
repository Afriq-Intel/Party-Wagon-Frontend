import { ShoppingBag } from "lucide-react";
import { BrandCtaLink } from "@/components/ui/BrandCtaLink";

export function CheckoutEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-midnight-party/20 bg-offwhite/50 px-6 py-16 text-center sm:py-20">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-lilac-luster/10 text-lilac-luster">
        <ShoppingBag size={28} aria-hidden="true" />
      </span>
      <h2 className="mt-6 font-oswald text-3xl font-bold uppercase tracking-wide text-midnight-party sm:text-4xl">
        Nothing to checkout
      </h2>
      <p className="mt-3 max-w-md font-outfit text-base leading-relaxed text-midnight-party/70">
        Your cart dey empty. Add party favourites from the catalogue, then come
        back to checkout.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <BrandCtaLink href="/catalogue">Browse catalogue</BrandCtaLink>
        <BrandCtaLink
          href="/cart"
          variant="outline"
          className="text-midnight-party"
        >
          View cart
        </BrandCtaLink>
      </div>
    </div>
  );
}
