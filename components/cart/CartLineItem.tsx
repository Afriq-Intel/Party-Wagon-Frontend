"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartLine } from "@/lib/cart/cart-context";
import { formatGhs } from "@/lib/catalogue/variants";

type CartLineItemProps = {
  line: CartLine;
  onSetQuantity: (quantity: number) => void;
  onRemove: () => void;
};

export function CartLineItem({
  line,
  onSetQuantity,
  onRemove,
}: CartLineItemProps) {
  const lineTotal = line.priceGhs * line.quantity;

  return (
    <article className="flex gap-4 border-b border-black/10 py-5 last:border-b-0 sm:gap-5 sm:py-6">
      <Link
        href={`/catalogue/${line.slug}`}
        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f3eef2] sm:h-28 sm:w-24"
      >
        <Image
          src={line.image}
          alt={line.name}
          fill
          sizes="96px"
          className="object-cover object-[center_30%]"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <Link
            href={`/catalogue/${line.slug}`}
            className="font-outfit text-base font-semibold leading-snug text-midnight-party transition hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          >
            {line.name}
          </Link>
          <p className="mt-1 font-outfit text-sm text-midnight-party/55">
            {line.variantName}
          </p>
          <p className="mt-2 font-outfit text-sm font-semibold text-midnight-party sm:hidden">
            {formatGhs(lineTotal)}
          </p>
          <p className="mt-0.5 font-outfit text-xs text-midnight-party/45 sm:mt-1 sm:text-sm">
            {line.priceLabel} each
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end sm:gap-4">
          <div className="flex items-center gap-3">
            <div
              className="inline-flex items-stretch overflow-hidden rounded-lg border border-black/15"
              role="group"
              aria-label={`Quantity for ${line.name}`}
            >
              <button
                type="button"
                aria-label={`Decrease quantity of ${line.name}`}
                disabled={line.quantity <= 1}
                onClick={() => onSetQuantity(line.quantity - 1)}
                className="px-2.5 py-2 text-midnight-party transition hover:bg-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <Minus size={16} aria-hidden="true" />
              </button>
              <span className="flex min-w-[2.75rem] items-center justify-center border-x border-black/15 px-2 font-outfit text-sm font-semibold tabular-nums">
                {line.quantity}
              </span>
              <button
                type="button"
                aria-label={`Increase quantity of ${line.name}`}
                onClick={() => onSetQuantity(line.quantity + 1)}
                className="px-2.5 py-2 text-midnight-party transition hover:bg-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
              >
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${line.name} from cart`}
              className="inline-flex items-center justify-center rounded-lg p-2 text-midnight-party/50 transition hover:bg-radiant-rose/10 hover:text-radiant-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-radiant-rose"
            >
              <Trash2 size={18} aria-hidden="true" />
            </button>
          </div>

          <p className="hidden font-outfit text-base font-bold tabular-nums text-midnight-party sm:block">
            {formatGhs(lineTotal)}
          </p>
        </div>
      </div>
    </article>
  );
}
