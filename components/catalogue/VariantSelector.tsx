"use client";

import type { CatalogueProductVariant } from "@/types/catalogue";

type VariantSelectorProps = {
  variants: CatalogueProductVariant[];
  selectedId: string;
  onSelect: (variantId: string) => void;
  /** Accessible name for the option group. */
  label?: string;
};

/**
 * Variant picker for product detail.
 * Uses compact buttons for a handful of options; switches to a native
 * select when there are many variants (better on small screens).
 */
export function VariantSelector({
  variants,
  selectedId,
  onSelect,
  label = "Options",
}: VariantSelectorProps) {
  if (variants.length <= 1) return null;

  const useDropdown = variants.length > 6;

  return (
    <div className="mt-6">
      <p className="font-outfit text-xs font-semibold uppercase tracking-[0.14em] text-midnight-party/65">
        {label}
      </p>

      {useDropdown ? (
        <label className="mt-2 block">
          <span className="sr-only">{label}</span>
          <select
            value={selectedId}
            onChange={(event) => onSelect(event.target.value)}
            className="mt-1 w-full max-w-md rounded-lg border border-black/15 bg-white px-3 py-3 font-outfit text-sm font-semibold text-midnight-party transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          >
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id} disabled={!variant.inStock}>
                {variant.name}
                {!variant.inStock ? " (out of stock)" : ` (${variant.priceLabel})`}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <div
          className="mt-2.5 flex flex-wrap gap-2"
          role="radiogroup"
          aria-label={label}
        >
          {variants.map((variant) => {
            const selected = variant.id === selectedId;
            const unavailable = !variant.inStock;

            return (
              <button
                key={variant.id}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-disabled={unavailable}
                disabled={unavailable}
                onClick={() => onSelect(variant.id)}
                className={`min-w-[5.5rem] rounded-lg border px-3.5 py-2.5 text-left font-outfit text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster disabled:cursor-not-allowed disabled:opacity-45 ${
                  selected
                    ? "border-lilac-luster bg-lilac-luster/10 text-midnight-party shadow-[3px_3px_0_0_rgba(109,0,255,0.18)]"
                    : "border-black/15 bg-white text-midnight-party/85 hover:border-lilac-luster/45 hover:bg-offwhite/50"
                }`}
              >
                <span className="block font-semibold leading-snug">
                  {variant.name}
                </span>
                <span
                  className={`mt-0.5 block text-xs ${
                    selected ? "text-lilac-luster" : "text-midnight-party/55"
                  }`}
                >
                  {unavailable ? "Out of stock" : variant.priceLabel}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
