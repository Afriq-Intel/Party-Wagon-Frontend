import { ProductCard } from "@/components/products/ProductCard";
import { SeeAllLink } from "@/components/ui/SeeAllLink";
import { Reveal } from "@/components/ui/Reveal";
import { MOCK_BEST_SELLERS } from "@/lib/data/homepage";

export function BestSellersSection() {
  return (
    <section
      className="relative overflow-hidden bg-white px-4 pb-14 pt-2 sm:px-6 lg:px-8"
      aria-labelledby="bestsellers-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_at_top,_rgba(109,0,255,0.06),_transparent_65%)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2
              id="bestsellers-heading"
              className="font-oswald text-3xl font-bold uppercase tracking-wide text-midnight-party sm:text-4xl lg:text-5xl"
            >
              Best Sellers
            </h2>
            <SeeAllLink href="/catalogue" label="Shop All" className="mb-1 shrink-0" />
          </div>
        </Reveal>

        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {MOCK_BEST_SELLERS.map((product, index) => (
            <li key={product.id} className="h-full">
              <Reveal delayMs={Math.min(index * 60, 300)} className="h-full">
                <ProductCard product={product} />
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-6 font-outfit text-xs text-midnight-party/50">
          Product details shown here are temporary demo content for visual
          development only, not live catalogue data.
        </p>
      </div>
    </section>
  );
}
