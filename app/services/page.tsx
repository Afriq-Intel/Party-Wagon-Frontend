import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesExplore } from "@/components/services/ServicesExplore";
import { WhyChooseServices } from "@/components/services/WhyChooseServices";
import { ServicesCta } from "@/components/services/ServicesCta";

export const metadata: Metadata = {
  title: "Party Services | Party Wagon",
  description:
    "DJ, mixtologist, catering, and mobile bar services, plus more vibes on the way. Party Wagon helps you organise memorable celebrations beyond drinks and food.",
};

export default function ServicesPage() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <main className="flex-1">
        <ServicesHero />
        <ServicesExplore />
        <WhyChooseServices />
        <ServicesCta />
      </main>
      <Footer />
    </>
  );
}
