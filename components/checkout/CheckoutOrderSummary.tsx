import Image from "next/image";
import Link from "next/link";
import type { CartLine } from "@/lib/cart/cart-context";
import { cartLineKey, formatGhs } from "@/lib/catalogue/variants";
import type { DeliveryQuoteStatus } from "@/types/checkout";

type CheckoutOrderSummaryProps = {
  items: CartLine[];
  itemCount: number;
  subtotalGhs: number;
  deliveryFeeLabel: string;
  totalLabel: string;
  quoteStatus: DeliveryQuoteStatus;
  formId: string;
  /** Optional direct handler if the external form submit association fails. */
  onProceed?: () => void;
};

export function CheckoutOrderSummary({
  items,
  itemCount,
  subtotalGhs,
  deliveryFeeLabel,
  totalLabel,
  quoteStatus,
  formId,
  onProceed,
}: CheckoutOrderSummaryProps) {
  const itemLabel = itemCount === 1 ? "1 item" : `${itemCount} items`;
  const quoteIncluded = quoteStatus === "quoted";
  const quoteUnavailable = quoteStatus === "unavailable";

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
          <dd className="text-right font-semibold text-midnight-party/70">
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
            {totalLabel}
          </p>
        </div>
        {quoteIncluded ? (
          <p className="mt-1 font-outfit text-xs text-midnight-party/45">
            Total includes delivery fee
          </p>
        ) : quoteUnavailable ? (
          <p className="mt-1 font-outfit text-xs text-radiant-rose/80">
            Delivery unavailable for this location — total is items only
          </p>
        ) : (
          <p className="mt-1 font-outfit text-xs text-midnight-party/45">
            Delivery fee added once a location quote is ready
          </p>
        )}
      </div>

      <button
        type="submit"
        form={formId}
        disabled={quoteUnavailable || quoteStatus === "loading"}
        onClick={(event) => {
          // Ensure navigation path runs even if the form= association is flaky.
          if (!onProceed) return;
          if (quoteUnavailable || quoteStatus === "loading") return;
          event.preventDefault();
          onProceed();
        }}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-midnight-party px-6 py-3.5 font-outfit text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster disabled:cursor-not-allowed disabled:opacity-50"
      >
        {quoteStatus === "loading"
          ? "Calculating delivery…"
          : "Proceed to payment"}
      </button>

      <p className="mt-3 text-center font-outfit text-xs leading-relaxed text-midnight-party/50">
        You&apos;ll review payment options next. No charge happens on this step.
      </p>

      <Link
        href="/cart"
        className="mt-3 block text-center font-outfit text-sm font-semibold text-lilac-luster transition hover:text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
      >
        Back to cart
      </Link>
    </aside>
  );
}
