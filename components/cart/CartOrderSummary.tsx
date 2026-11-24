import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatGhs } from "@/lib/catalogue/variants";

type CartOrderSummaryProps = {
  itemCount: number;
  subtotalGhs: number;
};

export function CartOrderSummary({
  itemCount,
  subtotalGhs,
}: CartOrderSummaryProps) {
  const itemLabel = itemCount === 1 ? "1 item" : `${itemCount} items`;

  return (
    <aside className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[8px_8px_0_0_rgba(109,0,255,0.1)] sm:p-6 lg:sticky lg:top-28">
      <h2 className="font-oswald text-xl font-semibold uppercase tracking-wide text-midnight-party">
        Order summary
      </h2>

      <dl className="mt-5 space-y-3 font-outfit text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-midnight-party/65">Items</dt>
          <dd className="font-semibold text-midnight-party">{itemLabel}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-midnight-party/65">Subtotal</dt>
          <dd className="font-semibold tabular-nums text-midnight-party">
            {formatGhs(subtotalGhs)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-midnight-party/65">Delivery</dt>
          <dd className="text-midnight-party/55">Calculated at checkout</dd>
        </div>
      </dl>

      <div className="mt-5 border-t border-black/10 pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-outfit text-sm font-semibold uppercase tracking-wide text-midnight-party/70">
            Total
          </p>
          <p className="font-outfit text-2xl font-bold tabular-nums text-midnight-party">
            {formatGhs(subtotalGhs)}
          </p>
        </div>
        <p className="mt-1 font-outfit text-xs text-midnight-party/45">
          Delivery fee added at checkout
        </p>
      </div>

      <Link
        href="/checkout"
        className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-midnight-party px-6 py-3.5 font-outfit text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
      >
        Proceed to checkout
        <ArrowRight
          size={18}
          className="transition group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          aria-hidden="true"
        />
      </Link>

      <Link
        href="/catalogue"
        className="mt-3 block text-center font-outfit text-sm font-semibold text-lilac-luster transition hover:text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
      >
        Keep shopping
      </Link>
    </aside>
  );
}
