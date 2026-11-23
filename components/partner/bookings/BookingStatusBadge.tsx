import { partnerBookingStatusLabel } from "@/lib/data/partner-bookings";
import type { PartnerBookingStatus } from "@/types/partner-bookings";

export function BookingStatusBadge({
  status,
}: {
  status: PartnerBookingStatus;
}) {
  const styles: Record<PartnerBookingStatus, string> = {
    pending: "bg-lemon-twist/25 text-midnight-party",
    confirmed: "bg-blue-lagoon/15 text-midnight-party",
    completed: "bg-emerald-50 text-emerald-700",
    declined: "bg-radiant-rose/10 text-radiant-rose",
    cancelled: "bg-midnight-party/8 text-midnight-party/55",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 font-outfit text-[11px] font-semibold ${styles[status]}`}
    >
      {partnerBookingStatusLabel(status)}
    </span>
  );
}
