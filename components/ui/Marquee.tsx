"use client";

import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useRafScrollY } from "@/hooks/useRafScrollY";

type MarqueeTone = "midnight" | "rose";
type MarqueeDirection = "left" | "right";

type MarqueeProps = {
  messages: readonly string[];
  className?: string;
  textClassName?: string;
  speed?: "normal" | "fast";
  tone?: MarqueeTone;
  /** Continuous CSS direction. Pair top/bottom with opposite values. */
  direction?: MarqueeDirection;
  /** Extra translate tied to scrollY for scroll-responsive feel. */
  scrollLinked?: boolean;
};

function AsteriskSeparator() {
  return (
    <span
      className="mx-4 inline-flex shrink-0 font-outfit text-sm font-bold sm:mx-5 sm:text-base"
      aria-hidden="true"
    >
      *
    </span>
  );
}

function MarqueeTrack({
  messages,
  textClassName,
}: {
  messages: readonly string[];
  textClassName: string;
}) {
  const loop = Array.from({ length: 4 }, () => messages).flat();

  return (
    <div className="flex shrink-0 items-center">
      {loop.map((message, index) => (
        <span
          key={`${message}-${index}`}
          className={`inline-flex items-center whitespace-nowrap font-outfit text-xs font-bold uppercase tracking-[0.14em] sm:text-sm ${textClassName}`}
        >
          {message}
          <AsteriskSeparator />
        </span>
      ))}
    </div>
  );
}

const toneStyles: Record<MarqueeTone, string> = {
  midnight: "bg-midnight-party text-white",
  rose: "bg-radiant-rose text-white",
};

export function Marquee({
  messages,
  className = "",
  textClassName = "",
  speed = "normal",
  tone = "midnight",
  direction = "left",
  scrollLinked = true,
}: MarqueeProps) {
  const reducedMotion = usePrefersReducedMotion();
  const scrollLayerRef = useRef<HTMLDivElement>(null);

  const animationClass =
    direction === "right"
      ? speed === "fast"
        ? "animate-marquee-reverse-fast"
        : "animate-marquee-reverse"
      : speed === "fast"
        ? "animate-marquee-fast"
        : "animate-marquee";

  useRafScrollY((scrollY) => {
    const node = scrollLayerRef.current;
    if (!node) return;
    // Opposite scroll coupling so paired tickers drift apart while scrolling
    const factor = direction === "left" ? -0.18 : 0.18;
    node.style.transform = `translate3d(${scrollY * factor}px, 0, 0)`;
  }, scrollLinked && !reducedMotion);

  return (
    <div
      className={`group overflow-hidden ${toneStyles[tone]} ${className}`}
      role="presentation"
    >
      <div
        ref={scrollLayerRef}
        className="will-change-transform"
        style={
          reducedMotion || !scrollLinked
            ? undefined
            : { transform: "translate3d(0, 0, 0)" }
        }
      >
        <div
          className={`flex w-max items-center py-2.5 group-hover:[animation-play-state:paused] motion-reduce:animate-none sm:py-3 ${
            reducedMotion ? "" : animationClass
          }`}
        >
          <MarqueeTrack messages={messages} textClassName={textClassName} />
          <MarqueeTrack messages={messages} textClassName={textClassName} />
        </div>
      </div>
    </div>
  );
}
