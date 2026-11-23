import type { ReactNode } from "react";
import { RequireServiceProviderCapability } from "@/components/partner/services/RequireServiceProviderCapability";
import { PartnerServicesProvider } from "@/lib/partner/services-context";

/**
 * Shared mock My Services state for listing, view, and edit pages.
 * Restricted to service_provider partners.
 */
export default function PartnerServicesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RequireServiceProviderCapability>
      <PartnerServicesProvider>{children}</PartnerServicesProvider>
    </RequireServiceProviderCapability>
  );
}
