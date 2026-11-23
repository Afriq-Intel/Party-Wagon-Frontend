import { partnerApplicationStatusLabel } from "@/lib/data/operations-partner-applications";
import type { OperationsPartnerApplicationStatus } from "@/types/operations-partners";

export function PartnerApplicationStatusBadge({
  status,
}: {
  status: OperationsPartnerApplicationStatus;
}) {
  const styles: Record<OperationsPartnerApplicationStatus, string> = {
    pending_verification: "bg-lemon-twist/25 text-midnight-party",
    more_info_required: "bg-lilac-luster/15 text-lilac-luster",
    approved: "bg-blue-lagoon/15 text-midnight-party",
    rejected: "bg-radiant-rose/12 text-radiant-rose",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 font-outfit text-[11px] font-semibold ${styles[status]}`}
    >
      {partnerApplicationStatusLabel(status)}
    </span>
  );
}
