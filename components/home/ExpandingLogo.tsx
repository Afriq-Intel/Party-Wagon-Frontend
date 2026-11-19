"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useRafScrollY } from "@/hooks/useRafScrollY";

/**
 * Party Wagon wordmark that gently scales up as the hero scrolls away.
 * Transform-only; no layout width changes.
 */
export function ExpandingLogo() {
  const reducedMotion = usePrefersReducedMotion();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useRafScrollY(() => {
    const link = linkRef.current;
    if (!link) return;

    if (!sectionRef.current) {
      sectionRef.current = link.closest("section");
    }

    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const travel = Math.max(rect.height * 0.55, 1);
    const progress = Math.min(1, Math.max(0, -rect.top / travel));
    const scale = 1 + progress * 0.42;

    link.style.transform = `scale(${scale})`;
  }, !reducedMotion);

  return (
    <Link
      ref={linkRef}
      href="/"
      aria-label="Party Wagon Home"
      className="origin-bottom-left block w-[42%] max-w-[220px] min-w-[112px] will-change-transform transition hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lemon-twist sm:w-[28%] md:w-[20%] lg:max-w-[240px]"
      style={reducedMotion ? undefined : { transform: "scale(1)" }}
    >
      <Image
        src="/assets/brand/logo-light.svg"
        alt="Party Wagon"
        width={928}
        height={525}
        priority
        className="h-auto w-full"
        style={{ width: "100%", height: "auto" }}
      />
    </Link>
  );
}
