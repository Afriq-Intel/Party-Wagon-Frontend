import {
  partnerAccountStatusLabel,
  partnerCredentialsDeliveryLabel,
  partnerVerificationStatusLabel,
} from "@/lib/data/operations-partner-accounts";
import type {
  OperationsPartnerAccountStatus,
  OperationsPartnerCredentialsDeliveryStatus,
  OperationsPartnerVerificationStatus,
} from "@/types/operations-partners";

export function PartnerVerificationStatusBadge({
  status,
}: {
  status: OperationsPartnerVerificationStatus;
}) {
  const styles: Record<OperationsPartnerVerificationStatus, string> = {
    verified: "bg-blue-lagoon/15 text-midnight-party",
    pending_review: "bg-lemon-twist/25 text-midnight-party",
    suspended: "bg-radiant-rose/12 text-radiant-rose",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 font-outfit text-[11px] font-semibold ${styles[status]}`}
    >
      {partnerVerificationStatusLabel(status)}
    </span>
  );
}

export function PartnerAccountStatusBadge({
  status,
}: {
  status: OperationsPartnerAccountStatus;
}) {
  const styles: Record<OperationsPartnerAccountStatus, string> = {
    pending_first_login: "bg-lemon-twist/25 text-midnight-party",
    active: "bg-blue-lagoon/15 text-midnight-party",
    suspended: "bg-midnight-party/8 text-midnight-party/55",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 font-outfit text-[11px] font-semibold ${styles[status]}`}
    >
      {partnerAccountStatusLabel(status)}
    </span>
  );
}

export function PartnerCredentialsDeliveryBadge({
  status,
}: {
  status: OperationsPartnerCredentialsDeliveryStatus;
}) {
  const styles: Record<OperationsPartnerCredentialsDeliveryStatus, string> = {
    queued: "bg-lemon-twist/25 text-midnight-party",
    sent_securely: "bg-lilac-luster/12 text-lilac-luster",
    delivery_failed: "bg-radiant-rose/12 text-radiant-rose",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 font-outfit text-[11px] font-semibold ${styles[status]}`}
      title="Passwords are never shown in Operations"
    >
      {partnerCredentialsDeliveryLabel(status)}
    </span>
  );
}
