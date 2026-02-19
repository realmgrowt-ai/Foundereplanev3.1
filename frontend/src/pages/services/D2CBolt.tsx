import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, Minus, Zap } from "lucide-react";
import founderplaneLogo from "@/assets/founderplane-logo-new.png";
import ScrollTracker from "@/components/ScrollTracker";

const D2CBOLT_SECTIONS = [
  { id: 'hero-section', name: 'Hero' },
  { id: 'diagnosis-section', name: 'Diagnosis' },
  { id: 'truth-section', name: 'Truth' },
  { id: 'ownership-section', name: 'Ownership' },
  { id: 'architecture-section', name: 'Architecture' },
  { id: 'requirements-section', name: 'Requirements' },
  { id: 'diagnostic-section', name: 'Diagnostic' },
  { id: 'gateway-section', name: 'Gateway' },
  { id: 'faq-section', name: 'FAQ' },
];
import StageClarityCheck from "@/components/StageClarityCheck";
import LeadCaptureModal from "@/components/LeadCaptureModal";

// ═══════════════════════════════════════════════════════════════════
// DESIGN TOKENS - D2CBOLT IDENTITY (From Blueprint)
// ═══════════════════════════════════════════════════════════════════
const colors = {
  jetBlack: "#1D1D1F",
  cinematicBlack: "#0A0A0B",
  profitGreen: "#00B359",
  mistGrey: "#F5F5F7",
  galleryWhite: "#FFFFFF",
  pureWhite: "#FFFFFF",
  graphite: "#424245",
  darkGrey: "#444444",
  lightGrey: "#86868B",
  mediumGrey: "#666666",
  cardBorder: "#E5E5E5",
};

// ═══════════════════════════════════════════════════════════════════
// PREMIUM MOTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════

const PerformanceGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(240, 240, 240, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(240, 240, 240, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <motion.div
        className="absolute w-full"
        style={{
          height: '200%',
          top: '-100%',
          backgroundImage: `
            linear-gradient(to right, rgba(240, 240, 240, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(240, 240, 240, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        animate={{ y: ['0%', '50%'] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

const SpotlightCard = ({ children, className, style }: { 
  children: React.ReactNode; 
  className?: string; 
  style?: React.CSSProperties;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    requestAnimationFrame(() => {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{ ...style, transform: 'translateZ(0)', willChange: 'transform' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 179, 89, 0.06), rgba(0, 179, 89, 0.02) 40%, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-all duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          boxShadow: 'inset 0 0 0 1px rgba(0, 179, 89, 0.12), inset 0 0 30px rgba(0, 179, 89, 0.02)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const AnimatedBullet = ({ delay = 0 }: { delay?: number }) => {
  return (
    <div className="relative w-2 h-2 mr-3 mt-2 flex-shrink-0">
      <motion.div
        className="w-full h-full rounded-full"
        style={{ backgroundColor: colors.profitGreen }}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay, type: "spring", stiffness: 400, damping: 15 }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: colors.profitGreen }}
        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.5 }}
      />
    </div>
  );
};

const PlusIcon = () => (
  <div className="relative w-4 h-4 mr-3 mt-0.5 flex-shrink-0">
    <Plus className="w-4 h-4" style={{ color: colors.profitGreen }} strokeWidth={2.5} />
  </div>
);

const MinusIcon = () => (
  <div className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0">
    <Minus className="w-4 h-4" style={{ color: colors.lightGrey }} strokeWidth={2.5} />
  </div>
);

const WordReveal = ({ text, className, style, delay = 0 }: { 
  text: string; className?: string; style?: React.CSSProperties; delay?: number 
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const words = text.split(' ');
  return (
    <span ref={ref} className={className} style={style}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: delay + index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

const RevealText = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════
// MAIN D2CBOLT COMPONENT
// ═══════════════════════════════════════════════════════════════════

const D2CBolt = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showStageClarityCheck, setShowStageClarityCheck] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const diagnosisRef = useRef<HTMLDivElement>(null);

  // CRITICAL: Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll-based card activation for Section 2
  useEffect(() => {
    const handleScroll = () => {
      if (!diagnosisRef.current) return;
      const rect = diagnosisRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - window.innerHeight)));
      const newActiveCard = Math.min(3, Math.floor(scrollProgress * 4));
      setActiveCard(newActiveCard);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openChat = () => {
    setShowLeadCapture(true);
  };

  return (
    <main className="min-h-screen overflow-x-hidden">
      <ScrollTracker page="D2CBolt" sections={D2CBOLT_SECTIONS} />
      
      {/* Stage Clarity Check Modal */}
      <StageClarityCheck 
        isOpen={showStageClarityCheck} 
        onClose={() => setShowStageClarityCheck(false)} 
      />
      
      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
        serviceName="D2CBolt"
        sourcePage="d2cbolt"
      />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: THE HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        data-testid="hero-section"
        className="relative flex flex-col items-center justify-center"
        style={{ backgroundColor: colors.galleryWhite, paddingTop: "200px", paddingBottom: "160px", minHeight: "100vh" }}
      >
        
        <motion.nav 
          className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
              <motion.div 
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.profitGreen }}
              >
                <Zap className="w-5 h-5 text-white" />
              </motion.div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "18px", letterSpacing: "-0.02em", color: colors.jetBlack }}>
                D2CBolt
              </span>
            </motion.div>
            <div className="flex items-center gap-4">
              <Link to="/" className="hidden md:flex items-center gap-2 transition-opacity hover:opacity-70">
                <span className="text-sm" style={{ color: colors.lightGrey }}>by</span>
                <img src={founderplaneLogo} alt="FounderPlane" className="h-7 w-7" />
                <span className="font-medium text-sm" style={{ color: colors.jetBlack }}>FounderPlane</span>
              </Link>
              <div className="hidden md:block w-px h-5 bg-slate-200" />
              <motion.button
                data-testid="nav-chat-btn"
                onClick={openChat}
                className="px-5 py-2 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg"
                style={{ backgroundColor: colors.profitGreen, color: colors.jetBlack, fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 500 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                CHAT
              </motion.button>
            </div>
          </div>
        </motion.nav>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-[800px] mx-auto">
            
            <motion.p
              data-testid="hero-eyebrow"
              className="mb-8 uppercase tracking-wider"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: "14px", color: colors.profitGreen, letterSpacing: "0.04em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              FOUNDERPLANE — D2C GROWTH ENGINE
            </motion.p>

            <motion.h1
              className="mb-8"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(48px, 6vw, 80px)", lineHeight: 1.1, color: colors.jetBlack }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Scale Your Physical Product.<br />
              Stop Burning Cash on Ads.
            </motion.h1>

            <motion.p
              className="mx-auto mb-12"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.7, maxWidth: "600px", color: colors.graphite }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              We optimize your store's conversion rate, set up your data tracking, and produce the creative assets needed to scale profitably.
            </motion.p>

            <motion.button
              data-testid="hero-cta-btn"
              className="px-8 py-4 rounded-full flex items-center gap-3 mx-auto mb-6"
              style={{ 
                backgroundColor: colors.profitGreen, 
                color: colors.jetBlack,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                fontSize: "15px"
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              onClick={openChat}
            >
              DEPLOY THE SYSTEM
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.p
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: colors.lightGrey }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Built for D2C founders who have proven product-market fit and are ready to engineer predictable profit.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: THE DIAGNOSIS
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        ref={diagnosisRef}
        data-testid="diagnosis-section"
        className="relative min-h-[200vh]"
        style={{ backgroundColor: colors.mistGrey, padding: "140px 0" }}
      >
        <div className="sticky top-0 min-h-screen flex items-center">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-5 gap-12 items-start">
              
              {/* Left Side - Sticky */}
              <div className="md:col-span-2">
                <motion.p
                  data-testid="diagnosis-eyebrow"
                  className="uppercase tracking-widest mb-4"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.lightGrey }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  THE DIAGNOSIS
                </motion.p>
                
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(48px, 6vw, 64px)", letterSpacing: "-0.02em", color: colors.jetBlack, lineHeight: 1.1 }}>
                  <WordReveal text="Growth Without Structure." delay={0.1} />
                </h2>
                
                <motion.p 
                  className="mt-6" 
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", lineHeight: 1.6, color: colors.graphite, maxWidth: "400px" }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  Disconnected data, weak creative, and leaky funnels are destroying your margins.
                </motion.p>
              </div>

              {/* Right Side - Spotlight Cards */}
              <div className="md:col-span-3 space-y-6">
                {[
                  { 
                    title: "The Ad-Dependency Trap.", 
                    body: "You rely on paid traffic for daily volume. You're renting attention, not owning a system." 
                  },
                  { 
                    title: "The Store Disconnect.", 
                    body: "Traffic lands, but your store ignores buyer psychology. You haven't engineered the triggers to convert." 
                  },
                  { 
                    title: "The Data Blindspot.", 
                    body: "You don't know what's working. Without unified tracking, you're scaling blind." 
                  },
                  { 
                    title: "One-and-Done Buyers.", 
                    body: "You pay premium to acquire customers who never return. Your LTV can't justify the spend." 
                  }
                ].map((card, index) => (
                  <SpotlightCard
                    key={index}
                    className="p-8 rounded-2xl border"
                    style={{ 
                      backgroundColor: `rgba(255,255,255,${activeCard === index ? 0.98 : 0.7})`,
                      borderColor: activeCard === index ? colors.profitGreen + '30' : colors.cardBorder,
                      boxShadow: activeCard === index ? "0 20px 40px rgba(0,0,0,0.06)" : "0 2px 8px rgba(0,0,0,0.04)",
                      opacity: activeCard === index ? 1 : 0.45,
                      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                  >
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "22px", color: colors.jetBlack, marginBottom: "10px" }}>
                      {card.title}
                    </h3>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", lineHeight: 1.6, color: colors.graphite }}>
                      {card.body}
                    </p>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: THE TRUTH
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        data-testid="truth-section"
        className="relative min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: colors.cinematicBlack, padding: "160px 0" }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-[800px] mx-auto">
            
            <motion.p
              data-testid="truth-eyebrow"
              className="uppercase tracking-wider mb-8"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: "14px", color: colors.profitGreen, letterSpacing: "0.04em" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE TRUTH
            </motion.p>

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontStyle: "italic", fontSize: "clamp(32px, 4.5vw, 52px)", color: colors.pureWhite, lineHeight: 1.3, marginBottom: "32px" }}>
              <WordReveal 
                text={`"Scaling a broken funnel doesn't create a bigger business. It burns cash faster. You don't need a new ad agency. You need a system that converts and retains."`}
                delay={0.2}
              />
            </h2>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: THE OWNERSHIP
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        data-testid="ownership-section"
        className="relative"
        style={{ backgroundColor: colors.galleryWhite, padding: "160px 0" }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            
            <motion.p
              data-testid="ownership-eyebrow"
              className="uppercase tracking-wider mb-4"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: "14px", color: colors.profitGreen, letterSpacing: "0.04em" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE OWNERSHIP
            </motion.p>

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(36px, 4vw, 48px)", color: colors.jetBlack, lineHeight: 1.15, marginBottom: "20px" }}>
              <WordReveal text="What We Engineer. What We Don't." />
            </h2>

            <RevealText delay={0.2}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "17px", lineHeight: 1.7, color: colors.darkGrey, marginBottom: "56px", maxWidth: "600px" }}>
                We take absolute ownership of your growth infrastructure, data stack, and creative production.
              </p>
            </RevealText>

            <div className="space-y-5 mb-12">
              {[
                { title: "Store Conversion Optimization:", body: "We optimize your e-commerce layout to maximize conversion rates." },
                { title: "Data & Tracking Setup:", body: "We unify your storefront and pixels into one source of truth." },
                { title: "Creative Asset Production:", body: "We produce high-converting assets\u2014from UGC to studio visuals." },
                { title: "SEO & Search Visibility:", body: "We architect your pages so search engines favor your products." },
                { title: "Email & SMS Retention:", body: "We deploy automated loops to turn buyers into lifetime value." },
                { title: "Profitable Ad Scaling:", body: "We manage campaigns under strict efficiency targets for growth." }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <AnimatedBullet delay={index * 0.1} />
                  <div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "16px", color: colors.jetBlack }}>{item.title}</span>{" "}
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", lineHeight: 1.6, color: colors.graphite }}>{item.body}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="pt-8 border-t"
              style={{ borderColor: colors.cardBorder }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <p style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", fontSize: "15px", color: colors.mediumGrey, lineHeight: 1.7, maxWidth: "600px" }}>
                <strong style={{ fontWeight: 500 }}>The Boundary:</strong> We do not manage customer support, 3PL logistics, or inventory sourcing.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: THE ARCHITECTURE
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        data-testid="architecture-section"
        className="relative"
        style={{ backgroundColor: colors.mistGrey, padding: "160px 0" }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            
            <div className="text-center mb-20">
              <motion.p
                data-testid="architecture-eyebrow"
                className="uppercase tracking-wider mb-4"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: "14px", color: colors.profitGreen, letterSpacing: "0.04em" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                THE ARCHITECTURE
              </motion.p>

              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(36px, 4vw, 48px)", color: colors.jetBlack, lineHeight: 1.15, marginBottom: "20px" }}>
                <WordReveal text="The 6-Phase Profit Infrastructure." />
              </h2>

              <RevealText delay={0.2}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "17px", lineHeight: 1.7, color: colors.darkGrey, maxWidth: "600px", margin: "0 auto" }}>
                  We engineer your technology, buyer psychology, and creative assets before we scale your acquisition.
                </p>
              </RevealText>
            </div>

            <div className="space-y-5">
              {[
                { phase: "01", title: "Business & Positioning Strategy", body: "Deep research to profile your most profitable customer and engineer data-driven positioning." },
                { phase: "02", title: "Data & Tracking Integration", body: "Integrate your storefront and tracking pixels into a unified single source of truth." },
                { phase: "03", title: "Store Conversion Optimization", body: "Rebuild your product pages and checkout flows to eliminate friction and maximize conversion." },
                { phase: "04", title: "Creative Asset Production", body: "Script, direct, and produce high-converting assets\u2014from UGC to studio visuals." },
                { phase: "05", title: "SEO & Retention Setup", body: "Capture organic search demand through SEO while installing automated retention loops." },
                { phase: "06", title: "Profitable Ad Scaling", body: "Turn on traffic and manage campaigns against strict efficiency targets for profitable scale." }
              ].map((item, index) => (
                <SpotlightCard
                  key={index}
                  className="p-10 rounded-2xl border"
                  style={{ backgroundColor: colors.pureWhite, borderColor: colors.cardBorder, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                >
                  <motion.div
                    className="flex flex-col md:flex-row md:items-start gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                  >
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: "28px", color: colors.profitGreen, flexShrink: 0, opacity: 0.7 }}>
                      {item.phase}
                    </span>
                    <div>
                      <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "18px", color: colors.jetBlack, marginBottom: "6px" }}>
                        {item.title}
                      </h3>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", lineHeight: 1.6, color: colors.graphite }}>
                        {item.body}
                      </p>
                    </div>
                  </motion.div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6: SYSTEM REQUIREMENTS
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        data-testid="requirements-section"
        className="relative"
        style={{ backgroundColor: colors.mistGrey, padding: "160px 0" }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            <div className="text-center mb-20">
              <motion.p
                data-testid="requirements-eyebrow"
                className="uppercase tracking-wider mb-4"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: "14px", color: colors.profitGreen, letterSpacing: "0.04em" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                OPERATIONAL THRESHOLDS
              </motion.p>

              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(36px, 4vw, 48px)", color: colors.jetBlack, lineHeight: 1.15, marginBottom: "20px" }}>
                <WordReveal text="System Compatibility." />
              </h2>

              <RevealText delay={0.2}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "17px", lineHeight: 1.7, color: colors.darkGrey, maxWidth: "600px", margin: "0 auto" }}>
                  D2CBolt is built for scaling, not starting. This requires an existing, proven foundation.
                </p>
              </RevealText>
            </div>

            <div className="grid md:grid-cols-2 gap-20">
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "18px", color: colors.jetBlack, marginBottom: "28px" }}>
                  Compatible
                </h3>
                <div className="space-y-5">
                  {[
                    "Early-stage to mid-growth D2C brand.",
                    "Proven product-market fit with validated demand.",
                    "Consistent baseline revenue.",
                    "Committed to systematic growth over hype."
                  ].map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start group"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PlusIcon />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", lineHeight: 1.6, color: colors.jetBlack }}>
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="opacity-70"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 0.7, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "18px", color: colors.darkGrey, marginBottom: "28px" }}>
                  Incompatible
                </h3>
                <div className="space-y-5">
                  {[
                    "Still testing your first product idea.",
                    "Unwilling to deploy paid acquisition.",
                    "Selling B2B services, consulting, or SaaS.",
                    "Supply chain can't handle volume surges."
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <MinusIcon />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", lineHeight: 1.6, color: colors.darkGrey }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7: THE DIAGNOSTIC (Stage Clarity Check)
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        data-testid="diagnostic-section"
        className="relative"
        style={{ backgroundColor: colors.mistGrey, padding: "160px 0" }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-[600px] mx-auto text-center">
            
            <motion.p
              data-testid="diagnostic-eyebrow"
              className="uppercase tracking-wider mb-4"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: "14px", color: colors.profitGreen, letterSpacing: "0.04em" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE DIAGNOSTIC
            </motion.p>

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(36px, 4vw, 48px)", color: colors.jetBlack, lineHeight: 1.15, marginBottom: "20px" }}>
              <WordReveal text="Not sure if you're ready to scale?" />
            </h2>

            <RevealText delay={0.2}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "17px", lineHeight: 1.7, color: colors.darkGrey, marginBottom: "48px", maxWidth: "520px", margin: "0 auto 48px" }}>
                Scaling at the wrong stage wastes capital. Identify your exact bottleneck in 2 minutes.
              </p>
            </RevealText>

            <motion.button
              data-testid="find-your-stage-btn"
              className="px-8 py-4 rounded-full flex items-center gap-3 mx-auto border-2"
              style={{ 
                borderColor: colors.profitGreen, 
                color: colors.profitGreen,
                backgroundColor: 'transparent',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                fontSize: "14px"
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: colors.profitGreen,
                color: colors.jetBlack
              }}
              onClick={() => setShowStageClarityCheck(true)}
            >
              FIND YOUR STAGE
            </motion.button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 8: THE GATEWAY (Discovery Session)
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        data-testid="gateway-section"
        className="relative min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: colors.cinematicBlack, padding: "160px 0" }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-[700px] mx-auto">
            
            <motion.p
              data-testid="gateway-eyebrow"
              className="uppercase tracking-wider mb-8"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: "14px", color: colors.profitGreen, letterSpacing: "0.04em" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE NEXT STEP
            </motion.p>

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(40px, 5vw, 60px)", color: colors.pureWhite, lineHeight: 1.15, marginBottom: "24px" }}>
              <WordReveal text="Stop Guessing. Deploy Your Growth Engine." />
            </h2>

            <RevealText delay={0.4}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "17px", lineHeight: 1.7, color: colors.lightGrey, marginBottom: "48px", maxWidth: "560px", margin: "0 auto 48px" }}>
                Request a system discovery session. We'll review your store architecture and map a custom deployment plan.
              </p>
            </RevealText>

            <motion.button
              data-testid="discovery-session-btn"
              className="px-10 py-5 rounded-full flex items-center gap-3 mx-auto mb-10"
              style={{ 
                backgroundColor: colors.profitGreen, 
                color: colors.jetBlack,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                fontSize: "15px"
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              onClick={openChat}
            >
              REQUEST A DISCOVERY SESSION
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.p
              style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", fontSize: "14px", color: colors.lightGrey }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              We only deploy this system for a limited number of brands per quarter.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 9: SYSTEM FAQs
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        data-testid="faq-section"
        className="relative"
        style={{ backgroundColor: colors.galleryWhite, padding: "160px 0" }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-[800px] mx-auto">
            
            <div className="text-center mb-20">
              <motion.p
                data-testid="faq-eyebrow"
                className="uppercase tracking-wider mb-4"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: "14px", color: colors.profitGreen, letterSpacing: "0.04em" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                CLARITY & PARAMETERS
              </motion.p>

              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(36px, 4vw, 48px)", color: colors.jetBlack, lineHeight: 1.15 }}>
                <WordReveal text="System FAQs." />
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {[
                { 
                  q: "Do you actually manage our Meta and Google ads?", 
                  a: "Yes\u2014but only after data tracking, creative assets, and store optimization are in place." 
                },
                { 
                  q: "Do I need to migrate off my current platform?", 
                  a: "No. D2CBolt integrates seamlessly with Shopify and modern commerce stacks." 
                },
                { 
                  q: "Do I need to provide creative assets?", 
                  a: "No. We own the entire creative pipeline and produce all assets required to scale." 
                },
                { 
                  q: "How quickly will I see results?", 
                  a: "Cart recovery and AOV improvements are typically visible during the Store Conversion phase." 
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="border-b"
                  style={{ borderColor: colors.cardBorder }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    data-testid={`faq-question-${index}`}
                    className="w-full py-6 flex items-center justify-between text-left group"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <span 
                      style={{ 
                        fontFamily: "'Inter', sans-serif", 
                        fontWeight: 500, 
                        fontSize: "18px", 
                        color: openFAQ === index ? colors.profitGreen : colors.jetBlack,
                        transition: "color 0.2s"
                      }}
                      className="group-hover:text-[#00B359] pr-4"
                    >
                      {item.q}
                    </span>
                    <motion.div
                      animate={{ rotate: openFAQ === index ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Plus className="w-5 h-5 flex-shrink-0" style={{ color: colors.profitGreen }} />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.7, color: colors.graphite, paddingBottom: "24px" }}>
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: colors.cinematicBlack, padding: "60px 0" }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={founderplaneLogo} alt="FounderPlane" className="h-6 w-auto" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: colors.lightGrey }}>
                D2CBolt by FounderPlane
              </span>
            </Link>
            <div className="flex items-center gap-8">
              <Link to="/services/boltguider" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: colors.lightGrey }} className="hover:text-white transition-colors">
                BoltGuider
              </Link>
              <Link to="/services/brandtofly" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: colors.lightGrey }} className="hover:text-white transition-colors">
                BrandToFly
              </Link>
              <Link to="/" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: colors.lightGrey }} className="hover:text-white transition-colors">
                FounderPlane
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default D2CBolt;
