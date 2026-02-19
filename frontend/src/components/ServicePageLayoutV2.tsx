import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, type LucideIcon, ArrowRight, MessageCircle, Check, X, ChevronRight, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import founderplaneLogo from "@/assets/founderplane-logo-new.png";
import BrandedLeadForm from "@/components/BrandedLeadForm";

// V2 Type Definitions (from PDF Structure)
interface V2ProblemSection {
  intro: string;
  bullets: string[];
  closing: string;
}

interface V2PlatformFitSection {
  flow: string[];
  context: string[];
  closing: string;
}

interface V2ResponsibilitiesSection {
  intro: string;
  bullets: string[];
  closing: string;
}

interface V2ProcessStep {
  title: string;
  note?: string;
}

interface V2ProcessSection {
  steps: V2ProcessStep[];
  note: string;
}

interface V2OutcomesSection {
  bullets: string[];
  closing: string;
}

interface V2FitCheckSection {
  rightIf: string[];
  notRightIf: string[];
  fallback: string;
}

interface V2EngagementSection {
  bullets: string[];
  note: string;
}

interface V2FooterCTA {
  ctaText: string;
}

interface ServicePageV2Props {
  // Hero (Section 1)
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCTA: string;
  
  // Service visual config
  icon: LucideIcon;
  bgColor: string;
  iconBg: string;
  iconColor: string;
  
  // Section 2: The Problem This Stage Creates
  problemSection: V2ProblemSection;
  
  // Section 3: Where This System Fits In
  platformFitSection: V2PlatformFitSection;
  
  // Section 4: What [System] Is Responsible For
  responsibilitiesSection: V2ResponsibilitiesSection;
  
  // Section 5: How This System Works
  processSection: V2ProcessSection;
  
  // Section 6: What Changes After This System
  outcomesSection: V2OutcomesSection;
  
  // Section 7: When This System Is (And Is Not) Used
  fitCheckSection: V2FitCheckSection;
  
  // Section 8: How We Engage
  engagementSection: V2EngagementSection;
  
  // Section 9: Next Step
  footerCTA: V2FooterCTA;
  
  // System name for display
  systemName: string;
  
  // Branded form config
  brandColor?: string;
  formEyebrow?: string;
  formHeadline?: string;
  formDescription?: string;
  formSubmitText?: string;
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

const ServicePageLayoutV2 = ({
  eyebrow,
  headline,
  subheadline,
  primaryCTA,
  icon: Icon,
  bgColor,
  iconBg,
  iconColor,
  problemSection,
  platformFitSection,
  responsibilitiesSection,
  processSection,
  outcomesSection,
  fitCheckSection,
  engagementSection,
  footerCTA,
  systemName,
  brandColor,
  formEyebrow,
  formHeadline,
  formDescription,
  formSubmitText,
}: ServicePageV2Props) => {
  const heroRef = useRef<HTMLElement>(null);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);

  const openLeadForm = () => setShowLeadModal(true);

  // Scroll to hero section on mount - multiple approaches for reliability
  useEffect(() => {
    // Method 1: Immediate scroll
    window.scrollTo(0, 0);
    
    // Method 2: Delayed scroll (for SPAs)
    const timer1 = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    
    // Method 3: After a short delay (for any animations)
    const timer2 = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 100);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setShowStickyNav(heroBottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Branded Lead Form */}
      <BrandedLeadForm 
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        brandName={systemName}
        brandColor={brandColor || '#1D1D1F'}
        brandIcon={Icon}
        eyebrowText={formEyebrow}
        headlineText={formHeadline}
        descriptionText={formDescription}
        submitText={formSubmitText}
        serviceName={systemName}
      />
      
      {/* Service Header - Fixed: Logo on Left, Service Details, CTA on Right */}
      <motion.nav 
        className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left - Service Badge */}
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className={`w-8 h-8 md:w-9 md:h-9 rounded-lg ${iconBg} flex items-center justify-center shadow-lg`}
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className={`w-4 h-4 md:w-5 md:h-5 ${iconColor}`} />
            </motion.div>
            <span className="text-white font-bold text-sm uppercase tracking-wider">{systemName}</span>
          </motion.div>
          
