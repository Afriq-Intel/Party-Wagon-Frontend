import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { FOOTER_GROUPS } from "@/lib/data/homepage";

export function Footer() {
  return (
    <footer className="bg-midnight-party text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8 lg:py-16">
        <div className="max-w-md">
          <Image
            src="/assets/brand/logo-white.svg"
            alt="Party Wagon"
            width={160}
            height={90}
            className="mb-4 h-12 w-auto"
          />
          <p className="font-outfit text-sm leading-relaxed text-white/80 sm:text-base">
            Party essentials, merchandise, and personalised plans to help you
            celebrate. The plug for all your party needs.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[0.16em] text-lemon-twist">
                {group.title}
              </h2>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-outfit text-sm text-white/85 transition hover:text-lemon-twist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lemon-twist"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-outfit text-xs uppercase tracking-wider text-white/70">
            © Party Wagon
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-outfit text-xs font-semibold uppercase tracking-wide text-midnight-party transition hover:bg-lemon-twist"
            >
              <User size={14} aria-hidden="true" />
              Account
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-outfit text-xs font-semibold uppercase tracking-wide text-midnight-party transition hover:bg-lemon-twist"
            >
              <ShoppingBag size={14} aria-hidden="true" />
              Cart
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
