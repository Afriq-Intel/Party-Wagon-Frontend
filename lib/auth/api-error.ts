import type { AuthApiErrorBody } from "@/lib/auth/types";

/**
 * Shared auth error type so the mock layer can throw without importing
 * the full API client (avoids circular dependencies).
 */
export class AuthApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.details = details;
  }
}

export type { AuthApiErrorBody };
