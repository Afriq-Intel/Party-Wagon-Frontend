import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProductDetail } from "@/components/catalogue/ProductDetail";
import {
  getCatalogue,
  getCatalogueProductBySlug,
} from "@/lib/catalogue/get-catalogue";
import { DEMO_CATALOGUE_NOTICE } from "@/lib/data/catalogue-demo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const catalogue = await getCatalogue();
  return catalogue.products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogueProductBySlug(slug);
  if (!product) {
    return { title: "Product not found | Party Wagon" };
  }
  return {
    title: `${product.name} | Party Wagon`,
    description: product.description,
  };
}

export default async function CatalogueProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogueProductBySlug(slug);
  if (!product) notFound();

  const catalogue = await getCatalogue();

  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <main className="flex-1 bg-white">
        <ProductDetail product={product} />
        {catalogue.source === "demo" ? (
          <p className="mx-auto max-w-7xl px-4 pb-10 font-outfit text-xs text-midnight-party/50 sm:px-6 lg:px-8">
            {DEMO_CATALOGUE_NOTICE}
          </p>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
