import type { ReactNode } from "react";
import { RequireServiceProviderCapability } from "@/components/partner/services/RequireServiceProviderCapability";
import { PartnerServicesProvider } from "@/lib/partner/services-context";

/**
 * Reuses My Services mock catalogue state for Pricing & Packages.
 * Restricted to service_provider partners.
 */
export default function PartnerPricingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RequireServiceProviderCapability moduleName="Pricing & Packages">
      <PartnerServicesProvider>{children}</PartnerServicesProvider>
    </RequireServiceProviderCapability>
  );
}
