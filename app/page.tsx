import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AboutSection } from "@/components/home/AboutSection";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { CategorySection } from "@/components/home/CategorySection";
import { HeroSection } from "@/components/home/HeroSection";
import { MessageTicker } from "@/components/home/MessageTicker";
import { PartyPlannerBanner } from "@/components/home/PartyPlannerBanner";
import { PartnerBanner } from "@/components/home/PartnerBanner";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <main className="flex-1">
        <HeroSection />
        <MessageTicker />
        <CategorySection />
        <BestSellersSection />
        <AboutSection />
        <PartyPlannerBanner />
        <TestimonialsSection />
        <PartnerBanner />
      </main>
      <Footer />
    </>
  );
}
