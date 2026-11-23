import { partnerServiceStatusLabel } from "@/lib/data/partner-services";
import type { PartnerServiceStatus } from "@/types/partner-services";

export function ServiceStatusBadge({
  status,
}: {
  status: PartnerServiceStatus;
}) {
  const styles: Record<PartnerServiceStatus, string> = {
    active: "bg-blue-lagoon/15 text-midnight-party",
    draft: "bg-lemon-twist/25 text-midnight-party",
    inactive: "bg-midnight-party/8 text-midnight-party/55",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 font-outfit text-[11px] font-semibold ${styles[status]}`}
    >
      {partnerServiceStatusLabel(status)}
    </span>
  );
}
