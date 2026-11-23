import type { ServiceCategoryResponse } from "@/types/services";
import { DEMO_SERVICES_NOTICE } from "@/lib/data/services-demo";
import { ServiceCategoryHero } from "@/components/services/ServiceCategoryHero";
import { ServiceCategoryBrowser } from "@/components/services/ServiceCategoryBrowser";
import { ServiceCategoryCta } from "@/components/services/ServiceCategoryCta";

type ServiceCategoryPageProps = {
  data: ServiceCategoryResponse;
};

/**
 * Shared template for `/services/[category]` routes.
 * Swap `data` source in `getServiceCategory` without redesigning this layout.
 */
export function ServiceCategoryPageView({ data }: ServiceCategoryPageProps) {
  return (
    <>
      <ServiceCategoryHero category={data.category} />
      <ServiceCategoryBrowser
        category={data.category}
        providers={data.providers}
        locations={data.locations}
        source={data.source}
        demoNotice={data.source === "demo" ? DEMO_SERVICES_NOTICE : undefined}
      />
      <ServiceCategoryCta category={data.category} />
    </>
  );
}
