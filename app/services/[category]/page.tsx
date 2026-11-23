import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ServiceCategoryPageView } from "@/components/services/ServiceCategoryPage";
import {
  getServiceCategory,
  getServiceCategorySlugs,
  isServiceCategorySlug,
} from "@/lib/services/get-service-category";

type ServiceCategoryRouteProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const slugs = await getServiceCategorySlugs();
  return slugs.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: ServiceCategoryRouteProps): Promise<Metadata> {
  const { category: slug } = await params;
  if (!isServiceCategorySlug(slug)) {
    return { title: "Service not found | Party Wagon" };
  }

  const data = await getServiceCategory(slug);
  if (!data) {
    return { title: "Service not found | Party Wagon" };
  }

  return {
    title: `${data.category.name} | Party Wagon`,
    description: data.category.intro,
  };
}

export default async function ServiceCategoryRoute({
  params,
}: ServiceCategoryRouteProps) {
  const { category: slug } = await params;
  if (!isServiceCategorySlug(slug)) notFound();

  const data = await getServiceCategory(slug);
  if (!data) notFound();

  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <main className="flex-1">
        <ServiceCategoryPageView data={data} />
      </main>
      <Footer />
    </>
  );
}
