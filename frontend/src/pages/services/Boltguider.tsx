import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Compass, MessageCircle, ArrowRight, Check, X, Plus, Zap, Activity, Wallet, GitBranch, Search, Server, Flag, FileText, BarChart3, Ticket, CheckSquare, Signpost, Calendar, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import StageClarityCheck from "@/components/StageClarityCheck";
import BrandedLeadForm from "@/components/BrandedLeadForm";
import founderplaneLogo from "@/assets/founderplane-logo-new.png";
import ScrollTracker from "@/components/ScrollTracker";

const BOLTGUIDER_SECTIONS = [
  { id: 'boltguider-hero', name: 'Hero' },
  { id: 'boltguider-villain', name: 'Villain' },
  { id: 'boltguider-truth', name: 'Truth' },
  { id: 'boltguider-machine', name: 'Machine' },
  { id: 'boltguider-kit', name: 'Kit' },
  { id: 'boltguider-filter', name: 'Filter' },
  { id: 'boltguider-choice', name: 'Choice' },
  { id: 'boltguider-diagnostic', name: 'Diagnostic' },
  { id: 'boltguider-faq', name: 'FAQ' },
  { id: 'boltguider-gateway', name: 'Gateway' },
];

// Design Tokens
const colors = {
  signalBlue: "#0055FF",
  galleryWhite: "#FFFFFF",
  mistGrey: "#F5F5F7",
  jetBlack: "#1D1D1F",
  graphite: "#424245",
  lightGrey: "#86868B",
  cardBorder: "#E5E5E5",
};

// ═══════════════════════════════════════════════════════════════════
// PREMIUM MOTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════

// Isometric Blueprint Grid with Slow Pan Animation
const BlueprintGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Static base grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 85, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 85, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Animated panning grid layer */}
      <motion.div
        className="absolute w-full"
        style={{
          height: '200%',
          top: '-100%',
          backgroundImage: `
            linear-gradient(to right, rgba(0, 85, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 85, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        animate={{
          y: ['0%', '50%'],
        }}
        transition={{
          duration: 80,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {/* Diagonal accent lines */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49.5%, rgba(0, 85, 255, 0.015) 49.5%, rgba(0, 85, 255, 0.015) 50.5%, transparent 50.5%)
          `,
          backgroundSize: '96px 96px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '96px 96px'],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

// Pulsing Micro-UI Bullet
type BulletVariant = 'dot' | 'square';

const AnimatedBullet = ({ delay = 0, color = colors.signalBlue, variant = 'dot' }: { delay?: number; color?: string; variant?: BulletVariant }) => {
  const isSquare = variant === 'square';
  
  return (
    <div className="relative w-2 h-2 mr-3 mt-1.5 flex-shrink-0">
      <motion.div
        className={`w-full h-full ${isSquare ? 'rounded-sm' : 'rounded-full'}`}
        style={{ backgroundColor: color }}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ 
          delay, 
          type: "spring", 
          stiffness: 400, 
          damping: 15 
        }}
      />
      {/* Pulsing ring effect */}
      <motion.div
        className={`absolute inset-0 ${isSquare ? 'rounded-sm' : 'rounded-full'}`}
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay + 0.5,
        }}
      />
    </div>
  );
};

// Cinematic Staggered Text Reveal
const RevealText = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        delay, 
        duration: 0.7, 
        ease: [0.16, 1, 0.3, 1] 
      }}
    >
      {children}
    </motion.span>
  );
};

// Cinematic Word by Word Headline Reveal
const WordReveal = ({ text, className, style, delay = 0 }: { text: string; className?: string; style?: React.CSSProperties; delay?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const words = text.split(' ');
  
  return (
    <span ref={ref} className={className} style={style}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-[0.25em] overflow-hidden"
          style={{ display: 'inline-block' }}
        >
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 40, rotateX: -45 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ 
              delay: delay + index * 0.06, 
              duration: 0.6, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            style={{ 
              transformOrigin: 'bottom',
              display: 'inline-block'
            }}
          >
            {word}
          </motion.span>
        </motion.span>
      ))}
    </span>
  );
};

