"use client";

import { useState, type FormEvent } from "react";
import type {
  CheckoutAddressFieldErrors,
  CheckoutAddressFormValues,
  CheckoutAddressLabel,
  CheckoutLocationSuggestion,
  SelectedCheckoutLocation,
} from "@/types/checkout";
import {
  CHECKOUT_ADDRESS_LABELS,
  COUNTRY_OPTIONS,
  DEFAULT_COUNTRY_CODE,
} from "@/lib/checkout/address";
import {
  applySuggestionToAddressFields,
  countryNameForCode,
  selectedLocationFromSuggestion,
} from "@/lib/checkout/location-provider";
import {
  CheckoutField,
  checkoutErrorTextClass,
  checkoutInputClass,
  checkoutLabelClass,
} from "@/components/checkout/CheckoutField";
import { CheckoutLocationMapPlaceholder } from "@/components/checkout/CheckoutLocationMapPlaceholder";
import { CheckoutLocationSearch } from "@/components/checkout/CheckoutLocationSearch";
import { CheckoutSelectedLocationCard } from "@/components/checkout/CheckoutSelectedLocationCard";

type CheckoutAddressFormProps = {
  formId: string;
  values: CheckoutAddressFormValues;
  errors: CheckoutAddressFieldErrors;
  confirmed: boolean;
  selectedLocation: SelectedCheckoutLocation | null;
  onSelectedLocationChange: (location: SelectedCheckoutLocation | null) => void;
  onChange: <K extends keyof CheckoutAddressFormValues>(
    key: K,
    value: CheckoutAddressFormValues[K],
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function CheckoutAddressForm({
  formId,
  values,
  errors,
  confirmed,
  selectedLocation,
  onSelectedLocationChange,
  onChange,
  onSubmit,
}: CheckoutAddressFormProps) {
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  const detailsVisible = selectedLocation !== null;

  function applyLocationFields(fields: Partial<CheckoutAddressFormValues>) {
    (
      Object.keys(fields) as (keyof CheckoutAddressFormValues)[]
    ).forEach((key) => {
      const value = fields[key];
      if (value !== undefined) {
        onChange(key, value as CheckoutAddressFormValues[typeof key]);
      }
    });
  }

  function handleSelectSuggestion(suggestion: CheckoutLocationSuggestion) {
    setLocationError(null);
    setLocationNotice(null);
    applyLocationFields(applySuggestionToAddressFields(suggestion));
    onSelectedLocationChange(selectedLocationFromSuggestion(suggestion));
  }

  function handleEnterManually() {
    setLocationError(null);
    setLocationNotice(null);
    const countryCode = values.countryCode || DEFAULT_COUNTRY_CODE;
    applyLocationFields({
      countryCode,
      formattedAddress: "",
    });
    onSelectedLocationChange({
      source: "manual",
      title: "Manual address entry",
      subtitle:
        "Fill in house, street, area, and city details so we know where to deliver.",
      countryCode,
      countryName: countryNameForCode(countryCode),
      latitude: null,
      longitude: null,
    });
  }

  function handleUseCurrentLocation() {
    // UI states only — no browser geolocation / external GPS services yet.
    setLocationError(null);
    setLocationNotice(null);
    setLocating(true);
    window.setTimeout(() => {
      setLocating(false);
      setLocationNotice(
        "Current location isn’t connected yet. Search an area, estate, or landmark — or enter the address manually.",
      );
    }, 700);
  }

  function handleChangeLocation() {
    setLocationError(null);
    setLocationNotice(null);
    onSelectedLocationChange(null);
    applyLocationFields({
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      area: "",
      city: "",
      region: "",
      postalCode: "",
      formattedAddress: "",
      countryCode: DEFAULT_COUNTRY_CODE,
    });
  }

  return (
    <form
      id={formId}
      onSubmit={onSubmit}
      noValidate
      className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[8px_8px_0_0_rgba(109,0,255,0.08)] sm:p-6"
    >
      <div className="border-b border-midnight-party/8 pb-5">
        <h2 className="font-oswald text-xl font-semibold uppercase tracking-wide text-midnight-party sm:text-2xl">
          Delivery location
        </h2>
        <p className="mt-2 max-w-2xl font-outfit text-sm leading-relaxed text-midnight-party/65">
          Start with an area, estate, or landmark. Then add house/street details
          and who should receive the order.
        </p>
        {confirmed ? (
          <p
            role="status"
            className="mt-3 rounded-xl border border-blue-lagoon/25 bg-blue-lagoon/10 px-3.5 py-2.5 font-outfit text-sm text-midnight-party"
          >
            Delivery details ready for payment. You can still edit anything
            before proceeding.
          </p>
        ) : null}
      </div>

      <div className="mt-6 space-y-5">
        <CheckoutLocationMapPlaceholder location={selectedLocation} />

        {selectedLocation ? (
          <CheckoutSelectedLocationCard
            location={selectedLocation}
            onChangeLocation={handleChangeLocation}
          />
        ) : (
          <CheckoutLocationSearch
            locating={locating}
            locationError={locationError}
            locationNotice={locationNotice}
            onSelectSuggestion={handleSelectSuggestion}
            onUseCurrentLocation={handleUseCurrentLocation}
            onEnterManually={handleEnterManually}
          />
        )}
      </div>

      {detailsVisible ? (
        <div className="mt-8 border-t border-midnight-party/8 pt-6">
          <h3 className="font-oswald text-lg font-semibold uppercase tracking-wide text-midnight-party">
            Address details
          </h3>
          <p className="mt-1 font-outfit text-sm text-midnight-party/60">
            Prefill from your selected location where available — edit anything
            that needs correcting.
          </p>

          <fieldset className="mt-5">
            <legend className={checkoutLabelClass}>Address label</legend>
            <div
              className="mt-1 flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Address label"
              aria-invalid={Boolean(errors.label)}
            >
              {CHECKOUT_ADDRESS_LABELS.map((label) => {
                const selected = values.label === label;
                return (
                  <button
                    key={label}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() =>
                      onChange("label", label as CheckoutAddressLabel)
                    }
                    className={`min-w-[5.5rem] rounded-lg border px-3.5 py-2.5 font-outfit text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster ${
                      selected
                        ? "border-lilac-luster bg-lilac-luster/10 text-midnight-party shadow-[3px_3px_0_0_rgba(109,0,255,0.18)]"
                        : "border-black/15 bg-white text-midnight-party/85 hover:border-lilac-luster/45 hover:bg-offwhite/50"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {errors.label ? (
              <p className={checkoutErrorTextClass} role="alert">
                {errors.label}
              </p>
            ) : null}
          </fieldset>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <CheckoutField
              id={`${formId}-recipient`}
              label="Recipient name"
              error={errors.recipientName}
              className="sm:col-span-2"
            >
              <input
                id={`${formId}-recipient`}
                name="recipientName"
                type="text"
                autoComplete="name"
                required
                value={values.recipientName}
                onChange={(e) => onChange("recipientName", e.target.value)}
                className={checkoutInputClass}
                placeholder="Who receives the order?"
                aria-invalid={Boolean(errors.recipientName)}
              />
            </CheckoutField>

            <CheckoutField
              id={`${formId}-phone`}
              label="Phone number"
              error={errors.phone}
              className="sm:col-span-2"
            >
              <input
                id={`${formId}-phone`}
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                required
                value={values.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                className={checkoutInputClass}
                placeholder="+233 ..."
                aria-invalid={Boolean(errors.phone)}
              />
            </CheckoutField>

            <CheckoutField
              id={`${formId}-line1`}
              label="House / street details"
              error={errors.addressLine1}
              className="sm:col-span-2"
            >
              <input
                id={`${formId}-line1`}
                name="addressLine1"
                type="text"
                autoComplete="address-line1"
                required
                value={values.addressLine1}
                onChange={(e) => onChange("addressLine1", e.target.value)}
                className={checkoutInputClass}
                placeholder="House no., street, plot, or junction"
                aria-invalid={Boolean(errors.addressLine1)}
              />
            </CheckoutField>

            <CheckoutField
              id={`${formId}-line2`}
              label="Apartment / floor"
              optional
              error={errors.addressLine2}
              className="sm:col-span-2"
            >
              <input
                id={`${formId}-line2`}
                name="addressLine2"
                type="text"
                autoComplete="address-line2"
                value={values.addressLine2}
                onChange={(e) => onChange("addressLine2", e.target.value)}
                className={checkoutInputClass}
                placeholder="Apartment, suite, floor"
                aria-invalid={Boolean(errors.addressLine2)}
              />
            </CheckoutField>

            <CheckoutField
              id={`${formId}-landmark`}
              label="Landmark"
              optional
              error={errors.landmark}
              className="sm:col-span-2"
            >
              <input
                id={`${formId}-landmark`}
                name="landmark"
                type="text"
                value={values.landmark}
                onChange={(e) => onChange("landmark", e.target.value)}
                className={checkoutInputClass}
                placeholder="Near Achimota Mall, opposite the filling station…"
                aria-invalid={Boolean(errors.landmark)}
              />
            </CheckoutField>

            <CheckoutField
              id={`${formId}-area`}
              label="Area / estate"
              optional
              error={errors.area}
            >
              <input
                id={`${formId}-area`}
                name="area"
                type="text"
                value={values.area}
                onChange={(e) => onChange("area", e.target.value)}
                className={checkoutInputClass}
                placeholder="e.g. East Legon, Community 25"
                aria-invalid={Boolean(errors.area)}
              />
            </CheckoutField>

            <CheckoutField id={`${formId}-city`} label="City" error={errors.city}>
              <input
                id={`${formId}-city`}
                name="city"
                type="text"
                autoComplete="address-level2"
                required
                value={values.city}
                onChange={(e) => onChange("city", e.target.value)}
                className={checkoutInputClass}
                placeholder="e.g. Accra"
                aria-invalid={Boolean(errors.city)}
              />
            </CheckoutField>

            <CheckoutField
              id={`${formId}-region`}
              label="Region"
              optional
              error={errors.region}
            >
              <input
                id={`${formId}-region`}
                name="region"
                type="text"
                autoComplete="address-level1"
                value={values.region}
                onChange={(e) => onChange("region", e.target.value)}
                className={checkoutInputClass}
                placeholder="e.g. Greater Accra"
                aria-invalid={Boolean(errors.region)}
              />
            </CheckoutField>

            <CheckoutField
              id={`${formId}-country`}
              label="Country"
              error={errors.countryCode}
            >
              <select
                id={`${formId}-country`}
                name="countryCode"
                required
                value={values.countryCode}
                onChange={(e) => onChange("countryCode", e.target.value)}
                className={checkoutInputClass}
                aria-invalid={Boolean(errors.countryCode)}
              >
                {COUNTRY_OPTIONS.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </CheckoutField>

            <CheckoutField
              id={`${formId}-postal`}
              label="Postal code"
              optional
              error={errors.postalCode}
            >
              <input
                id={`${formId}-postal`}
                name="postalCode"
                type="text"
                autoComplete="postal-code"
                value={values.postalCode}
                onChange={(e) => onChange("postalCode", e.target.value)}
                className={checkoutInputClass}
                placeholder="If available"
                aria-invalid={Boolean(errors.postalCode)}
              />
            </CheckoutField>

            {values.formattedAddress ? (
              <CheckoutField
                id={`${formId}-formatted`}
                label="Formatted address"
                optional
                className="sm:col-span-2"
              >
                <input
                  id={`${formId}-formatted`}
                  name="formattedAddress"
                  type="text"
                  value={values.formattedAddress}
                  onChange={(e) => onChange("formattedAddress", e.target.value)}
                  className={checkoutInputClass}
                />
              </CheckoutField>
            ) : null}

            <CheckoutField
              id={`${formId}-instructions`}
              label="Delivery instructions"
              optional
              error={errors.deliveryInstructions}
              className="sm:col-span-2"
            >
              <textarea
                id={`${formId}-instructions`}
                name="deliveryInstructions"
                rows={3}
                value={values.deliveryInstructions}
                onChange={(e) =>
                  onChange("deliveryInstructions", e.target.value)
                }
                className={`${checkoutInputClass} min-h-[5.5rem] resize-y`}
                placeholder="Gate code, colour of the gate, preferred drop-off notes…"
                aria-invalid={Boolean(errors.deliveryInstructions)}
              />
            </CheckoutField>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-4 py-3.5">
            <input
              type="checkbox"
              name="isDefault"
              checked={values.isDefault}
              onChange={(e) => onChange("isDefault", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-midnight-party/25 text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
            />
            <span>
              <span className="block font-outfit text-sm font-semibold text-midnight-party">
                Set as default address
              </span>
              <span className="mt-0.5 block font-outfit text-xs text-midnight-party/55">
                We&apos;ll prefer this address next time you order (once saved
                addresses are available).
              </span>
            </span>
          </label>
        </div>
      ) : null}
    </form>
  );
}
