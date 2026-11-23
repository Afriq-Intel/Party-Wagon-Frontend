import { productStatusLabel } from "@/lib/data/operations-products";
import type { OperationsProductStatus } from "@/types/operations-products";

export function ProductStatusBadge({
  status,
}: {
  status: OperationsProductStatus;
}) {
  const styles: Record<OperationsProductStatus, string> = {
    published: "bg-blue-lagoon/15 text-midnight-party",
    draft: "bg-lemon-twist/25 text-midnight-party",
    inactive: "bg-midnight-party/8 text-midnight-party/55",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 font-outfit text-[11px] font-semibold capitalize ${styles[status]}`}
    >
      {productStatusLabel(status)}
    </span>
  );
}
