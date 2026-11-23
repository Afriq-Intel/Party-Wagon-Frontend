import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AboutHero } from "@/components/about/AboutHero";
import { OurStory } from "@/components/about/OurStory";
import { HumanTension } from "@/components/about/HumanTension";
import { OurPromise } from "@/components/about/OurPromise";
import { OurValues } from "@/components/about/OurValues";
import { WhyPartyWagon } from "@/components/about/WhyPartyWagon";
import { ClosingCta } from "@/components/about/ClosingCta";

export const metadata: Metadata = {
  title: "Behind the Party | Party Wagon",
  description:
    "Discover the Party Wagon story, promise, and values. With just a click, we bring the party to you, helping build stronger connections across Ghana.",
};

export default function AboutPage() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <main className="flex-1">
        <AboutHero />
        <OurStory />
        <HumanTension />
        <OurPromise />
        <OurValues />
        <WhyPartyWagon />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
