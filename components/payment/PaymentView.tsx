"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CircleAlert, ShoppingBag, XCircle } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { useCheckoutSession } from "@/lib/checkout/checkout-session-context";
import {
  getPaystackPaymentClient,
  redirectToPaystackCheckout,
} from "@/lib/payments/paystack-client";
import type { PaystackUiStatus } from "@/types/checkout";
import { BrandCtaLink } from "@/components/ui/BrandCtaLink";
import { PaymentAddressCard } from "@/components/payment/PaymentAddressCard";
import { PaymentOrderSummary } from "@/components/payment/PaymentOrderSummary";
import { PaystackProviderCard } from "@/components/payment/PaystackProviderCard";

export function PaymentView() {
  const searchParams = useSearchParams();
  const { items, itemCount, hydrated: cartHydrated } = useCart();
  const { session, hydrated: sessionHydrated } = useCheckoutSession();

  const cancelledFromQuery = searchParams.get("payment") === "cancelled";
  const [status, setStatus] = useState<PaystackUiStatus>(
    cancelledFromQuery ? "cancelled" : "idle",
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(
    cancelledFromQuery
      ? "Payment was cancelled before completion. You can try Paystack again or edit your delivery address."
      : null,
  );

  const subtotalGhs = useMemo(
    () => items.reduce((sum, line) => sum + line.priceGhs * line.quantity, 0),
    [items],
  );

  const ready = cartHydrated && sessionHydrated;
  const totalGhs = session ? subtotalGhs + session.quote.feeGhs : subtotalGhs;

  if (!ready) {
    return (
      <div
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="h-10 w-56 animate-pulse rounded-lg bg-midnight-party/10" />
        <div className="mt-3 h-5 w-48 animate-pulse rounded bg-midnight-party/8" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            <div className="h-56 animate-pulse rounded-[1.75rem] bg-midnight-party/5" />
            <div className="h-64 animate-pulse rounded-[1.75rem] bg-midnight-party/5" />
          </div>
          <div className="h-96 animate-pulse rounded-[1.75rem] bg-midnight-party/5" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header>
          <p className="font-outfit text-xs font-semibold uppercase tracking-[0.16em] text-blue-lagoon">
            Payment
          </p>
          <h1 className="mt-2 font-oswald text-[clamp(2rem,8vw,3rem)] font-bold uppercase leading-tight tracking-wide text-midnight-party">
            Payment
          </h1>
        </header>
        <div className="mt-10 flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-midnight-party/20 bg-offwhite/50 px-6 py-16 text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-lilac-luster/10 text-lilac-luster">
            <ShoppingBag size={28} aria-hidden="true" />
          </span>
          <h2 className="mt-6 font-oswald text-3xl font-bold uppercase tracking-wide text-midnight-party">
            Cart dey empty
          </h2>
          <p className="mt-3 max-w-md font-outfit text-base text-midnight-party/70">
            Add items before you can pay with Paystack.
          </p>
          <div className="mt-8">
            <BrandCtaLink href="/catalogue">Browse catalogue</BrandCtaLink>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header>
          <p className="font-outfit text-xs font-semibold uppercase tracking-[0.16em] text-blue-lagoon">
            Payment
          </p>
          <h1 className="mt-2 font-oswald text-[clamp(2rem,8vw,3rem)] font-bold uppercase leading-tight tracking-wide text-midnight-party">
            Payment
          </h1>
        </header>
        <div className="mt-10 rounded-[1.75rem] border border-dashed border-midnight-party/20 bg-offwhite/50 px-6 py-14 text-center">
          <h2 className="font-oswald text-3xl font-bold uppercase tracking-wide text-midnight-party">
            Address needed first
          </h2>
          <p className="mx-auto mt-3 max-w-md font-outfit text-base text-midnight-party/70">
            Confirm your delivery address and quote on checkout, then proceed to
            Paystack.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <BrandCtaLink href="/checkout">Go to checkout</BrandCtaLink>
            <BrandCtaLink
              href="/cart"
              variant="outline"
              className="text-midnight-party"
            >
              View cart
            </BrandCtaLink>
          </div>
        </div>
      </div>
    );
  }

  async function handlePayWithPaystack() {
    if (!session) return;

    setStatus("loading");
    setStatusMessage(null);

    const client = getPaystackPaymentClient();
    const request = {
      amountGhs: totalGhs,
      currency: "GHS" as const,
      customerPhone: session.address.phone || undefined,
      metadata: {
        subtotalGhs,
        deliveryFeeGhs: session.quote.feeGhs,
        itemCount,
        deliveryCity: session.address.city || undefined,
      },
    };

    try {
      const result = await client.initialize(request);

      if (result.status === "ready") {
        // Live path only — mock client never returns this.
        redirectToPaystackCheckout(result.authorizationUrl);
        return;
      }

      if (result.status === "cancelled") {
        setStatus("cancelled");
        setStatusMessage(result.message);
        return;
      }

      if (result.status === "error") {
        setStatus("error");
        setStatusMessage(result.message);
        return;
      }

      setStatus("pending_backend");
      setStatusMessage(result.message);
    } catch {
      setStatus("error");
      setStatusMessage(
        "We couldn't start Paystack Checkout. Please try again shortly.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href="/checkout"
        className="mb-6 inline-flex items-center gap-2 font-outfit text-sm font-semibold text-lilac-luster transition hover:text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to checkout
      </Link>

      <header>
        <p className="font-outfit text-xs font-semibold uppercase tracking-[0.16em] text-blue-lagoon">
          Final step
        </p>
        <h1 className="mt-2 font-oswald text-[clamp(2rem,8vw,3rem)] font-bold uppercase leading-tight tracking-wide text-midnight-party">
          Payment
        </h1>
        <p className="mt-2 max-w-2xl font-outfit text-base text-midnight-party/65">
          Review your order, then continue with Paystack. You can edit the
          delivery address anytime before paying.
        </p>
      </header>

      {status === "loading" ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-6 rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-4 py-3.5 font-outfit text-sm text-midnight-party/70"
        >
          Preparing Paystack Checkout…
        </div>
      ) : null}

      {status === "pending_backend" && statusMessage ? (
        <div
          role="status"
          className="mt-6 flex gap-3 rounded-xl border border-lemon-twist/40 bg-lemon-twist/15 px-4 py-3.5"
        >
          <CircleAlert
            size={20}
            className="mt-0.5 shrink-0 text-midnight-party"
            aria-hidden="true"
          />
          <div>
            <p className="font-outfit text-sm font-semibold text-midnight-party">
              Payment integration pending
            </p>
            <p className="mt-1 font-outfit text-sm leading-relaxed text-midnight-party/80">
              {statusMessage}
            </p>
          </div>
        </div>
      ) : null}

      {status === "error" && statusMessage ? (
        <div
          role="alert"
          className="mt-6 flex gap-3 rounded-xl border border-radiant-rose/30 bg-radiant-rose/10 px-4 py-3.5"
        >
          <XCircle
            size={20}
            className="mt-0.5 shrink-0 text-radiant-rose"
            aria-hidden="true"
          />
          <div>
            <p className="font-outfit text-sm font-semibold text-midnight-party">
              Couldn&apos;t start payment
            </p>
            <p className="mt-1 font-outfit text-sm leading-relaxed text-midnight-party/80">
              {statusMessage}
            </p>
          </div>
        </div>
      ) : null}

      {status === "cancelled" && statusMessage ? (
        <div
          role="status"
          className="mt-6 flex gap-3 rounded-xl border border-midnight-party/15 bg-offwhite/80 px-4 py-3.5"
        >
          <XCircle
            size={20}
            className="mt-0.5 shrink-0 text-midnight-party/55"
            aria-hidden="true"
          />
          <div>
            <p className="font-outfit text-sm font-semibold text-midnight-party">
              Payment cancelled
            </p>
            <p className="mt-1 font-outfit text-sm leading-relaxed text-midnight-party/75">
              {statusMessage}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <PaymentAddressCard session={session} />
          <PaystackProviderCard />
        </div>

        <PaymentOrderSummary
          items={items}
          itemCount={itemCount}
          subtotalGhs={subtotalGhs}
          deliveryFeeLabel={session.quote.feeLabel}
          deliveryFeeGhs={session.quote.feeGhs}
          onPay={() => {
            void handlePayWithPaystack();
          }}
          paying={status === "loading"}
        />
      </div>
    </div>
  );
}
