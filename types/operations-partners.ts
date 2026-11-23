/**
 * Operations partner applications + directory — frontend/mock types only.
 * Credential delivery is represented as status only; passwords are never stored
 * or shown in the Operations UI.
 */
import type {
  PartnerApplicationDocument,
  PartnerCapability,
  PartnerSelectedBusinessCategory,
} from "@/types/partner-application";

export type OperationsPartnerApplicationStatus =
  | "pending_verification"
  | "more_info_required"
  | "approved"
  | "rejected";

/** Ops-verified capability after approval. */
export type OperationsPartnerVerificationStatus =
  | "verified"
  | "pending_review"
  | "suspended";

/** Partner login/account lifecycle in the mock directory. */
export type OperationsPartnerAccountStatus =
  | "pending_first_login"
  | "active"
  | "suspended";

/**
 * Secure temporary-credential delivery workflow status.
 * Never paired with a password value in the Operations UI.
 */
export type OperationsPartnerCredentialsDeliveryStatus =
  | "queued"
  | "sent_securely"
  | "delivery_failed";

export type OperationsPartnerApplication = {
  id: string;
  referenceId: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  capability: PartnerCapability;
  businessCategories: PartnerSelectedBusinessCategory[];
  description: string;
  productsOffered: string;
  servicesOffered: string;
  documents: PartnerApplicationDocument[];
  status: OperationsPartnerApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  /** Required when status is rejected */
  rejectionReason: string | null;
  /** Optional note when requesting more information */
  moreInfoMessage: string | null;
  reviewNotes: string | null;
  /** Set when a directory partner account is provisioned from this application */
  partnerId: string | null;
};

export type OperationsPartnerAccount = {
  id: string;
  partnerId: string;
  applicationId: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  capability: PartnerCapability;
  description: string;
  verificationStatus: OperationsPartnerVerificationStatus;
  accountStatus: OperationsPartnerAccountStatus;
  credentialsDeliveryStatus: OperationsPartnerCredentialsDeliveryStatus;
  approvedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type OperationsPartnerApplicationFilters = {
  search: string;
  status: OperationsPartnerApplicationStatus | "all";
  capability: PartnerCapability | "all";
};

export type OperationsPartnerDirectoryFilters = {
  search: string;
  capability: PartnerCapability | "all";
  verificationStatus: OperationsPartnerVerificationStatus | "all";
  accountStatus: OperationsPartnerAccountStatus | "all";
};

export type PartnerApplicationDecision =
  | { type: "approve" }
  | { type: "reject"; reason: string }
  | { type: "request_more_info"; message: string };

export type PartnerApplicationDecisionResult = {
  application: OperationsPartnerApplication;
  partner: OperationsPartnerAccount | null;
  partnerCreated: boolean;
};
