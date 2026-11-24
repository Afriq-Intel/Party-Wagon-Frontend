"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/data/homepage";
import { useCart } from "@/lib/cart/cart-context";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useRafScrollY } from "@/hooks/useRafScrollY";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { useGlobalSearchQuery } from "@/hooks/useGlobalSearchQuery";

function SearchFallback({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-10 animate-pulse rounded-full bg-white/90 ${className}`}
      aria-hidden="true"
    />
  );
}

function HeaderChrome() {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const { query, setQuery, pathname, searchParams } = useGlobalSearchQuery();

  useRafScrollY((scrollY) => {
    const next = scrollY > 12;
    setScrolled((prev) => (prev === next ? prev : next));
  }, !reducedMotion);

  return (
    <header
      className={`bg-lilac-luster text-white transition-[box-shadow,padding] duration-300 ease-out ${
        scrolled ? "shadow-[0_8px_24px_rgba(51,16,56,0.18)]" : "shadow-none"
      }`}
    >
      {/* Figma: nav row is links + search + account/cart — logo lives in the hero */}
      <div
        className={`mx-auto flex max-w-7xl items-center gap-4 px-4 transition-[padding] duration-300 ease-out sm:px-6 lg:gap-8 lg:px-8 ${
          scrolled ? "py-2.5 lg:py-3" : "py-3 lg:py-4"
        }`}
      >
        <nav
          className="hidden items-center gap-5 lg:flex xl:gap-7"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap font-outfit text-xs font-medium uppercase tracking-[0.08em] transition hover:text-lemon-twist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white xl:text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <GlobalSearch
          id="site-search"
          query={query}
          setQuery={setQuery}
          pathname={pathname}
          searchParams={searchParams}
          className="mx-auto hidden min-w-0 flex-1 md:block lg:max-w-xl"
        />

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 font-outfit text-xs font-semibold uppercase tracking-wide text-midnight-party transition hover:bg-lemon-twist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4 sm:text-sm"
          >
            <User size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Account</span>
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 font-outfit text-xs font-semibold uppercase tracking-wide text-midnight-party transition hover:bg-lemon-twist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4 sm:text-sm"
            aria-label={
              itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"
            }
          >
            <ShoppingBag size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-lemon-twist px-1 font-outfit text-[10px] font-bold text-midnight-party">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-white/40 p-2 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`border-t border-white/15 px-4 transition-[padding,opacity,max-height] duration-300 ease-out md:hidden ${
          scrolled && !mobileOpen
            ? "max-h-0 overflow-hidden border-t-0 py-0 opacity-0"
            : "max-h-20 py-3 opacity-100"
        }`}
      >
        <GlobalSearch
          id="mobile-search"
          query={query}
          setQuery={setQuery}
          pathname={pathname}
          searchParams={searchParams}
        />
      </div>

      {mobileOpen ? (
        <nav
          id="mobile-nav"
          className="border-t border-white/15 px-4 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-2 py-2.5 font-outfit text-base font-medium uppercase tracking-wide hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

function HeaderFallback() {
  return (
    <header className="bg-lilac-luster text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:gap-8 lg:px-8 lg:py-4">
        <SearchFallback className="mx-auto hidden min-w-0 flex-1 md:block lg:max-w-xl" />
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="h-9 w-24 rounded-full bg-white/90" aria-hidden="true" />
          <div className="h-9 w-20 rounded-full bg-white/90" aria-hidden="true" />
        </div>
      </div>
      <div className="border-t border-white/15 px-4 py-3 md:hidden">
        <SearchFallback />
      </div>
    </header>
  );
}

export function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderChrome />
    </Suspense>
  );
}
