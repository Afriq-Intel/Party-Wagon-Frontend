/**
 * MOCK DATA — Operations Partner Directory accounts.
 * Temporary credentials are represented by delivery status only.
 * Password secrets live in `lib/auth/partner-mock-store.ts` and must never
 * be rendered in Operations UI.
 */
import type {
  OperationsPartnerAccount,
  OperationsPartnerAccountStatus,
  OperationsPartnerCredentialsDeliveryStatus,
  OperationsPartnerVerificationStatus,
  OperationsPartnerApplication,
} from "@/types/operations-partners";

export const OPERATIONS_PARTNER_VERIFICATION_STATUSES: OperationsPartnerVerificationStatus[] =
  ["verified", "pending_review", "suspended"];

export const OPERATIONS_PARTNER_ACCOUNT_STATUSES: OperationsPartnerAccountStatus[] =
  ["pending_first_login", "active", "suspended"];

export const OPERATIONS_PARTNER_DIRECTORY_PAGE_SIZE = 8;

export function partnerVerificationStatusLabel(
  status: OperationsPartnerVerificationStatus,
): string {
  switch (status) {
    case "verified":
      return "Verified";
    case "pending_review":
      return "Pending review";
    case "suspended":
      return "Suspended";
    default:
      return status;
  }
}

export function partnerAccountStatusLabel(
  status: OperationsPartnerAccountStatus,
): string {
  switch (status) {
    case "pending_first_login":
      return "Pending first login";
    case "active":
      return "Active";
    case "suspended":
      return "Suspended";
    default:
      return status;
  }
}

export function partnerCredentialsDeliveryLabel(
  status: OperationsPartnerCredentialsDeliveryStatus,
): string {
  switch (status) {
    case "queued":
      return "Credential delivery queued";
    case "sent_securely":
      return "Temporary credentials sent securely";
    case "delivery_failed":
      return "Credential delivery failed";
    default:
      return status;
  }
}

export function formatPartnerDirectoryDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function clonePartnerAccount(
  partner: OperationsPartnerAccount,
): OperationsPartnerAccount {
  return { ...partner };
}

export function createMockPartnerAccounts(): OperationsPartnerAccount[] {
  return MOCK_PARTNER_ACCOUNTS.map(clonePartnerAccount);
}

export function createPartnerId(seed = Date.now()): string {
  const suffix = seed.toString(36).toUpperCase().slice(-6);
  return `PW-PRT-${suffix}`;
}

/**
 * Build a directory partner from an approved application.
 * Does not include or invent passwords.
 */
export function buildPartnerAccountFromApplication(
  application: OperationsPartnerApplication,
  existingPartnerId?: string,
): OperationsPartnerAccount {
  const now = new Date().toISOString();
  const partnerId = existingPartnerId ?? createPartnerId();

  return {
    id: `partner-${partnerId.toLowerCase()}`,
    partnerId,
    applicationId: application.id,
    businessName: application.businessName,
    contactName: application.contactName,
    email: application.email,
    phone: application.phone,
    address: application.address,
    capability: application.capability,
    description: application.description,
    verificationStatus: "verified",
    accountStatus: "pending_first_login",
    credentialsDeliveryStatus: "sent_securely",
    approvedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

const MOCK_PARTNER_ACCOUNTS: OperationsPartnerAccount[] = [
  {
    id: "partner-pw-prt-coast1",
    partnerId: "PW-PRT-COAST1",
    applicationId: "app-coastal-bar",
    businessName: "Coastal Mobile Bar",
    contactName: "Efua Addo",
    email: "efua@coastalbar.gh",
    phone: "+233 27 889 4412",
    address: "Cape Coast",
    capability: "service_provider",
    description:
      "Premium mobile cocktail bar for beach weddings and private dinners.",
    verificationStatus: "verified",
    accountStatus: "pending_first_login",
    credentialsDeliveryStatus: "sent_securely",
    approvedAt: "2026-11-08T10:05:00.000Z",
    createdAt: "2026-11-08T10:05:00.000Z",
    updatedAt: "2026-11-08T10:05:00.000Z",
  },
  {
    id: "partner-pw-prt-dark01",
    partnerId: "PW-PRT-DARK01",
    applicationId: "app-accra-night",
    businessName: "Accra Night Party Supply",
    contactName: "Frank Eli",
    email: "frank@accranight.gh",
    phone: "+233 24 551 9021",
    address: "East Legon, Accra",
    capability: "darkstore",
    description:
      "Darkstore inventory for chairs, décor kits, and celebration supply packs.",
    verificationStatus: "verified",
    accountStatus: "active",
    credentialsDeliveryStatus: "sent_securely",
    approvedAt: "2026-11-05T09:20:00.000Z",
    createdAt: "2026-11-05T09:20:00.000Z",
    updatedAt: "2026-11-10T14:00:00.000Z",
  },
  {
    id: "partner-pw-prt-glow1",
    partnerId: "PW-PRT-GLOW1",
    applicationId: "app-glow-events",
    businessName: "Glow Events Catering",
    contactName: "Ama Mensah",
    email: "ama@glowevents.gh",
    phone: "+233 20 774 3310",
    address: "Tema Community 4",
    capability: "service_provider",
    description:
      "Celebration catering and private chef packages for home gatherings.",
    verificationStatus: "verified",
    accountStatus: "pending_first_login",
    credentialsDeliveryStatus: "sent_securely",
    approvedAt: "2026-11-18T11:30:00.000Z",
    createdAt: "2026-11-18T11:30:00.000Z",
    updatedAt: "2026-11-18T11:30:00.000Z",
  },
];
