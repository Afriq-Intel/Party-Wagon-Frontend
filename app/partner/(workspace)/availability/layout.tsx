import type { ReactNode } from "react";
import { RequireServiceProviderCapability } from "@/components/partner/services/RequireServiceProviderCapability";
import { PartnerAvailabilityProvider } from "@/lib/partner/availability-context";
import { PartnerBookingsProvider } from "@/lib/partner/bookings-context";

/**
 * Availability calendar mock state + read-only bookings overlay.
 * Restricted to service_provider partners.
 */
export default function PartnerAvailabilityLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RequireServiceProviderCapability moduleName="Availability Calendar">
      <PartnerBookingsProvider>
        <PartnerAvailabilityProvider>{children}</PartnerAvailabilityProvider>
      </PartnerBookingsProvider>
    </RequireServiceProviderCapability>
  );
}