// Magnetic Spotlight Card
const SpotlightCard = ({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    requestAnimationFrame(() => {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        ...style,
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Magnetic Spotlight Effect - Signal Blue Glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(
            500px circle at ${mousePos.x}px ${mousePos.y}px, 
            rgba(0, 85, 255, 0.08), 
            rgba(0, 85, 255, 0.03) 40%,
            transparent 70%
          )`,
        }}
      />
      {/* Subtle inner border glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-all duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          boxShadow: `
            inset 0 0 0 1px rgba(0, 85, 255, 0.15),
            inset 0 0 30px rgba(0, 85, 255, 0.03)
          `,
        }}
      />
      {/* Outer glow effect */}
      <div
        className="pointer-events-none absolute -inset-1 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(
            300px circle at ${mousePos.x}px ${mousePos.y}px,
            rgba(0, 85, 255, 0.1),
            transparent 60%
          )`,
          filter: 'blur(20px)',
          zIndex: -1,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const Boltguider = () => {
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState(0);
  
  // Refs for scroll animations
  const villainRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress: villainProgress } = useScroll({
    target: villainRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: machineProgress } = useScroll({
    target: machineRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(machineProgress, [0.2, 0.8], ["0%", "100%"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update active card based on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (villainRef.current) {
        const rect = villainRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
        setActiveCard(Math.min(2, Math.floor(progress * 3)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <main className="min-h-screen bg-white overflow-x-hidden">
        <ScrollTracker page="Boltguider" sections={BOLTGUIDER_SECTIONS} />
        {/* ═══════════════════════════════════════════════════════════════════
            HEADER - Minimal, Fixed
        ═══════════════════════════════════════════════════════════════════ */}
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
                style={{ backgroundColor: colors.signalBlue }}
              >
                <Compass className="w-5 h-5 text-white" />
              </motion.div>
              {/* Brand in Playfair Display per spec */}
              <span 
                className="font-semibold text-lg"
                style={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: colors.jetBlack
                }}
              >
                BoltGuider
              </span>
            </motion.div>
            
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-70">
                <span className="text-sm hidden sm:inline" style={{ color: colors.lightGrey }}>by</span>
                <img src={founderplaneLogo} alt="FounderPlane" className="h-7 w-7" />
                <span className="font-medium text-sm hidden sm:inline" style={{ color: colors.jetBlack }}>
                  FounderPlane
                </span>
              </Link>
              
              <div className="hidden sm:block w-px h-5 bg-slate-200" />
              
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="sm"
                  className="font-medium px-4 shadow-md hover:shadow-lg"
                  style={{ 
                    backgroundColor: colors.signalBlue,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px"
                  }}
                  onClick={() => setShowLeadForm(true)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  CHAT
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.nav>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: THE HERO
            Theme: "The Laboratory of Clarity" + Blueprint Grid
        ═══════════════════════════════════════════════════════════════════ */}
        <section 
          id="hero"
          data-testid="boltguider-hero"
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
          style={{ 
            backgroundColor: colors.galleryWhite,
            paddingTop: "180px",
            paddingBottom: "80px"
          }}
        >
          {/* Blueprint Grid Background */}
          <BlueprintGrid />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              
              <motion.p
                className="mb-8 uppercase tracking-widest"
                style={{ 
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: colors.signalBlue
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                THE END OF GUESSWORK
              </motion.p>

              <h1 className="mb-6" style={{ lineHeight: 1.1 }}>
                <WordReveal 
                  text="Stop Guessing. Start Building."
                  delay={0.5}
                  style={{ 
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    fontSize: "clamp(48px, 8vw, 80px)",
                    letterSpacing: "-0.02em",
                    color: colors.jetBlack,
                    display: "inline"
                  }}
                />
              </h1>

              <motion.p
                className="mx-auto mb-12"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "clamp(18px, 2vw, 20px)",
                  lineHeight: 1.6,
                  maxWidth: "600px",
                  color: colors.graphite
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                Most founders fail because they shoot in the dark. We turn your chaotic idea into a custom 90-Day Execution Roadmap. Built for you. In 2 sessions.
              </motion.p>

              {/* Floating Book */}
              <motion.div
                className="relative mx-auto mb-12"
                style={{ maxWidth: "320px" }}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div 
                  className="absolute inset-0 rounded-2xl blur-3xl opacity-15"
                  style={{ backgroundColor: colors.jetBlack, transform: "translateY(20px) scale(0.9)" }}
                />
                
                <motion.div
                  className="relative rounded-xl p-6 border bg-white"
                  style={{ borderColor: colors.cardBorder, boxShadow: "0 30px 60px rgba(0,0,0,0.12)" }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="aspect-[3/4] rounded-lg flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-slate-50 border border-slate-100">
                    <motion.div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${colors.signalBlue}10` }}
                      animate={{ rotate: [0, 5, 0, -5, 0] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Compass className="w-7 h-7" style={{ color: colors.signalBlue }} />
                    </motion.div>
                    
                    <p className="text-center uppercase tracking-widest mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: colors.lightGrey }}>
                      THE FOUNDER COMPASS
                    </p>
                    <h3 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "16px", color: colors.signalBlue, letterSpacing: "-0.02em" }}>
                      THE ROADMAP
                    </h3>
                    <div className="w-10 h-0.5 mt-3 rounded-full" style={{ backgroundColor: colors.signalBlue }} />
                  </div>
                </motion.div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <motion.button
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-white"
                  style={{ 
                    backgroundColor: colors.signalBlue,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 500,
                    fontSize: "14px",
                    boxShadow: "0 4px 20px rgba(0, 85, 255, 0.3)"
                  }}
                  whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0, 85, 255, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLeadForm(true)}
                >
                  GET YOUR ROADMAP
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              <motion.p
                className="mt-6 uppercase tracking-widest"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: colors.lightGrey }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                LIMITED • FEBRUARY COHORT OPEN
              </motion.p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2: THE VILLAIN
            Layout: Sticky Split-Screen + Magnetic Spotlight Cards
        ═══════════════════════════════════════════════════════════════════ */}
        <section 
          ref={villainRef}
          data-testid="boltguider-villain"
          className="relative min-h-[200vh]"
          style={{ backgroundColor: colors.mistGrey, padding: "120px 0" }}
        >
          <div className="sticky top-0 min-h-screen flex items-center">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-5 gap-12 items-start">
                {/* Left Side - Sticky */}
                <div className="md:col-span-2">
                  <motion.p
                    className="uppercase tracking-widest mb-4"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.lightGrey }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    THE SILENT KILLER
                  </motion.p>
                  
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(48px, 6vw, 64px)", letterSpacing: "-0.02em", color: colors.jetBlack, lineHeight: 1.1 }}>
                    <WordReveal text="Analysis Paralysis." delay={0.1} />
                  </h2>
                  
                  <motion.p 
                    className="mt-6" 
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", lineHeight: 1.6, color: colors.graphite, maxWidth: "400px" }}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    You have the vision. But you are trapped in a cycle of noise, conflicting advice, and fear. You aren't building a business. You are just thinking about it.
                  </motion.p>
                </div>

                {/* Right Side - Spotlight Cards */}
                <div className="md:col-span-3 space-y-6">
                  {[
                    { 
                      icon: Activity, 
                      title: "Information Overload.", 
                      body: "You've consumed 100 hours of podcasts. But every new \"tactic\" contradicts the last. You are drowning in data, starving for direction." 
                    },
                    { 
                      icon: Wallet, 
                      title: "The Burn Rate.", 
                      body: "You are terrified of spending money on the wrong thing. So you spend nothing. And build nothing. You are protecting a business that doesn't exist yet." 
                    },
                    { 
                      icon: GitBranch, 
                      title: "Shooting in the Dark.", 
                      body: "You have ideas, but no coherent plan. You are building on a shaky foundation. One wrong move, and it collapses." 
                    }
                  ].map((card, index) => (
                    <SpotlightCard
                      key={index}
                      className="p-8 rounded-2xl border"
                      style={{ 
                        backgroundColor: `rgba(255,255,255,${activeCard === index ? 0.98 : 0.7})`,
                        borderColor: activeCard === index ? colors.signalBlue + '30' : colors.cardBorder,
                        boxShadow: activeCard === index ? "0 20px 40px rgba(0,0,0,0.08)" : "0 10px 20px rgba(0,0,0,0.03)",
                        opacity: activeCard === index ? 1 : 0.5,
                        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                      }}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.signalBlue}10` }}>
                        <card.icon className="w-6 h-6" style={{ color: colors.signalBlue }} />
                      </div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "24px", color: colors.jetBlack, marginBottom: "12px" }}>
                        {card.title}
                      </h3>
                      <RevealText delay={index * 0.1}>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.6, color: colors.graphite }}>
                          {card.body}
                        </p>
                      </RevealText>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2.5: THE TRUTH
            Cinematic Dark Section
        ═══════════════════════════════════════════════════════════════════ */}
        <section 
          data-testid="boltguider-truth"
          className="relative py-24 md:py-32"
          style={{ backgroundColor: colors.jetBlack }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.p
                className="uppercase tracking-widest mb-8"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.signalBlue }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                OUR PHILOSOPHY
              </motion.p>
              
              <motion.blockquote
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: "clamp(24px, 4vw, 40px)", lineHeight: 1.4, color: colors.galleryWhite }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                "Hustle is a lie.<br />
                You don't need more motivation. You need a map.<br />
                Building a startup isn't about working 18 hours a day. It's about making 3 correct decisions in a row.<br />
                <span style={{ color: colors.signalBlue }}>We replace the noise with a plan.</span>"
              </motion.blockquote>
              
              <motion.p
                className="mt-8 italic"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: colors.lightGrey }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                — The FounderPlane Team
              </motion.p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3: THE MACHINE
            Vertical Timeline with Liquid Fill + Cinematic Text
        ═══════════════════════════════════════════════════════════════════ */}
        <section 
          ref={machineRef}
          data-testid="boltguider-machine"
          className="relative"
          style={{ backgroundColor: colors.galleryWhite, padding: "160px 0" }}
        >
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-20">
              <motion.p 
                className="uppercase tracking-widest mb-4" 
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.signalBlue }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                THE SYSTEM ARCHITECTURE
              </motion.p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(40px, 5vw, 56px)", letterSpacing: "-0.02em", color: colors.jetBlack }}>
                <WordReveal text="From Chaos to Compass. In 3 Steps." />
              </h2>
            </div>

            {/* Timeline */}
            <div className="relative max-w-4xl mx-auto">
              {/* Center Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 hidden md:block" style={{ backgroundColor: colors.cardBorder }}>
                <motion.div 
                  className="w-full origin-top"
                  style={{ backgroundColor: colors.signalBlue, height: lineHeight }}
                />
              </div>

              {/* Steps */}
              {[
                { tag: "SESSION 01 • 60 MINS", title: "Deep-Dive Discovery.", body: "We don't guess. We listen. Your Certified Founder's Guide dissects your business model, identifies the single biggest bottleneck, and diagnoses the root cause of your paralysis.", icon: Search, align: "left" },
                { tag: "INTERNAL R&D • 3 DAYS", title: "The \"Black Box\" Build.", body: "While you sleep, our team goes to work. We analyze your market, scout your competitors, and engineer your custom 90-Day Execution Roadmap behind the scenes.", icon: Server, align: "right" },
                { tag: "SESSION 02 • 60 MINS", title: "The Roadmap Handoff.", body: "You return to see the solution. We present your Founder Compass Blueprint, walk you through the 3 phases of execution, and hand you the keys to build.", icon: Flag, align: "left" }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className={`relative flex items-center mb-20 last:mb-0 ${step.align === 'right' ? 'md:flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, x: step.align === 'left' ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  {/* Content */}
                  <div className={`flex-1 ${step.align === 'right' ? 'md:pl-16 md:text-right' : 'md:pr-16'}`}>
                    <p className="uppercase tracking-wider mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: colors.lightGrey }}>
                      {step.tag}
                    </p>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "28px", color: colors.jetBlack, marginBottom: "12px" }}>
                      {step.title}
                    </h3>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.7, color: colors.graphite }}>
                      {step.body}
                    </p>
                  </div>

                  {/* Node */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-2 flex items-center justify-center hidden md:flex" style={{ borderColor: colors.signalBlue }}>
                    <step.icon className="w-5 h-5" style={{ color: colors.signalBlue }} />
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 4: THE KIT
            Bento Grid Layout + Magnetic Spotlight Cards
        ═══════════════════════════════════════════════════════════════════ */}
        <section data-testid="boltguider-kit" style={{ backgroundColor: "#F5F7FA", padding: "120px 0" }}>
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16">
              <motion.p 
                className="uppercase tracking-widest mb-4" 
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.signalBlue }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                THE EXECUTION STACK
              </motion.p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(40px, 5vw, 56px)", letterSpacing: "-0.02em", color: colors.jetBlack }}>
                <WordReveal text="Everything You Need. Nothing You Don't." />
              </h2>
              <motion.p 
                className="mt-4 mx-auto" 
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: colors.graphite, maxWidth: "600px" }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                We don't give you "homework." We give you assets. Every item in this kit is engineered to save you time.
              </motion.p>
            </div>

            {/* Bento Grid with Spotlight Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { title: "The Founder Compass.", subtitle: "Your custom 90-Day Execution Roadmap.", tag: "CORE ASSET", icon: FileText, featured: true, span: "lg:col-span-2 lg:row-span-2" },
                { title: "Market Recon Report.", subtitle: "Data-driven analysis of your competitors and growth trends.", icon: BarChart3 },
                { title: "Ascent Credit.", subtitle: "A ₹5,000 credit for your next stage of growth.", icon: Ticket },
                { title: "\"First 7 Days\" Checklist.", subtitle: "The exact steps to take on Monday morning.", icon: CheckSquare },
                { title: "Smart Routing.", subtitle: "Expert direction on your specific ecosystem path.", icon: Signpost },
                { title: "30-Day Accountability.", subtitle: "We verify your progress.", icon: Calendar }
              ].map((card, index) => (
                <SpotlightCard
                  key={index}
                  className={`p-6 rounded-3xl bg-white ${card.span || ''}`}
                  style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}
                >
                  {card.tag && (
                    <motion.span 
                      className="inline-block px-3 py-1 rounded-full text-white text-xs mb-4" 
                      style={{ backgroundColor: colors.signalBlue, fontFamily: "'JetBrains Mono', monospace" }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    >
                      {card.tag}
                    </motion.span>
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.featured ? 'mb-6' : 'mb-4'}`} style={{ backgroundColor: `${colors.signalBlue}10` }}>
                    <card.icon className="w-6 h-6" style={{ color: colors.signalBlue }} />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: card.featured ? "28px" : "20px", color: colors.jetBlack, marginBottom: "8px" }}>
                    {card.title}
                  </h3>
                  <RevealText delay={index * 0.05}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: card.featured ? "16px" : "14px", color: colors.graphite }}>
                      {card.subtitle}
                    </p>
                  </RevealText>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 5: THE FILTER
            Two-Column Comparison + Pulsing Micro-Bullets
        ═══════════════════════════════════════════════════════════════════ */}
        <section data-testid="boltguider-filter" style={{ backgroundColor: colors.mistGrey, padding: "120px 0" }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.p 
                className="uppercase tracking-widest mb-4" 
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.signalBlue }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                THE CRITERIA
              </motion.p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(36px, 5vw, 48px)", letterSpacing: "-0.02em", color: colors.jetBlack }}>
                <WordReveal text="Who is BoltGuider For?" />
              </h2>
              <motion.p 
                className="mt-4" 
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: colors.graphite }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                We are not a course. We are a build shop. We only work with founders ready to execute.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* The Builder - Full opacity */}
              <SpotlightCard
                className="p-8 rounded-2xl bg-white border-2"
                style={{ borderColor: colors.signalBlue }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <motion.div 
                    className="w-10 h-10 rounded-full flex items-center justify-center" 
                    style={{ backgroundColor: `${colors.signalBlue}15` }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Check className="w-5 h-5" style={{ color: colors.signalBlue }} />
                  </motion.div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "24px", color: colors.jetBlack }}>
                    The Builder.
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "You have a specific idea, but need a plan.",
                    "You are ready to spend 3-5 hours/week building.",
                    "You want brutally honest feedback, not cheerleading.",
                    "You are willing to launch in 90 days."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start" style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: colors.jetBlack }}>
                      <AnimatedBullet delay={i * 0.1} variant="dot" />
                      <RevealText delay={i * 0.1 + 0.05}>
                        <span>{item}</span>
                      </RevealText>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>

              {/* The Tourist - Faded */}
              <motion.div
                className="p-8 rounded-2xl bg-white/60 border"
                style={{ borderColor: colors.cardBorder }}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 0.7, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100">
                    <X className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "24px", color: colors.graphite }}>
                    The Tourist.
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "You are looking for \"Passive Income.\"",
                    "You want someone else to build it for you.",
                    "You are not ready to invest in your own growth.",
                    "You are just \"exploring\" with no intent to launch."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start" style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: colors.graphite }}>
                      <AnimatedBullet delay={i * 0.1} color={colors.lightGrey} variant="square" />
                      <RevealText delay={i * 0.1 + 0.05}>
                        <span>{item}</span>
                      </RevealText>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 6: THE CHOICE
            Pricing Cards + Magnetic Spotlight
        ═══════════════════════════════════════════════════════════════════ */}
        <section data-testid="boltguider-choice" style={{ backgroundColor: colors.galleryWhite, padding: "140px 0" }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.p 
                className="uppercase tracking-widest mb-4" 
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.lightGrey }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                THE INVESTMENT
              </motion.p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(48px, 6vw, 64px)", letterSpacing: "-0.02em", color: colors.jetBlack }}>
                <WordReveal text="Choose Your Pace." />
              </h2>
              <motion.p 
                className="mt-4" 
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: colors.graphite }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Two ways to enter the ecosystem. Both lead to a roadmap. One gets you there faster.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
              {/* Standard Card - The Decoy */}
              <SpotlightCard
                className="p-8 rounded-2xl border bg-white"
                style={{ borderColor: colors.jetBlack }}
              >
                <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.lightGrey, marginBottom: "8px" }}>
                  CONSULTING ONLY
                </h3>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "48px", fontWeight: 600, color: colors.jetBlack }}>
                  ₹7,500
                </p>
                <p className="mt-2 mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: colors.graphite }}>
                  For founders who just want the strategy calls without the full kit.
                </p>
                <ul className="space-y-3 mb-8">
                  {["2x Strategy Sessions (60 Mins)", "90-Day Execution Roadmap", "Standard Email Support"].map((item, i) => (
                    <li key={i} className="flex items-center" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: colors.graphite }}>
                      <AnimatedBullet delay={i * 0.08} color={colors.graphite} variant="square" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full font-medium" style={{ borderColor: colors.jetBlack, color: colors.jetBlack }}>
                  BOOK STANDARD
                </Button>
              </SpotlightCard>

              {/* Accelerator Card - The Hero */}
              <SpotlightCard
                className="p-8 rounded-2xl bg-white relative"
                style={{ 
                  border: `2px solid ${colors.signalBlue}`,
                  transform: "scale(1.05)",
                  boxShadow: "0 20px 60px rgba(0, 85, 255, 0.15)"
                }}
              >
                {/* Badge */}
                <motion.div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs" 
                  style={{ backgroundColor: colors.signalBlue, fontFamily: "'JetBrains Mono', monospace" }}
                  initial={{ y: -20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                >
                  MOST POPULAR • FEB COHORT
                </motion.div>
                
                <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.signalBlue, marginBottom: "8px", marginTop: "8px" }}>
                  THE IGNITION KIT
                </h3>
                <div className="flex items-baseline gap-3">
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "48px", fontWeight: 600, color: colors.jetBlack }}>
                    ₹5,000
                  </p>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "18px", color: colors.lightGrey, textDecoration: "line-through" }}>
                    ₹12,500
                  </p>
                </div>
                <p className="mt-2 mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: colors.graphite }}>
                  The complete "System" for decisive founders.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Everything in Standard",
                    "+ Industry & Competitor Report (₹50k Value)",
                    "+ ₹5,000 Ascent Credit (Cash Back)",
                    "+ Priority WhatsApp Support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: colors.jetBlack }}>
                      <AnimatedBullet delay={i * 0.1} variant="dot" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  className="w-full py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2"
                  style={{ backgroundColor: colors.signalBlue, fontFamily: "'JetBrains Mono', monospace" }}
                  whileHover={{ backgroundColor: "#002FA7" }}
                  onClick={() => setShowLeadForm(true)}
                >
                  JOIN ACCELERATOR
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <p className="mt-3 text-center" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: colors.lightGrey }}>
                  Risk-Free. Quality Pledge Included.
                </p>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 7: THE DIAGNOSTIC
            Stage Clarity Check Trigger - Architectural Clarity
        ═══════════════════════════════════════════════════════════════════ */}
        <section 
          data-testid="boltguider-diagnostic"
          className="relative"
          style={{ backgroundColor: "#F5F7FA", padding: "100px 0" }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              {/* Eyebrow */}
              <motion.p
                className="uppercase tracking-widest mb-4"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.signalBlue }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                THE DIAGNOSTIC
              </motion.p>

              {/* Headline */}
              <motion.h2
                style={{ 
                  fontFamily: "'Playfair Display', serif", 
                  fontWeight: 600, 
                  fontSize: "clamp(36px, 5vw, 48px)", 
                  letterSpacing: "-0.02em", 
                  color: colors.jetBlack,
                  marginBottom: "16px"
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Not sure if you're ready?
              </motion.h2>

              {/* Sub-headline - Increased bottom margin for breathing room */}
              <motion.p
                style={{ 
                  fontFamily: "'Inter', sans-serif", 
                  fontSize: "18px", 
                  lineHeight: 1.6, 
                  color: colors.graphite,
                  marginBottom: "48px"
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Building at the wrong stage is the fastest way to waste capital. Identify your exact bottleneck in 2 minutes with our Stage Clarity Check.
              </motion.p>

              {/* CTA Button - Hollow Pill */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium border-2 transition-colors"
                  style={{ 
                    borderColor: colors.signalBlue,
                    color: colors.signalBlue,
                    backgroundColor: "transparent",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 500,
                    fontSize: "14px"
                  }}
                  whileHover={{ 
                    backgroundColor: "#E6EFFF"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDiagnosticOpen(true)}
                >
                  FIND YOUR STAGE
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              {/* Architectural Watermark - BELOW the button */}
              {/* Single thin line connecting 3 small circular nodes */}
              <motion.div
                className="mt-16 flex items-center justify-center"
                style={{ opacity: 0.12 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.12 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                {/* Node 1: Launch */}
                <div className="flex flex-col items-center">
                  <div 
                    className="w-8 h-8 rounded-full border flex items-center justify-center"
                    style={{ borderColor: colors.signalBlue }}
                  >
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: colors.signalBlue }}>1</span>
                  </div>
                  <span className="mt-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: colors.signalBlue }}>LAUNCH</span>
                </div>

                {/* Connecting Line */}
                <div className="w-16 md:w-24 h-px mx-2" style={{ backgroundColor: colors.signalBlue }} />

                {/* Node 2: Growth */}
                <div className="flex flex-col items-center">
                  <div 
                    className="w-8 h-8 rounded-full border flex items-center justify-center"
                    style={{ borderColor: colors.signalBlue }}
                  >
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: colors.signalBlue }}>2</span>
                  </div>
                  <span className="mt-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: colors.signalBlue }}>GROWTH</span>
                </div>

                {/* Connecting Line */}
                <div className="w-16 md:w-24 h-px mx-2" style={{ backgroundColor: colors.signalBlue }} />

                {/* Node 3: Scale */}
                <div className="flex flex-col items-center">
                  <div 
                    className="w-8 h-8 rounded-full border flex items-center justify-center"
                    style={{ borderColor: colors.signalBlue }}
                  >
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: colors.signalBlue }}>3</span>
                  </div>
                  <span className="mt-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: colors.signalBlue }}>SCALE</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 8: THE FAQ
            Minimalist Accordion
        ═══════════════════════════════════════════════════════════════════ */}
        <section data-testid="boltguider-faq" style={{ backgroundColor: colors.galleryWhite, padding: "120px 0" }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.lightGrey }}>
                COMMON QUESTIONS
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(36px, 5vw, 48px)", letterSpacing: "-0.02em", color: colors.jetBlack }}>
                Everything You Need to Know.
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              {[
                { q: "\"I have a full-time job. Can I still do this?\"", a: "Yes. The 90-Day Roadmap is engineered for \"Architects\" who build on the side. We structure your \"Foundation Phase\" to require only 3-5 focused hours per week. We don't ask you to quit; we ask you to focus." },
                { q: "\"Do you build the tech/website for me?\"", a: "No. We are your Architects, not your contractors. We give you the Blueprint, the Strategy, and the Routing. We tell you what to build and how to build it, but you must execute. If you need builders, you can use your Ascent Credit with our vetted partners." },
                { q: "\"What happens after the 90 days?\"", a: "You graduate. Most founders move into our FounderPlane Flight Deck (community) or hire us for specific sprints (Growth, Ops). But the goal of BoltGuider is to make you independent, not dependent." },
                { q: "\"Why is there no refund policy?\"", a: "Because this is a high-touch, live service. We invest significant hours into your Industry Report and Strategy Sessions before we even finish. We commit our time to you, and we ask you to commit your resolve to us." },
                { q: "\"I have no idea what I want to build yet. Is this for me?\"", a: "No. BoltGuider is for founders who have an idea (even a rough one) but are stuck on execution. If you are still searching for an idea, join our free newsletter first. Come back when you have a spark." }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="border-b"
                  style={{ borderColor: colors.cardBorder }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full py-6 flex items-center justify-between text-left group"
                  >
                    <span 
                      className="font-medium transition-colors"
                      style={{ 
                        fontFamily: "'Inter', sans-serif", 
                        fontSize: "18px", 
                        color: openFaq === index ? colors.signalBlue : colors.jetBlack 
                      }}
                    >
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Plus className="w-5 h-5" style={{ color: colors.signalBlue }} />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === index ? "auto" : 0, opacity: openFaq === index ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.7, color: colors.graphite }}>
                      {faq.a}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 9: THE STAMP
            Quality Pledge + Footer
        ═══════════════════════════════════════════════════════════════════ */}
        <section data-testid="boltguider-gateway" style={{ backgroundColor: colors.galleryWhite, padding: "120px 0 80px" }}>
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              {/* Shield Icon */}
              <motion.div
                className="w-16 h-16 rounded-full mx-auto mb-8 flex items-center justify-center"
                style={{ backgroundColor: `${colors.signalBlue}10` }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Shield className="w-8 h-8" style={{ color: colors.signalBlue }} />
              </motion.div>

              <motion.h2
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "48px", letterSpacing: "-0.02em", color: colors.jetBlack, marginBottom: "24px" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                The Quality Pledge.
              </motion.h2>

              <motion.p
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", lineHeight: 1.7, color: colors.graphite, marginBottom: "32px" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                We are builders, not gurus. We measure our success by your execution, not your applause. If we don't deliver a clear, actionable roadmap, we haven't done our job. You have our word.
              </motion.p>

              {/* Stamp Animation */}
              <motion.div
                className="relative inline-block"
                initial={{ scale: 2, opacity: 0, rotate: -15 }}
                whileInView={{ scale: 1, opacity: 0.2, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="w-32 h-32 rounded-full border-4 flex items-center justify-center" style={{ borderColor: colors.signalBlue }}>
                  <div className="text-center">
                    <Zap className="w-8 h-8 mx-auto" style={{ color: colors.signalBlue }} />
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: colors.signalBlue, marginTop: "4px" }}>
                      READY TO BUILD
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.p
                className="mt-8 italic"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: colors.signalBlue }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                "Build with conviction."
              </motion.p>
            </div>
          </div>

          {/* Footer Divider */}
          <div className="container mx-auto px-4">
            <div className="border-t my-12" style={{ borderColor: colors.cardBorder }} />
          </div>

          {/* Footer */}
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <Link to="/" className="flex items-center gap-3">
                <img src={founderplaneLogo} alt="FounderPlane" className="h-8 w-8" />
                {/* Footer brand in Inter per spec */}
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "14px", color: colors.jetBlack }}>
                  FounderPlane
                </span>
              </Link>

              <div className="flex items-center gap-6" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
                <Link to="/" className="transition-colors hover:text-blue-600" style={{ color: colors.lightGrey }}>MANIFESTO</Link>
                <Link to="/#ecosystem" className="transition-colors hover:text-blue-600" style={{ color: colors.lightGrey }}>BLUEPRINTS</Link>
                <button onClick={() => setShowLeadForm(true)} className="transition-colors hover:text-blue-600" style={{ color: colors.lightGrey }}>CONTACT</button>
              </div>

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: colors.lightGrey }}>
                © 2026 FOUNDERPLANE INC. • PRIVACY • TERMS
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Stage Clarity Check Modal */}
      <StageClarityCheck 
        isOpen={isDiagnosticOpen} 
        onClose={() => setIsDiagnosticOpen(false)} 
      />
      
      {/* Branded Lead Form - Signal Blue */}
      <BrandedLeadForm
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        brandName="BoltGuider"
        brandColor="#0055FF"
        brandIcon={Compass}
        eyebrowText="Get Your Roadmap"
        headlineText="Let's build your 90-Day plan."
        descriptionText="Tell us about your idea and we'll map out a custom execution roadmap."
        submitText="Request BoltGuider Session"
        serviceName="BoltGuider"
      />
    </>
  );
};

export default Boltguider;
