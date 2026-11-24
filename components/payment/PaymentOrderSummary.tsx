import Image from "next/image";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import type { CartLine } from "@/lib/cart/cart-context";
import { cartLineKey, formatGhs } from "@/lib/catalogue/variants";

type PaymentOrderSummaryProps = {
  items: CartLine[];
  itemCount: number;
  subtotalGhs: number;
  deliveryFeeLabel: string;
  deliveryFeeGhs: number;
  onPay: () => void;
  payDisabled?: boolean;
  paying?: boolean;
};

export function PaymentOrderSummary({
  items,
  itemCount,
  subtotalGhs,
  deliveryFeeLabel,
  deliveryFeeGhs,
  onPay,
  payDisabled = false,
  paying = false,
}: PaymentOrderSummaryProps) {
  const itemLabel = itemCount === 1 ? "1 item" : `${itemCount} items`;
  const totalGhs = subtotalGhs + deliveryFeeGhs;

  return (
    <aside className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[8px_8px_0_0_rgba(109,0,255,0.1)] sm:p-6 lg:sticky lg:top-28">
      <h2 className="font-oswald text-xl font-semibold uppercase tracking-wide text-midnight-party">
        Order summary
      </h2>

      <ul className="mt-5 max-h-64 space-y-3 overflow-y-auto pr-1">
        {items.map((line) => (
          <li
            key={cartLineKey(line.productId, line.variantId)}
            className="flex gap-3"
          >
            <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f3eef2]">
              <Image
                src={line.image}
                alt=""
                fill
                sizes="48px"
                className="object-cover object-[center_30%]"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-outfit text-sm font-semibold text-midnight-party">
                {line.name}
              </p>
              <p className="font-outfit text-xs text-midnight-party/55">
                {line.variantName} · Qty {line.quantity}
              </p>
            </div>
            <p className="shrink-0 font-outfit text-sm font-semibold tabular-nums text-midnight-party">
              {formatGhs(line.priceGhs * line.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-5 space-y-3 border-t border-black/10 pt-4 font-outfit text-sm">
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
          <dd className="font-semibold tabular-nums text-midnight-party">
            {deliveryFeeLabel}
          </dd>
        </div>
      </dl>

      <div className="mt-4 border-t border-black/10 pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-outfit text-sm font-semibold uppercase tracking-wide text-midnight-party/70">
            Total
          </p>
          <p className="font-outfit text-2xl font-bold tabular-nums text-midnight-party">
            {formatGhs(totalGhs)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onPay}
        disabled={payDisabled || paying}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-outfit text-sm font-semibold uppercase tracking-wide text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C3F7] disabled:cursor-not-allowed disabled:opacity-55"
        style={{ backgroundColor: "#0A2540" }}
      >
        {paying ? (
          <>
            <LoaderCircle
              size={18}
              className="animate-spin"
              aria-hidden="true"
            />
            Connecting to Paystack…
          </>
        ) : (
          <>Pay with Paystack · {formatGhs(totalGhs)}</>
        )}
      </button>

      <p className="mt-3 text-center font-outfit text-xs leading-relaxed text-midnight-party/50">
        Secured by Paystack. Secret keys stay on the server — never in this app.
      </p>

      <Link
        href="/checkout"
        className="mt-3 block text-center font-outfit text-sm font-semibold text-lilac-luster transition hover:text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
      >
        Back to checkout
      </Link>
    </aside>
  );
}
