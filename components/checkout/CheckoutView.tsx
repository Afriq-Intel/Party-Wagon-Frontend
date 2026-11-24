"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { formatGhs } from "@/lib/catalogue/variants";
import {
  hasCheckoutAddressErrors,
  INITIAL_CHECKOUT_ADDRESS,
  validateCheckoutAddress,
} from "@/lib/checkout/address";
import { buildCheckoutSession } from "@/lib/checkout/checkout-session";
import { useCheckoutSession } from "@/lib/checkout/checkout-session-context";
import {
  deliveryQuoteRequestFromLocation,
  getDeliveryQuoteProvider,
  loadingQuotePlaceholder,
  needsAddressQuotePlaceholder,
  placeholderFromMockQuoteResult,
} from "@/lib/checkout/delivery-quote";
import { countryNameForCode } from "@/lib/checkout/location-provider";
import type {
  CheckoutAddressFieldErrors,
  CheckoutAddressFormValues,
  DeliveryQuotePlaceholder,
  SelectedCheckoutLocation,
} from "@/types/checkout";
import { CheckoutAddressForm } from "@/components/checkout/CheckoutAddressForm";
import { CheckoutDeliverySection } from "@/components/checkout/CheckoutDeliverySection";
import { CheckoutEmpty } from "@/components/checkout/CheckoutEmpty";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";

const FORM_ID = "checkout-address-form";
const QUOTE_DEBOUNCE_MS = 280;

