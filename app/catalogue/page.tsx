import type { Metadata } from "next";
import { Suspense } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CatalogueHero } from "@/components/catalogue/CatalogueHero";
import { CatalogueBrowser } from "@/components/catalogue/CatalogueBrowser";
import { CatalogueProductGrid } from "@/components/catalogue/CatalogueProductGrid";
import { getCatalogue } from "@/lib/catalogue/get-catalogue";

export const metadata: Metadata = {
  title: "Party Essentials Catalogue | Party Wagon",
  description:
    "Browse Party Wagon drinks, cocktails, soft drinks, beer, vodka, and party food. Find your party favourites and stack your cart.",
};

function CatalogueFallback() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <CatalogueProductGrid products={[]} loading />
      </div>
    </section>
  );
}

export default async function CataloguePage() {
  const catalogue = await getCatalogue();

  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <main className="flex-1">
        <CatalogueHero />
        <Suspense fallback={<CatalogueFallback />}>
          <CatalogueBrowser
            categories={catalogue.categories}
            products={catalogue.products}
            brands={catalogue.brands}
            priceBounds={catalogue.priceBounds}
            source={catalogue.source}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
