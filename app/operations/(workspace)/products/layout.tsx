import type { ReactNode } from "react";
import { OperationsProductsProvider } from "@/lib/operations/products-context";

/**
 * Shared mock catalogue state for listing, view, and edit product pages.
 */
export default function OperationsProductsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <OperationsProductsProvider>{children}</OperationsProductsProvider>;
}
