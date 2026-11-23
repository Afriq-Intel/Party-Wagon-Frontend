import { partnerServiceAvailabilityLabel } from "@/lib/data/partner-services";
import type { PartnerServiceAvailability } from "@/types/partner-services";

export function ServiceAvailabilityBadge({
  availability,
}: {
  availability: PartnerServiceAvailability;
}) {
  const styles: Record<PartnerServiceAvailability, string> = {
    available: "bg-emerald-50 text-emerald-700",
    limited: "bg-amber-50 text-amber-700",
    unavailable: "bg-midnight-party/8 text-midnight-party/55",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 font-outfit text-[11px] font-semibold ${styles[availability]}`}
    >
      {partnerServiceAvailabilityLabel(availability)}
    </span>
  );
}
