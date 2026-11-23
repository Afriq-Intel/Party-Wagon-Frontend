"use client";

import Image from "next/image";
import { useRef } from "react";
import { HeroPhotoTint } from "@/components/ui/HeroPhotoTint";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useRafScrollY } from "@/hooks/useRafScrollY";

const HERO_BG = "/assets/banners/about-hero-bg.jpg";

/**
 * Full-bleed party photo + shared lilac-luster tint for About / Catalogue heroes.
 * Subtle rAF parallax; disabled when prefers-reduced-motion.
 */
export function AboutHeroBackground() {
  const layerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useRafScrollY((scrollY) => {
    const node = layerRef.current;
    if (!node) return;
    const offset = Math.min(scrollY * 0.18, 72);
    node.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
  }, !reduced);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        ref={layerRef}
        className="absolute inset-0 will-change-transform"
        style={
          reduced
            ? { transform: "scale(1.04)" }
            : { transform: "translate3d(0, 0, 0) scale(1.08)" }
        }
      >
        <Image
          src={HERO_BG}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
          className="about-hero-bg-image object-cover object-[center_22%] sm:object-[center_28%] lg:object-[center_35%]"
          style={{ filter: "contrast(1.18) brightness(1.02)" }}
        />
      </div>

      <HeroPhotoTint />
    </div>
  );
}
