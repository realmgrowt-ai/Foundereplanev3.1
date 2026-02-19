import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Palette, MessageCircle, ArrowRight, Plus, RefreshCw, Megaphone, Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";
import founderplaneLogo from "@/assets/founderplane-logo-new.png";
import BrandedLeadForm from "@/components/BrandedLeadForm";

// Design Tokens - BrandToFly Identity
const colors = {
  electricPurple: "#7000FF",
  galleryWhite: "#FFFFFF",
  mistGrey: "#F5F5F7",
  jetBlack: "#1D1D1F",
  cinematicBlack: "#0A0A0B",
  graphite: "#424245",
  lightGrey: "#86868B",
  cardBorder: "#E5E5E5",
};

// ═══════════════════════════════════════════════════════════════════
// MICRO-UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════

// Blueprint Grid Background with Slow Pan Animation
const BlueprintGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Static base grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(240, 240, 240, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(240, 240, 240, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Animated panning grid layer */}
      <motion.div
        className="absolute w-full"
        style={{
          height: '200%',
          top: '-100%',
          backgroundImage: `
            linear-gradient(to right, rgba(240, 240, 240, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(240, 240, 240, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        animate={{
          y: ['0%', '50%'],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

// Pulsing Micro-UI Bullet with Sequential Scale Animation
type BulletVariant = 'dot' | 'square';

const AnimatedBullet = ({ delay = 0, color = colors.electricPurple, variant = 'dot' }: { delay?: number; color?: string; variant?: BulletVariant }) => {
  const isSquare = variant === 'square';
  
  return (
    <div className="relative w-2 h-2 mr-3 mt-2 flex-shrink-0">
      <motion.div
        className={`w-full h-full ${isSquare ? 'rounded-none' : 'rounded-full'}`}
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
        className={`absolute inset-0 ${isSquare ? 'rounded-none' : 'rounded-full'}`}
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

// Cinematic Staggered Text Reveal (Line by Line with Slide-Up)
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

// Cinematic Word by Word Headline Reveal with Scroll Trigger
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

// Magnetic Spotlight Card with Cursor-Following Radial Gradient
const SpotlightCard = ({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // Use requestAnimationFrame for 60fps performance
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
        transform: 'translateZ(0)', // GPU acceleration
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Magnetic Spotlight Effect - Purple Glow Following Cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(
            500px circle at ${mousePos.x}px ${mousePos.y}px, 
            rgba(112, 0, 255, 0.08), 
            rgba(112, 0, 255, 0.03) 40%,
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
            inset 0 0 0 1px rgba(112, 0, 255, 0.15),
            inset 0 0 30px rgba(112, 0, 255, 0.03)
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
            rgba(112, 0, 255, 0.1),
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

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

const BrandToFly = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [showLeadModal, setShowLeadModal] = useState(false);
  
  // Refs for scroll animations
  const villainRef = useRef<HTMLDivElement>(null);

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

  const openLeadForm = () => setShowLeadModal(true);

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Branded Lead Form - Electric Purple */}
      <BrandedLeadForm 
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        brandName="BrandToFly"
        brandColor="#7000FF"
        brandIcon={Palette}
        eyebrowText="Brand Clarity Session"
        headlineText="Let's align your brand."
        descriptionText="Tell us about your business and we'll design a clarity plan for your positioning and presence."
        submitText="Request BrandToFly Session"
        serviceName="BrandToFly"
      />
      
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
              style={{ backgroundColor: colors.electricPurple }}
            >
              <Palette className="w-5 h-5 text-white" />
            </motion.div>
            <span 
              className="font-semibold text-lg"
              style={{ 
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: colors.jetBlack
              }}
            >
              BrandToFly
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
                  backgroundColor: colors.electricPurple,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px"
                }}
                onClick={openLeadForm}
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
          + Blueprint Grid Background with Slow Upward Pan Animation
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="hero" 
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ 
          backgroundColor: colors.galleryWhite,
          paddingTop: "180px",
          paddingBottom: "80px"
        }}
      >
        {/* Blueprint Grid Background with Slow Upward Pan */}
        <BlueprintGrid />
        
        {/* Subtle Animated Pulse Overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(112, 0, 255, 0.02) 0%, transparent 70%)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Eyebrow */}
            <motion.p
              className="mb-8 uppercase tracking-widest"
              style={{ 
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                fontSize: "14px",
                letterSpacing: "0.04em",
                color: colors.electricPurple
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              FOUNDERPLANE BRAND & POSITIONING SYSTEM
            </motion.p>

            {/* Headline - Word by Word Reveal */}
            <h1 className="mb-6" style={{ lineHeight: 1.1 }}>
              <WordReveal 
                text="Make Your Business Clear, Credible, and Instantly Understandable."
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

            {/* Sub-headline */}
            <motion.p
              className="mx-auto mb-10"
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
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              BrandToFly aligns your positioning, messaging, and presence so the market understands what you do without confusion, dilution, or noise.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <motion.button
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-white"
                style={{ 
                  backgroundColor: colors.electricPurple,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 500,
                  fontSize: "14px",
                  boxShadow: "0 4px 20px rgba(112, 0, 255, 0.3)"
                }}
                whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(112, 0, 255, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
              >
                UNDERSTAND THE SYSTEM
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.button>
            </motion.div>

            {/* Supporting Line */}
            <motion.p
              className="mt-5"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                color: colors.lightGrey
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
            >
              Built for founders who already know what they're building—and are ready to be understood.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: THE VILLAIN
          + Magnetic Spotlight Cards
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        ref={villainRef}
        id="problem"
        className="relative min-h-[200vh]"
        style={{ backgroundColor: colors.mistGrey, padding: "120px 0" }}
      >
        <div className="sticky top-0 min-h-screen flex items-center">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-5 gap-12 items-start">
              {/* Left Side - Sticky Diagnosis */}
              <div className="md:col-span-2">
                <motion.p
                  className="uppercase tracking-widest mb-4"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.lightGrey, letterSpacing: "0.04em" }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  THE DIAGNOSIS
                </motion.p>
                
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(40px, 5vw, 64px)", letterSpacing: "-0.02em", color: colors.jetBlack, lineHeight: 1.1 }}>
                  <WordReveal text="When the Market Doesn't Understand You, Everything Slows Down." delay={0.1} />
                </h2>
                
                <motion.p 
                  className="mt-6" 
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", lineHeight: 1.6, color: colors.graphite, maxWidth: "400px" }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  At this stage, the problem isn't effort and it isn't execution. It's that what you understand internally isn't landing externally. Your product may be solid. Your thinking may be clear. But the market still hesitates.
                </motion.p>
              </div>

              {/* Right Side - Spotlight Cards */}
              <div className="md:col-span-3 space-y-6">
                {[
                  { 
                    icon: RefreshCw, 
                    title: "The Translation Gap.", 
                    body: "People ask you to explain what you do—repeatedly. Your website feels \"okay\" but doesn't convert or clarify." 
                  },
                  { 
                    icon: Megaphone, 
                    title: "Interchangeable Messaging.", 
                    body: "Your messaging sounds generic. Because of this, trust is harder to build and sales conversations take much longer than they should." 
                  },
                  { 
                    icon: Anchor, 
                    title: "Fragile Momentum.", 
                    body: "Growth feels heavier than expected. Trying to grow on top of this foundation only amplifies the confusion." 
                  }
                ].map((card, index) => (
                  <SpotlightCard
                    key={index}
                    className="p-8 rounded-2xl border"
                    style={{ 
                      backgroundColor: `rgba(255,255,255,${activeCard === index ? 0.98 : 0.7})`,
                      borderColor: activeCard === index ? colors.electricPurple + '30' : colors.cardBorder,
                      boxShadow: activeCard === index ? "0 20px 40px rgba(0,0,0,0.05)" : "0 10px 20px rgba(0,0,0,0.02)",
                      opacity: activeCard === index ? 1 : 0.5,
                      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.electricPurple}10` }}>
                      <card.icon className="w-6 h-6" style={{ color: colors.electricPurple }} />
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
        className="relative min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.cinematicBlack }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.p
              className="uppercase tracking-widest mb-8"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.electricPurple, letterSpacing: "0.04em" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              THE TRUTH
            </motion.p>
            
            <motion.blockquote
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontStyle: "italic", fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.4, color: colors.galleryWhite }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              "Design without psychology is just decoration. You don't need a prettier logo. You need a visual architecture that builds subconscious trust."
            </motion.blockquote>
            
            <motion.p
              className="mt-10"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", color: "#A1A1A6" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              We replace amateur assumptions with performance-driven precision.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: THE FILTER
          + Animated Micro-Bullets
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: colors.galleryWhite, padding: "120px 0" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <motion.p
              className="uppercase tracking-widest mb-4 text-center"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.lightGrey, letterSpacing: "0.04em" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              SYSTEM REQUIREMENTS
            </motion.p>

            <h2 className="text-center mb-10" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(36px, 5vw, 48px)", letterSpacing: "-0.02em", color: colors.jetBlack }}>
              <WordReveal text="This System Works Best When..." />
            </h2>

            <div className="space-y-4 mb-10">
              {[
                "Your core direction is already decided.",
                "You know what you're building—but the market doesn't yet.",
                "Confusion is costing you trust, not effort.",
                "You're preparing for visibility, sales, or growth."
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                >
                  <AnimatedBullet delay={index * 0.12} variant="square" />
                  <RevealText delay={index * 0.12 + 0.1}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", lineHeight: 1.8, color: colors.graphite }}>
                      {item}
                    </span>
                  </RevealText>
                </motion.div>
              ))}
            </div>

            <motion.p
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.6, color: colors.lightGrey }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              If you're still exploring ideas, validating direction, or deciding what to build, this system will feel premature. BrandToFly is designed for businesses ready to be understood, not discovered.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: THE OWNERSHIP
          + Animated Micro-Bullets
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: colors.galleryWhite, padding: "120px 0", borderTop: `1px solid ${colors.cardBorder}` }}>
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <motion.p
              className="uppercase tracking-widest mb-4 text-center"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.electricPurple, letterSpacing: "0.04em" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE OWNERSHIP
            </motion.p>

            <h2 className="text-center mb-8" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(36px, 5vw, 48px)", letterSpacing: "-0.02em", color: colors.jetBlack }}>
              <WordReveal text="What BrandToFly Takes Responsibility For" />
            </h2>

            <motion.p
              className="mb-8"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", lineHeight: 1.6, color: colors.graphite }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              BrandToFly takes ownership of how your business is perceived—internally and externally. It ensures that what you understand about your business is translated clearly, consistently, and credibly to the market.
            </motion.p>

            <div className="space-y-3 mb-10">
              {[
                "Defining clear market positioning",
                "Aligning messaging across all touchpoints",
                "Creating a coherent brand narrative",
                "Ensuring your website explains your business effortlessly",
                "Removing ambiguity from how you present yourself"
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimatedBullet delay={index * 0.1} variant="dot" />
                  <RevealText delay={index * 0.1 + 0.05}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: colors.jetBlack }}>
                      {item}
                    </span>
                  </RevealText>
                </motion.div>
              ))}
            </div>

            <motion.p
              className="mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "18px", color: colors.graphite }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              BrandToFly does not take responsibility for growth, demand, or scale. It creates the foundation those efforts rely on.
            </motion.p>

            <motion.p
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: colors.lightGrey }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              When this responsibility is handled properly, conversations become easier, trust builds faster, and momentum stops feeling fragile. This is the role BrandToFly exists to play.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: THE ARCHITECTURE
          + Spotlight Step Cards
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: colors.mistGrey, padding: "120px 0" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.p
              className="uppercase tracking-widest mb-4 text-center"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.electricPurple, letterSpacing: "0.04em" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE ARCHITECTURE
            </motion.p>

            <h2 className="text-center mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(36px, 5vw, 48px)", letterSpacing: "-0.02em", color: colors.jetBlack }}>
              <WordReveal text="A Structured Approach Without Creative Chaos." />
            </h2>

            <motion.p
              className="text-center mb-16 mx-auto"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", lineHeight: 1.6, color: colors.graphite, maxWidth: "600px" }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              BrandToFly follows a clear, deliberate sequence to ensure clarity compounds at every step. Each phase builds on the previous one without rushing, guessing, or over-producing.
            </motion.p>

            {/* Spotlight Step Blocks */}
            <div className="space-y-4">
              {[
                { num: "01", title: "Positioning & Context Alignment", desc: "We align on how your business should be understood in the market—clearly and precisely." },
                { num: "02", title: "Messaging & Narrative Definition", desc: "We define language that explains your value without dilution or jargon." },
                { num: "03", title: "Brand System Architecture", desc: "We structure how this clarity shows up visually and verbally, consistently." },
                { num: "04", title: "Website & Presence Alignment", desc: "We ensure your primary touchpoints communicate your business effortlessly." }
              ].map((step, index) => (
                <SpotlightCard
                  key={index}
                  className="p-6 rounded-lg bg-white border"
                  style={{ borderColor: colors.cardBorder }}
                >
                  <motion.div 
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <motion.span 
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "16px", color: colors.electricPurple }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15, type: "spring", stiffness: 300 }}
                    >
                      {step.num}
                    </motion.span>
                    <div>
                      <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "20px", color: colors.jetBlack, marginBottom: "4px" }}>{step.title}</h3>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: colors.graphite }}>{step.desc}</p>
                    </div>
                  </motion.div>
                </SpotlightCard>
              ))}
            </div>

            <motion.p
              className="text-center mt-16"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "18px", color: colors.jetBlack }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              Nothing here is accidental. The goal is not to make things louder—it's to make them clearer.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6: THE AFTER-STATE
          + Animated Micro-Bullets
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: colors.galleryWhite, padding: "120px 0" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <motion.p
              className="uppercase tracking-widest mb-4 text-center"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.electricPurple, letterSpacing: "0.04em" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE OUTCOMES
            </motion.p>

            <h2 className="text-center mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(36px, 5vw, 48px)", letterSpacing: "-0.02em", color: colors.jetBlack }}>
              <WordReveal text="What Becomes Easier After BrandToFly" />
            </h2>

            <motion.p
              className="mb-8"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", lineHeight: 1.6, color: colors.graphite }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Once clarity is installed externally, friction starts to drop. Not because you're doing more but because people finally understand you.
            </motion.p>

            <div className="space-y-3 mb-10">
              {[
                "People understand what you do faster.",
                "Your website explains your business clearly.",
                "Messaging feels consistent across touchpoints.",
                "Sales conversations become simpler.",
                "Trust builds without constant explanation."
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                >
                  <AnimatedBullet delay={index * 0.12} variant="square" />
                  <RevealText delay={index * 0.12 + 0.05}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: colors.jetBlack }}>
                      {item}
                    </span>
                  </RevealText>
                </motion.div>
              ))}
            </div>

            <motion.p
              className="mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", lineHeight: 1.6, color: colors.jetBlack }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              BrandToFly doesn't change what you do. It changes how clearly that value is perceived.
            </motion.p>

            <motion.p
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: colors.lightGrey }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              With clarity in place, growth, marketing, and scale stop fighting the foundation. They finally have something solid to build on.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7: THE SELF-QUALIFICATION
          + Animated Micro-Bullets
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: colors.mistGrey, padding: "120px 0" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.p
              className="uppercase tracking-widest mb-4 text-center"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.electricPurple, letterSpacing: "0.04em" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE QUALIFIER
            </motion.p>

            <h2 className="text-center mb-16" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(36px, 5vw, 48px)", letterSpacing: "-0.02em", color: colors.jetBlack }}>
              <WordReveal text="When BrandToFly Is and Isn't the Right Move" />
            </h2>

            {/* Two Column Layout */}
            <motion.div
              className="grid md:grid-cols-2 gap-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {/* Left - Right Fit */}
              <div>
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "20px", color: colors.jetBlack, marginBottom: "20px" }}>
                  This system is right for you if...
                </h3>
                <div className="space-y-3">
                  {[
                    "You already know what you're building.",
                    "Your direction is decided, but the market doesn't fully understand it.",
                    "Your website or messaging feels unclear or generic.",
                    "You're preparing for visibility, sales, or growth.",
                    "Confusion is slowing momentum more than execution."
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AnimatedBullet delay={index * 0.1} variant="dot" />
                      <RevealText delay={index * 0.1 + 0.05}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.8, color: colors.graphite }}>
                          {item}
                        </span>
                      </RevealText>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right - Wrong Fit */}
              <div>
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "20px", color: colors.jetBlack, marginBottom: "20px" }}>
                  This system is not right for you if...
                </h3>
                <div className="space-y-3">
                  {[
                    "You're still exploring ideas or directions.",
                    "You're validating whether the business should exist.",
                    "You're unsure what problem you're solving.",
                    "You need internal clarity before external expression."
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AnimatedBullet delay={index * 0.1} color={colors.lightGrey} variant="square" />
                      <RevealText delay={index * 0.1 + 0.05}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.8, color: colors.graphite }}>
                          {item}
                        </span>
                      </RevealText>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.p
              className="text-center mt-16"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: colors.lightGrey }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              In those situations, clarity should come before branding.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 8: NEXT STEPS
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: colors.galleryWhite, padding: "120px 0" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.p
              className="uppercase tracking-widest mb-4 text-center"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.electricPurple, letterSpacing: "0.04em" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE NEXT STEP
            </motion.p>

            <h2 className="text-center mb-8" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(36px, 5vw, 48px)", letterSpacing: "-0.02em", color: colors.jetBlack }}>
              <WordReveal text="What Happens Next Is Your Choice" />
            </h2>

            <motion.p
              className="text-center mb-12 mx-auto"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", lineHeight: 1.6, color: colors.graphite, maxWidth: "600px" }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              If BrandToFly feels aligned with where you are right now, the next step is a guided engagement focused on installing clarity across your brand and presence. If it doesn't, that's okay too.
            </motion.p>

            {/* Option Blocks */}
            <div className="space-y-6">
              {[
                { title: "EXPLORE BRANDTOFLY", body: "If your direction is decided and the problem you're feeling matches this page, BrandToFly is designed to help you move forward with clarity and confidence.", cta: "Explore BrandToFly engagement", action: "chat" },
                { title: "START WITH CLARITY", body: "If you're still unsure whether your direction is fully locked, starting with clarity first prevents expensive misalignment later.", cta: "Start with clarity", link: "/services/boltguider" },
                { title: "EXPLORE OTHER SYSTEMS", body: "If you're further along and this problem is already solved, you may be better served by other FounderPlane systems.", cta: "Explore FounderPlane systems", link: "/#ecosystem" }
              ].map((option, index) => (
                <motion.div
                  key={index}
                  className="py-6 border-b"
                  style={{ borderColor: colors.cardBorder }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: "14px", color: colors.lightGrey, marginBottom: "8px" }}>
                    {option.title}
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: colors.jetBlack, marginBottom: "12px" }}>
                    {option.body}
                  </p>
                  {option.action === "chat" ? (
                    <motion.button
                      className="inline-flex items-center gap-1"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "16px", color: colors.electricPurple }}
                      whileHover={{ x: 4 }}
                      onClick={openLeadForm}
                    >
                      → {option.cta}
                    </motion.button>
                  ) : (
                    <Link to={option.link!}>
                      <motion.span
                        className="inline-flex items-center gap-1"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "16px", color: colors.electricPurple }}
                        whileHover={{ x: 4 }}
                      >
                        → {option.cta}
                      </motion.span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.p
              className="text-center mt-16"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: colors.lightGrey }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              There's no rush here. The right system only works when it matches the right stage.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 9: THE FAQS
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: colors.mistGrey, padding: "120px 0" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.p
              className="uppercase tracking-widest mb-4 text-center"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.electricPurple, letterSpacing: "0.04em" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE DETAILS
            </motion.p>

            <h2 className="text-center mb-16" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "clamp(36px, 5vw, 48px)", letterSpacing: "-0.02em", color: colors.jetBlack }}>
              <WordReveal text="Common Questions" />
            </h2>

            {/* Accordion */}
            <div>
              {[
                { q: "Is BrandToFly a branding or design service?", a: "BrandToFly is a system, not a creative service. It focuses on clarity, positioning, and alignment first—with design and presence supporting that clarity, not leading it." },
                { q: "Do you design logos or visual identities?", a: "BrandToFly may involve visual alignment, but it does not exist to \"do design work.\" Its role is to ensure that how your business is presented matches what it actually stands for." },
                { q: "Do I need to complete clarity work before this?", a: "Yes. BrandToFly assumes your core direction is already decided. Without that, branding efforts often amplify confusion instead of resolving it." },
                { q: "How long does BrandToFly typically take?", a: "BrandToFly is not timeline-driven. It moves at the pace required to establish clarity and consistency properly without rushing or overproducing." },
                { q: "What happens after BrandToFly is complete?", a: "Once clarity and presence are aligned, businesses are better positioned for growth, marketing, and scale—using the appropriate systems for their stage." }
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
                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "18px", color: colors.jetBlack }}>
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Plus className="w-5 h-5" style={{ color: colors.electricPurple }} />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === index ? "auto" : 0, opacity: openFaq === index ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.6, color: colors.graphite }}>
                      {faq.a}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          GLOBAL FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <footer className="py-12 bg-white border-t" style={{ borderColor: colors.cardBorder }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={founderplaneLogo} alt="FounderPlane" className="h-8 w-8" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "14px", color: colors.jetBlack }}>
                FounderPlane
              </span>
            </Link>

            <div className="flex items-center gap-6" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
              <Link to="/" className="transition-colors hover:text-purple-600" style={{ color: colors.lightGrey }}>MANIFESTO</Link>
              <Link to="/#ecosystem" className="transition-colors hover:text-purple-600" style={{ color: colors.lightGrey }}>BLUEPRINTS</Link>
              <button onClick={openLeadForm} className="transition-colors hover:text-purple-600" style={{ color: colors.lightGrey }}>CONTACT</button>
            </div>

            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: colors.lightGrey }}>
              © 2026 FOUNDERPLANE INC. • PRIVACY • TERMS
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default BrandToFly;
