import { categoryStatusLabel } from "@/lib/data/operations-categories";
import type { OperationsCategoryStatus } from "@/types/operations-products";

export function CategoryStatusBadge({
  status,
}: {
  status: OperationsCategoryStatus;
}) {
  const styles: Record<OperationsCategoryStatus, string> = {
    active: "bg-blue-lagoon/15 text-midnight-party",
    inactive: "bg-midnight-party/8 text-midnight-party/55",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 font-outfit text-[11px] font-semibold capitalize ${styles[status]}`}
    >
      {categoryStatusLabel(status)}
    </span>
  );
}
