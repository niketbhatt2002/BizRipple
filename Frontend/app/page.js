import Navbar from "@/components/Navigation/Navbar";
import HeroSection from "@/components/Home/HeroSection";
import FeatureSection from "@/components/Home/FeatureSection";
import StatsSection from "@/components/Home/StatsSection";
import CTASection from "@/components/Home/CTASection";
import Footer from "@/components/Navigation/Footer";

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Navbar />

      <HeroSection />

      <FeatureSection />

      <StatsSection />

      <CTASection />

      <Footer />
    </div>
  );
}
