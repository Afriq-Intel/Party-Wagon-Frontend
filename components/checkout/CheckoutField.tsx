import type { ReactNode } from "react";

export const checkoutLabelClass =
  "mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/55";

export const checkoutInputClass =
  "w-full rounded-xl border border-midnight-party/12 bg-[#fbf8fa] px-3.5 py-3 font-outfit text-[14px] text-midnight-party outline-none transition placeholder:text-midnight-party/35 focus:border-lilac-luster/45 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60";

export const checkoutErrorTextClass =
  "mt-1.5 font-outfit text-[12.5px] text-radiant-rose";

type CheckoutFieldProps = {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
};

export function CheckoutField({
  id,
  label,
  error,
  optional = false,
  className = "",
  children,
}: CheckoutFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <label htmlFor={id} className={checkoutLabelClass}>
        {label}
        {optional ? (
          <span className="ml-1 normal-case tracking-normal text-midnight-party/40">
            (optional)
          </span>
        ) : null}
      </label>
      <div aria-describedby={error ? errorId : undefined}>{children}</div>
      {error ? (
        <p id={errorId} className={checkoutErrorTextClass} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