          {/* Right - "by FounderPlane" + Chat CTA */}
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
                <span className="text-slate-400 text-sm hidden sm:inline">by</span>
                <img
                  src={founderplaneLogo}
                  alt="FounderPlane"
                  width={28}
                  height={28}
                  loading="eager"
                  decoding="async"
                  className="h-7 w-7 md:h-8 md:w-8"
                />
                <span className="text-white font-semibold text-sm hidden sm:inline">FounderPlane</span>
              </Link>
            </motion.div>
            
            <div className="hidden sm:block w-px h-6 bg-slate-700" />
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="sm"
                className={`${bgColor} text-white font-semibold px-4 shadow-lg`}
                onClick={openLeadForm}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Chat With Us</span>
                <span className="sm:hidden">Chat</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* SECTION 1: Hero (System Positioning) */}
      <section id="hero" ref={heroRef} className={`py-20 md:py-28 ${bgColor} relative overflow-hidden`}>
        {/* Blueprint Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_100%/0.04)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_100%/0.04)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Eyebrow Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-white/90 text-sm font-semibold tracking-wider">{eyebrow}</span>
            </motion.div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              {headline}
            </h1>

            {/* Sub-headline */}
            <motion.p 
              className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {subheadline}
            </motion.p>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="bg-white text-slate-900 hover:bg-white/95 font-bold px-8 shadow-xl hover:shadow-2xl text-base transition-all"
                  onClick={() => scrollToSection('problem')}
                >
                  {primaryCTA}
                  <motion.div 
                    className="inline-block ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: The Problem This Stage Creates */}
      <section id="problem" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
              The Problem This Stage Creates
            </h2>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {problemSection.intro}
            </p>
            
            <motion.ul 
              className="space-y-4 mb-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {problemSection.bullets.map((bullet, index) => (
                <motion.li 
                  key={index}
                  variants={staggerItem}
                  whileHover={{ 
                    scale: 1.02, 
                    x: 8,
                    transition: { duration: 0.2 } 
                  }}
                  className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100 cursor-default transition-shadow hover:shadow-md"
                >
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"
                    whileHover={{ scale: 1.5 }}
                  />
                  <span className="text-slate-700">{bullet}</span>
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.p 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-lg text-slate-700 font-medium bg-slate-50 p-6 rounded-xl border border-slate-100"
            >
              {problemSection.closing}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: Where This System Fits In */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
              Where This System Fits In
            </h2>
            
            {/* Flow Diagram */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              {platformFitSection.flow.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <motion.span 
                    whileHover={{ 
                      scale: step === systemName ? 1.05 : 1.02,
                      y: -2
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm cursor-default transition-shadow ${
                      step === systemName 
                        ? `${bgColor} text-white shadow-lg hover:shadow-xl` 
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}>
                    {step}
                  </motion.span>
                  {index < platformFitSection.flow.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              ))}
            </div>
            
            {/* Context Bullets */}
            <motion.div 
              className="space-y-4 mb-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {platformFitSection.context.map((item, index) => (
                <motion.div 
                  key={index}
                  variants={staggerItem}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200"
                >
                  <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-sm font-bold ${iconColor}`}>{index + 1}</span>
                  </div>
                  <span className="text-slate-700">{item}</span>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.p 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center text-lg text-slate-600 italic"
            >
              {platformFitSection.closing}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: What [System] Is Responsible For */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
              What {systemName} Is Responsible For
            </h2>
            
            <p className="text-lg text-slate-600 mb-8 text-center">
              {responsibilitiesSection.intro}
            </p>
            
            <motion.ul 
              className="space-y-4 mb-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {responsibilitiesSection.bullets.map((bullet, index) => (
                <motion.li 
                  key={index}
                  variants={staggerItem}
                  whileHover={{ 
                    scale: 1.02,
                    x: 4,
                    transition: { duration: 0.2 }
                  }}
                  className={`flex items-start gap-4 p-4 bg-white rounded-xl border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-default`}
                  style={{ borderLeftColor: `var(--${iconColor.replace('text-', '')})` }}
                >
                  <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.3 }}>
                    <Check className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
                  </motion.div>
                  <span className="text-slate-700 font-medium">{bullet}</span>
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.p 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center text-slate-600 italic"
            >
              {responsibilitiesSection.closing}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: How This System Works */}
      <section className="py-20 md:py-28 bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              How This System Works
            </h2>
            
            <motion.div 
              className="grid md:grid-cols-2 gap-6 mb-10"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {processSection.steps.map((step, index) => (
                <motion.div 
                  key={index}
                  variants={staggerItem}
                  whileHover={{ 
                    scale: 1.03,
                    y: -4,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                >
                  <motion.div 
                    className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center mb-4`}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.3 }
                    }}
                  >
                    <span className={`text-lg font-bold ${iconColor}`}>{index + 1}</span>
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  {step.note && (
                    <p className="text-white/60 text-sm">{step.note}</p>
                  )}
                </motion.div>
              ))}
            </motion.div>
            
            <motion.p 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center text-white/70 italic text-lg"
            >
              {processSection.note}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6: What Changes After This System */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
              What Changes After This System
            </h2>
            
            <motion.ul 
              className="space-y-4 mb-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {outcomesSection.bullets.map((bullet, index) => (
                <motion.li 
                  key={index}
                  variants={staggerItem}
                  className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100"
                >
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{bullet}</span>
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.p 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center text-lg text-slate-700 font-medium bg-slate-50 p-6 rounded-xl"
            >
              {outcomesSection.closing}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 7: When This System Is (And Is Not) Used */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
              When This System Is (And Is Not) Used
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Right If */}
              <motion.div
                variants={staggerItem}
                className="bg-emerald-50 rounded-2xl p-8 border-2 border-emerald-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Right for you if...</h3>
                </div>
                <ul className="space-y-4">
                  {fitCheckSection.rightIf.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Not Right If */}
              <motion.div
                variants={staggerItem}
                className="bg-slate-100 rounded-2xl p-8 border-2 border-slate-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center">
                    <X className="w-6 h-6 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Not right if...</h3>
                </div>
                <ul className="space-y-4">
                  {fitCheckSection.notRightIf.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
            
            <motion.p 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center text-slate-600 italic bg-white p-4 rounded-xl border border-slate-200"
            >
              {fitCheckSection.fallback}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 8: How We Engage */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
              How We Engage
            </h2>
            
            <motion.ul 
              className="space-y-4 mb-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {engagementSection.bullets.map((bullet, index) => (
                <motion.li 
                  key={index}
                  variants={staggerItem}
                  className={`flex items-start gap-4 p-4 rounded-xl border-l-4 bg-slate-50`}
                  style={{ borderLeftColor: `var(--${iconColor.replace('text-', '')})` }}
                >
                  <Shield className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
                  <span className="text-slate-700">{bullet}</span>
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.p 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center text-slate-600 italic"
            >
              {engagementSection.note}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 9: Next Step (Platform CTA) */}
      <section className={`py-20 md:py-28 ${bgColor} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_100%/0.04)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_100%/0.04)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Next Step
            </h2>
            
            <Link to="/#stage-diagnosis">
              <Button 
                size="lg" 
                className="bg-white text-slate-900 hover:bg-white/95 font-bold px-8 shadow-xl text-base"
              >
                {footerCTA.ctaText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={founderplaneLogo}
                alt="FounderPlane"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-white font-semibold">FounderPlane</span>
            </Link>
            
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} FounderPlane. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default ServicePageLayoutV2;
