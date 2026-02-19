import { useState } from "react";
import Header from "@/components/sections/Header";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import PlatformSection from "@/components/sections/PlatformSection";
import StageDiagnosisSection from "@/components/sections/StageDiagnosisSection";
import EcosystemSection from "@/components/sections/EcosystemSection";
import TechStackSection from "@/components/sections/TechStackSection";
import ResultsSection from "@/components/sections/ResultsSection";
import FounderSection from "@/components/sections/FounderSection";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import StageClarityCheck from "@/components/StageClarityCheck";

const Index = () => {
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <ScrollProgress />
      <Header />
      <HeroSection onOpenDiagnostic={() => setIsDiagnosticOpen(true)} />
      <ProblemSection />
      <PlatformSection />
      <section id="stage-diagnosis">
        <StageDiagnosisSection />
      </section>
      <section id="ecosystem">
        <EcosystemSection />
      </section>
      <section id="tech">
        <TechStackSection />
      </section>
      <section id="results">
        <ResultsSection />
      </section>
      <FounderSection />
      <Footer />
      
      <StageClarityCheck 
        isOpen={isDiagnosticOpen} 
        onClose={() => setIsDiagnosticOpen(false)} 
      />
    </main>
  );
};

export default Index;
