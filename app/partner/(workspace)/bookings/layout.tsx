import type { ReactNode } from "react";
import { RequireServiceProviderCapability } from "@/components/partner/services/RequireServiceProviderCapability";
import { PartnerBookingsProvider } from "@/lib/partner/bookings-context";

/**
 * Shared mock Bookings state for listing and detail pages.
 * Restricted to service_provider partners.
 */
export default function PartnerBookingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RequireServiceProviderCapability moduleName="Bookings">
      <PartnerBookingsProvider>{children}</PartnerBookingsProvider>
    </RequireServiceProviderCapability>
  );
}