export function CheckoutView() {
  const router = useRouter();
  const { items, itemCount, hydrated } = useCart();
  const {
    session,
    hydrated: sessionHydrated,
    saveSession,
  } = useCheckoutSession();
  const [values, setValues] = useState<CheckoutAddressFormValues>(
    INITIAL_CHECKOUT_ADDRESS,
  );
  const [errors, setErrors] = useState<CheckoutAddressFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedPayload, setConfirmedPayload] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedCheckoutLocation | null>(null);
  const [deliveryQuote, setDeliveryQuote] = useState<DeliveryQuotePlaceholder>(
    () => needsAddressQuotePlaceholder(),
  );
  const [sessionRestored, setSessionRestored] = useState(false);
  const [preservedQuoteKey, setPreservedQuoteKey] = useState<string | null>(
    null,
  );

  const subtotalGhs = useMemo(
    () => items.reduce((sum, line) => sum + line.priceGhs * line.quantity, 0),
    [items],
  );

  const addressConfirmed = confirmedPayload !== null;

  // Prefer editable form values so quote tracks area/city edits after prefill.
  const quoteCity = values.city.trim() || selectedLocation?.city?.trim() || "";
  const quoteArea = values.area.trim() || selectedLocation?.area?.trim() || "";
  const quoteRegion =
    values.region.trim() || selectedLocation?.region?.trim() || "";
  const quoteCountryCode =
    values.countryCode.trim() || selectedLocation?.countryCode?.trim() || "";

  const quotePlaceKey = selectedLocation
    ? [
        selectedLocation.source,
        selectedLocation.suggestionId ?? selectedLocation.title,
        quoteCity.toLowerCase(),
        quoteArea.toLowerCase(),
        quoteRegion.toLowerCase(),
        quoteCountryCode.toUpperCase(),
      ].join("|")
    : "";

  // Restore draft when returning from payment to edit the address.
  useEffect(() => {
    if (!sessionHydrated || sessionRestored) return;
    if (session) {
      const restoredValues = session.address;
      const restoredLocation = session.location;
      const restoredCity =
        restoredValues.city.trim() || restoredLocation.city?.trim() || "";
      const restoredArea =
        restoredValues.area.trim() || restoredLocation.area?.trim() || "";
      const restoredRegion =
        restoredValues.region.trim() || restoredLocation.region?.trim() || "";
      const restoredCountry =
        restoredValues.countryCode.trim() ||
        restoredLocation.countryCode?.trim() ||
        "";
      const restoredKey = [
        restoredLocation.source,
        restoredLocation.suggestionId ?? restoredLocation.title,
        restoredCity.toLowerCase(),
        restoredArea.toLowerCase(),
        restoredRegion.toLowerCase(),
        restoredCountry.toUpperCase(),
      ].join("|");

      setValues(restoredValues);
      setSelectedLocation(restoredLocation);
      setDeliveryQuote({
        status: "quoted",
        feeGhs: session.quote.feeGhs,
        feeLabel: session.quote.feeLabel,
        message:
          "Saved delivery fee restored. Change location to recalculate.",
      });
      setConfirmedPayload(JSON.stringify(session.addressPayload));
      setPreservedQuoteKey(restoredKey);
    }
    setSessionRestored(true);
  }, [session, sessionHydrated, sessionRestored]);

  // Mock delivery quote — recalculates when location pin or place fields change.
  useEffect(() => {
    if (!sessionRestored) return;

    if (!selectedLocation || !quotePlaceKey) {
      setDeliveryQuote(needsAddressQuotePlaceholder());
      return;
    }

    if (preservedQuoteKey && quotePlaceKey === preservedQuoteKey) {
      return;
    }

    if (preservedQuoteKey && quotePlaceKey !== preservedQuoteKey) {
      setPreservedQuoteKey(null);
    }

    const hasPlaceHint = Boolean(
      quoteCity || quoteArea || selectedLocation.suggestionId,
    );

    if (!hasPlaceHint) {
      setDeliveryQuote(
        needsAddressQuotePlaceholder(
          "Add a city or area so we can calculate a delivery quote.",
        ),
      );
      return;
    }

    const provider = getDeliveryQuoteProvider();
    const request = {
      ...deliveryQuoteRequestFromLocation(selectedLocation),
      area: quoteArea || undefined,
      city: quoteCity || undefined,
      region: quoteRegion || undefined,
      countryCode: quoteCountryCode || undefined,
    };

    let cancelled = false;
    setDeliveryQuote(loadingQuotePlaceholder());

    const timer = window.setTimeout(() => {
      void provider.quote(request).then((result) => {
        if (cancelled) return;
        setDeliveryQuote(placeholderFromMockQuoteResult(result));
      });
    }, QUOTE_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    sessionRestored,
    selectedLocation,
    quotePlaceKey,
    quoteCity,
    quoteArea,
    quoteRegion,
    quoteCountryCode,
    preservedQuoteKey,
  ]);

  // Don't keep a confirmed address for an undeliverable location.
  useEffect(() => {
    if (deliveryQuote.status === "unavailable" && confirmedPayload !== null) {
      setConfirmedPayload(null);
    }
  }, [deliveryQuote.status, confirmedPayload]);

  const deliveryFeeLabel =
    deliveryQuote.status === "loading"
      ? "Calculating…"
      : deliveryQuote.status === "quoted" && deliveryQuote.feeLabel
        ? deliveryQuote.feeLabel
        : deliveryQuote.status === "unavailable"
          ? "Unavailable"
          : selectedLocation
            ? "Pending quote"
            : "Select location first";

  const quotedFeeGhs =
    deliveryQuote.status === "quoted" ? (deliveryQuote.feeGhs ?? 0) : 0;

  const totalLabel =
    deliveryQuote.status === "quoted"
      ? formatGhs(subtotalGhs + quotedFeeGhs)
      : formatGhs(subtotalGhs);

  function updateField<K extends keyof CheckoutAddressFormValues>(
    key: K,
    value: CheckoutAddressFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setFormError(null);
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

    // Keep confirmation card in sync when place fields are edited.
    if (
      selectedLocation &&
      (key === "area" ||
        key === "city" ||
        key === "region" ||
        key === "countryCode")
    ) {
      const text = String(value);
      setSelectedLocation((prev) => {
        if (!prev) return prev;
        const next: SelectedCheckoutLocation = { ...prev };
        if (key === "area") next.area = text;
        if (key === "city") next.city = text;
        if (key === "region") next.region = text;
        if (key === "countryCode") {
          next.countryCode = text;
          next.countryName = countryNameForCode(text);
        }
        const parts = [
          next.area,
          next.city,
          next.region,
          next.countryName,
        ].filter((part) => Boolean(part?.trim()));
        if (parts.length > 0) {
          next.subtitle = parts.join(" · ");
        }
        return next;
      });
    }

    if (confirmedPayload !== null) {
      setConfirmedPayload(null);
    }
  }

  function proceedToPayment() {
    setFormError(null);

    if (!selectedLocation) {
      setErrors({});
      setFormError(
        "Search and select a location, use your current location, or enter the address manually.",
      );
      setConfirmedPayload(null);
      return;
    }

    if (deliveryQuote.status === "loading") {
      setFormError("Wait for the delivery quote to finish, then continue.");
      return;
    }

    if (deliveryQuote.status === "unavailable") {
      setFormError(
        "Delivery isn’t available for this location. Change location to continue.",
      );
      setConfirmedPayload(null);
      return;
    }

    if (
      deliveryQuote.status !== "quoted" ||
      deliveryQuote.feeGhs == null ||
      !deliveryQuote.feeLabel
    ) {
      setFormError(
        "Select a deliverable location so we can add a delivery fee before payment.",
      );
      setConfirmedPayload(null);
      return;
    }

    const nextErrors = validateCheckoutAddress(values);
    if (hasCheckoutAddressErrors(nextErrors)) {
      setErrors(nextErrors);
      setFormError("Fix the highlighted fields before proceeding to payment.");
      setConfirmedPayload(null);
      return;
    }

    setErrors({});
    const nextSession = buildCheckoutSession({
      address: values,
      location: selectedLocation,
      quote: {
        feeGhs: deliveryQuote.feeGhs,
        feeLabel: deliveryQuote.feeLabel,
      },
    });

    flushSync(() => {
      saveSession(nextSession);
      setConfirmedPayload(JSON.stringify(nextSession.addressPayload));
    });

    router.push("/payment");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    proceedToPayment();
  }

  if (!hydrated) {
    return (
      <div
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="h-10 w-56 animate-pulse rounded-lg bg-midnight-party/10" />
        <div className="mt-3 h-5 w-40 animate-pulse rounded bg-midnight-party/8" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            <div className="h-80 animate-pulse rounded-[1.75rem] bg-midnight-party/5" />
            <div className="h-48 animate-pulse rounded-[1.75rem] bg-midnight-party/5" />
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
            Checkout
          </p>
          <h1 className="mt-2 font-oswald text-[clamp(2rem,8vw,3rem)] font-bold uppercase leading-tight tracking-wide text-midnight-party">
            Checkout
          </h1>
        </header>
        <div className="mt-10">
          <CheckoutEmpty />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href="/cart"
        className="mb-6 inline-flex items-center gap-2 font-outfit text-sm font-semibold text-lilac-luster transition hover:text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to cart
      </Link>

      <header>
        <p className="font-outfit text-xs font-semibold uppercase tracking-[0.16em] text-blue-lagoon">
          Almost there
        </p>
        <h1 className="mt-2 font-oswald text-[clamp(2rem,8vw,3rem)] font-bold uppercase leading-tight tracking-wide text-midnight-party">
          Checkout
        </h1>
        <p className="mt-2 max-w-2xl font-outfit text-base text-midnight-party/65">
          Confirm where we should deliver, review the quote, then proceed to
          payment.
        </p>
      </header>

      {formError ? (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-radiant-rose/30 bg-radiant-rose/10 px-3.5 py-3 font-outfit text-sm text-midnight-party"
        >
          {formError}
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <CheckoutAddressForm
            formId={FORM_ID}
            values={values}
            errors={errors}
            confirmed={addressConfirmed}
            selectedLocation={selectedLocation}
            onSelectedLocationChange={(location) => {
              setSelectedLocation(location);
              setFormError(null);
              if (confirmedPayload !== null) {
                setConfirmedPayload(null);
              }
            }}
            onChange={updateField}
            onSubmit={handleSubmit}
          />
          <CheckoutDeliverySection quote={deliveryQuote} />
        </div>

        <CheckoutOrderSummary
          items={items}
          itemCount={itemCount}
          subtotalGhs={subtotalGhs}
          deliveryFeeLabel={deliveryFeeLabel}
          totalLabel={totalLabel}
          quoteStatus={deliveryQuote.status}
          formId={FORM_ID}
          onProceed={proceedToPayment}
        />
      </div>
    </div>
  );
}
