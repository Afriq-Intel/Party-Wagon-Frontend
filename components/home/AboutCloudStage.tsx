"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Link from "next/link";
import { ArrowRight, Martini, ShoppingBag, Star } from "lucide-react";
import { CloudPhoto } from "@/components/ui/CloudPhoto";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const STAR_COUNT = 5;

const CLOUDS = [
  {
    src: "/assets/about/party-dance-joy.jpg",
    alt: "Friends dancing and laughing at a party",
    objectPosition: "center 32%",
    priority: true,
    className:
      "left-0 top-0 z-10 w-[52%] sm:w-[42%] lg:w-[30%]",
    tilt: "-3deg",
    lift: "-12px",
    scale: "1.05",
    parallaxX: "18px",
    parallaxY: "14px",
    drift: "8.6s",
    driftDelay: "0s",
    reveal: "90ms",
  },
  {
    src: "/assets/about/party-cheers.jpg",
    alt: "Friends drinking together at an outdoor party",
    objectPosition: "center 28%",
    priority: false,
    className:
      "right-0 top-[8%] z-20 w-[40%] sm:right-auto sm:left-[56%] sm:top-[6%] sm:w-[32%] lg:left-[34%] lg:top-[12%] lg:w-[18%]",
    tilt: "3.2deg",
    lift: "-9px",
    scale: "1.06",
    parallaxX: "-24px",
    parallaxY: "18px",
    drift: "7.1s",
    driftDelay: "-1.4s",
    reveal: "200ms",
  },
  {
    src: "/assets/about/party-group.jpg",
    alt: "Friends dancing with drinks at a party",
    objectPosition: "center 42%",
    priority: false,
    className:
      "left-[10%] top-[46%] z-30 w-[76%] sm:left-[14%] sm:top-[44%] sm:w-[64%] lg:left-[6%] lg:top-[36%] lg:w-[48%]",
    tilt: "-1.6deg",
    lift: "-14px",
    scale: "1.035",
    parallaxX: "8px",
    parallaxY: "6px",
    drift: "9.8s",
    driftDelay: "-2.2s",
    reveal: "320ms",
  },
] as const;

export function AboutCloudStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }

    const node = stageRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  function moveClouds(event: PointerEvent<HTMLDivElement>) {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--cloud-x", x.toFixed(3));
    event.currentTarget.style.setProperty("--cloud-y", y.toFixed(3));
  }

  function resetClouds(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--cloud-x", "0");
    event.currentTarget.style.setProperty("--cloud-y", "0");
  }

  return (
    <div
      ref={stageRef}
      className="relative mx-auto max-w-[1240px]"
      style={{ "--cloud-x": "0", "--cloud-y": "0" } as CSSProperties}
      onPointerMove={moveClouds}
      onPointerLeave={resetClouds}
    >
      <h2
        id="about-heading"
        className={`about-reveal text-center font-oswald text-[clamp(1.7rem,5.5vw,4.7rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-midnight-party ${shown ? "is-shown" : ""}`}
        style={{ "--reveal-delay": "0ms" } as CSSProperties}
      >
        <span className="block">Drinks, platters, and the</span>
        <span className="block">whole spread that turns a</span>
        <span className="block">hangout into a party</span>
      </h2>

      <div className="relative mt-3 sm:mt-4">
        <div className="relative h-[520px] sm:h-[600px] lg:h-[760px] xl:h-[820px]">
          {CLOUDS.map((cloud) => (
            <div
              key={cloud.src}
              className={`about-cloud about-reveal absolute ${cloud.className} ${shown ? "is-shown" : ""}`}
              style={
                {
                  "--reveal-delay": cloud.reveal,
                  "--tilt": cloud.tilt,
                  "--lift": cloud.lift,
                  "--scale": cloud.scale,
                  "--parallax-x": cloud.parallaxX,
                  "--parallax-y": cloud.parallaxY,
                  "--drift": cloud.drift,
                  "--drift-delay": cloud.driftDelay,
                } as CSSProperties
              }
            >
              <div className="about-cloud__drift">
                <div className="about-cloud__parallax">
                  <div className="about-cloud__hover">
                    <CloudPhoto
                      src={cloud.src}
                      alt={cloud.alt}
                      objectPosition={cloud.objectPosition}
                      priority={cloud.priority}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`about-reveal relative z-40 mt-8 max-w-xl lg:absolute lg:right-0 lg:top-[48%] lg:mt-0 lg:w-[34%] lg:max-w-none ${shown ? "is-shown" : ""}`}
          style={{ "--reveal-delay": "420ms" } as CSSProperties}
        >
          <p className="font-outfit text-[clamp(1.35rem,1.85vw,1.85rem)] font-semibold leading-[1.22] text-midnight-party">
            We’re not just bringing the party. We’re changing the way you
            celebrate, one unforgettable moment at a time.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3 lg:flex-nowrap">
            <Link
              href="/about"
              className="inline-flex items-center gap-3 rounded-full border border-midnight-party py-1 pl-5 pr-1 font-outfit text-[11px] font-semibold uppercase tracking-[0.16em] text-midnight-party transition hover:bg-midnight-party hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midnight-party"
            >
              About Us
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-current">
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>

            <div className="flex items-center gap-0.5" aria-hidden="true">
              {Array.from({ length: STAR_COUNT }, (_, index) => (
                <Star
                  key={index}
                  size={16}
                  className={
                    index < STAR_COUNT - 1
                      ? "fill-midnight-party text-midnight-party"
                      : "fill-none text-midnight-party"
                  }
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link
                  href="/catalogue"
                  aria-label="Shop drinks"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-midnight-party text-white transition hover:bg-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midnight-party"
                >
                  <Martini size={18} strokeWidth={1.75} aria-hidden="true" />
                </Link>
                <Link
                  href="/cart"
                  aria-label="Open shopping bag"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-midnight-party text-white transition hover:bg-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midnight-party"
                >
                <ShoppingBag size={18} strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
