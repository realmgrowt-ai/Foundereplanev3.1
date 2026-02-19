import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowLeft, type LucideIcon, Sparkles, ArrowRight, Wand2, Loader2, Clock, Users, Target, Zap, AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, Plus, Minus, X, MessageCircle, Star, Shield, Rocket, Check, Mail, MapPin, Quote, Award, ExternalLink, FileText, BarChart3, CheckSquare, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import founderplaneLogo from "@/assets/founderplane-logo-new.png";

// Type definitions
interface FlightDataItem {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface ErrorCard {
  title: string;
  description: string;
  emoji?: string;
  stat?: string;
}

interface ProblemSection {
  headline: string;
  subheadline?: string;
  description: string;
  errorCards: ErrorCard[];
  footer?: string;
}

interface RoadmapPhase {
  phase: string;
  title: string;
  subtitle: string;
  description: string;
  details?: string[];
}

interface Deliverable {
  title: string;
  description: string;
  worth?: string;
}

interface PricingTier {
  name: string;
  price: string;
  originalPrice?: string;
  priceNote?: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  isPopular?: boolean;
  ctaText: string;
}

interface AudienceTrack {
  icon: LucideIcon;
  title: string;
  forText: string;
  status: string;
  goal: string;
  weProvide: string;
}

interface ApplicationStep {
  step: string;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
  icon?: LucideIcon;
}

interface FooterCTA {
  headline: string;
  subheadline: string;
  buttonText: string;
  secondaryText?: string;
}

interface ServiceCatalogCategory {
  title: string;
  items: string[];
}

// NEW: Comparison Section (Old Way vs New Way)
interface ComparisonPoint {
  text: string;
  highlight?: string;
}

interface ComparisonSection {
  oldWay: {
    title: string;
    subtitle: string;
    points: ComparisonPoint[];
    result: string;
  };
  newWay: {
    title: string;
    subtitle: string;
    points: ComparisonPoint[];
    result: string;
  };
}

// NEW: Process Steps (How We Engineer...)
interface ProcessStep {
  title: string;
  subtitle: string;
  description: string;
}

interface ProcessSection {
  headline: string;
  subheadline: string;
  steps: ProcessStep[];
}

// NEW: Value Stack (Everything You Get)
interface ValueStackItem {
  title: string;
  description: string;
  worth?: string;
  isBonus?: boolean;
}

interface ValueStackSection {
  headline: string;
  subheadline: string;
  items: ValueStackItem[];
  totalValue?: string;
  yourPrice?: string;
  ctaText: string;
  ctaSubtext?: string;
}

// NEW: Bento Box Section
interface BentoItem {
  title: string;
  description: string;
  icon: LucideIcon;
  span?: 'normal' | 'wide' | 'tall';
}

// NEW: Outcomes Section (for BoltGuider)
interface OutcomesSection {
  headline: string;
  supportingLine: string;
  outcomes: { title: string; description: string }[];
  closingLine: string;
}

// NEW: Fit Check Section (for BoltGuider - two-column layout)
interface FitCheckSection {
  headline: string;
  forYouIf: string[];
  notForYouIf: string[];
  closingLine: string;
}

// NEW: Post-Engagement Section (for BoltGuider)
interface PostEngagementSection {
  headline: string;
  supportingLine: string;
  paths: { title: string; description: string }[];
  trustStatement: string;
}

// NEW: Deliverables Section (for BoltGuider - no pricing)
interface DeliverablesSection {
  headline: string;
  supportingLine: string;
  items: { title: string; description: string }[];
  callout: string;
}

// NEW: PDF 9-Section Structure Types
// Section 2: Who This Is For
interface AudienceSection {
  headline: string;
  designedFor: string[];
  notFor?: string;
}

// Section 3: Why This System Exists
interface WhySection {
  paragraphs: string[];
}

// Section 7: How We Work With You
interface WorkStyleSection {
  points: string[];
}

// Section 9: Platform Reassurance
interface PlatformReassurance {
  content: string;
}

interface ServicePageProps {
  name: string;
  badge: string;
  headline: string;
  subheadline?: string;
  heroDescription: string;
  primaryCTA: string;
  secondaryCTA?: string;
  icon: LucideIcon;
  bgColor: string;
  iconBg: string;
  iconColor: string;
  accentColor?: string;
  valueQuote?: string;
  heroStyle?: 'default' | 'minimal';
  trustMicroLine?: string;
  flightData: FlightDataItem[];
  problemSection: ProblemSection;
  comparisonSection?: ComparisonSection;
  processSection?: ProcessSection;
  roadmapPhases: RoadmapPhase[];
  deliverables?: { headline: string; items: Deliverable[] };
  valueStack?: ValueStackSection;
  serviceCatalog?: { headline: string; categories: ServiceCatalogCategory[] };
  pricingTiers?: PricingTier[];
  audienceTracks?: AudienceTrack[];
  applicationSteps: ApplicationStep[];
  faqItems: FAQItem[];
  footerCTA: FooterCTA;
  bentoItems?: BentoItem[];
  // New BoltGuider-specific sections
  outcomesSection?: OutcomesSection;
  fitCheckSection?: FitCheckSection;
  postEngagementSection?: PostEngagementSection;
  deliverablesSection?: DeliverablesSection;
  // Diagnostic callback for Stage Clarity Check
  onOpenDiagnostic?: () => void;
  // NEW: PDF 9-Section Structure Props
  audienceSection?: AudienceSection;
  whySection?: WhySection;
  workStyleSection?: WorkStyleSection;
  platformReassurance?: PlatformReassurance;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const staggerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" as const },
  }),
};

const assemblyVariants = {
  hidden: (direction: string) => {
    const directions: Record<string, { x: number; y: number }> = {
      left: { x: -60, y: 0 },
      right: { x: 60, y: 0 },
      top: { x: 0, y: -60 },
      bottom: { x: 0, y: 60 },
    };
    return { opacity: 0, ...directions[direction], scale: 0.95 };
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const popInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

// Animated counter component with enhanced animation
const AnimatedCounter = ({ value, label, icon: Icon, iconBg, iconColor }: { value: string; label: string; icon: LucideIcon; iconBg: string; iconColor: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");
  
  useEffect(() => {
    if (isInView) {
      const numMatch = value.match(/(\d+)/);
      if (numMatch) {
        const targetNum = parseInt(numMatch[1]);
        let current = 0;
        const step = Math.ceil(targetNum / 30);
        const interval = setInterval(() => {
          current += step;
          if (current >= targetNum) {
            current = targetNum;
            clearInterval(interval);
          }
          setDisplayValue(value.replace(/\d+/, current.toString()));
        }, 30);
        return () => clearInterval(interval);
      } else {
        setDisplayValue(value);
      }
    }
  }, [isInView, value]);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      className="flex items-center gap-4 justify-center"
    >
      <motion.div 
        className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-lg`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </motion.div>
      <div className="text-left">
        <p className="text-white/60 text-xs uppercase tracking-widest font-medium">{label}</p>
        <p className="text-white text-xl font-bold">{displayValue}</p>
      </div>
    </motion.div>
  );
};

// Typewriter component
const TypewriterText = ({ text, className }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (isInView && !isComplete) {
      let i = 0;
      const interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayText(text.slice(0, i));
          i++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, 35);
      return () => clearInterval(interval);
    }
  }, [isInView, text, isComplete]);
  
  return (
    <h1 ref={ref} className={className}>
      {displayText}
      {!isComplete && <span className="animate-pulse text-white/60">|</span>}
    </h1>
  );
};

// Wavy underline component
const WavyUnderline = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`wavy-underline ${className}`}>{children}</span>
);

// FAQ Icon selector
const getFaqIcon = (index: number) => {
  const icons = [MessageCircle, Star, Shield, Rocket, Target, Zap];
  return icons[index % icons.length];
};

// Social proof marquee items
const socialProofItems = [
  "500+ Founders Trusted",
  "90-Day Programs",
  "₹50L+ Revenue Generated",
  "4.9★ Client Rating",
  "100+ Success Stories",
  "Pan-India Clients",
];

const ServicePageLayout = ({
  name,
  badge,
  headline,
  subheadline,
  heroDescription,
  primaryCTA,
  secondaryCTA,
  icon: Icon,
  bgColor,
  iconBg,
  iconColor,
  accentColor,
  valueQuote,
  heroStyle = 'default',
  trustMicroLine,
  flightData,
  problemSection,
  comparisonSection,
  processSection,
  roadmapPhases,
  deliverables,
  valueStack,
  serviceCatalog,
  pricingTiers,
  audienceTracks,
  applicationSteps,
  faqItems,
  footerCTA,
  bentoItems,
  outcomesSection,
  fitCheckSection,
  postEngagementSection,
  deliverablesSection,
  onOpenDiagnostic,
  // NEW: PDF 9-Section Structure Props
  audienceSection,
  whySection,
  workStyleSection,
  platformReassurance,
}: ServicePageProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showStickyFooter, setShowStickyFooter] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Detect if this is a 9-section page (new sub-brand structure)
  const is9SectionPage = !!(audienceSection && whySection);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setShowStickyFooter(heroBottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inquiry Submitted!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleAiAssist = async () => {
    // Client-side validation
    const MAX_MESSAGE_LENGTH = 2000;
    
    if (formData.message && formData.message.length > MAX_MESSAGE_LENGTH) {
      toast({
        title: "Message too long",
        description: `Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`,
        variant: "destructive",
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('contact-assistant', {
        body: { 
          currentMessage: formData.message?.trim() || '',
          serviceName: name 
        }
      });

      if (error) throw error;

      if (data?.improvedMessage) {
        setFormData(prev => ({ ...prev, message: data.improvedMessage }));
        toast({
          title: "AI Suggestion Ready!",
          description: "Your message has been enhanced.",
        });
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('AI assist error:', error);
      toast({
        title: "AI Assist Unavailable",
        description: "Please try again or write your message manually.",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const stickyPrice = pricingTiers?.[1]?.price || pricingTiers?.[0]?.price;

  // Emoji icons for error cards
  const errorEmojis = ["😵", "😰", "💸", "🤯", "😤", "📉"];

  // Default value quote if not provided
  const displayQuote = valueQuote || `Stop guessing. Start building with confidence using ${name}.`;

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Announcement Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="announcement-gradient py-2.5 text-center relative z-50"
      >
        <div className="container mx-auto px-4 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-white/80" />
          <p className="text-white/90 text-sm font-medium">
            <span className="hidden sm:inline">🚀 </span>
            Limited Availability — Book Your {name} Strategy Call Today
          </p>
          <Sparkles className="w-4 h-4 text-white/80" />
        </div>
      </motion.div>

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
              animate={{ 
                y: [0, -2, 0],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Icon className={`w-4 h-4 md:w-5 md:h-5 ${iconColor}`} />
            </motion.div>
            <span className="text-white font-bold text-sm uppercase tracking-wider">{name}</span>
          </motion.div>
          
          {/* Right - "by FounderPlane" + Chat CTA */}
          <div className="flex items-center gap-4">
            {/* by FounderPlane */}
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
            
            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-slate-700" />
            
            {/* Chat CTA */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="sm"
                className={`${bgColor} text-white font-semibold px-4 shadow-lg`}
                onClick={() => (window as { Intercom?: (...args: unknown[]) => void }).Intercom?.('show')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Chat With Us</span>
                <span className="sm:hidden">Chat</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Supports minimal and default styles */}
      <section id="hero" ref={heroRef} className={`pt-16 pb-24 ${bgColor} relative overflow-hidden section-curve`}>
        {/* Blueprint Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_100%/0.04)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_100%/0.04)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Animated orbs - hidden in minimal mode */}
        {heroStyle !== 'minimal' && (
          <>
            <motion.div 
              className="absolute top-10 right-[10%] w-80 h-80 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-20 left-[5%] w-96 h-96 rounded-full bg-black/10 blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            
            {/* Sparkle particles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/30"
                style={{
                  top: `${15 + i * 18}%`,
                  right: `${8 + i * 12}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  y: [0, -15, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            ))}
          </>
        )}
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Minimal Hero - Centered, Clean */}
          {heroStyle === 'minimal' ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center max-w-4xl mx-auto py-12"
            >
              {/* Eyebrow Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-white/90 text-sm font-semibold tracking-wider">{badge}</span>
              </motion.div>
              
              {/* Clean Headline - No typewriter */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                {headline}
              </h1>

              <motion.p 
                className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {heroDescription}
              </motion.p>

              {/* CTAs - Clean */}
              <motion.div
                className="flex flex-wrap gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-slate-900 hover:bg-white/95 font-bold px-8 shadow-xl text-base"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {primaryCTA}
                </Button>
                {secondaryCTA && (
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-semibold px-8"
                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {secondaryCTA}
                  </Button>
                )}
              </motion.div>

              {/* Trust Micro Line - Optional */}
              {trustMicroLine && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 text-white/60 text-sm font-medium"
                >
                  {trustMicroLine}
                </motion.p>
              )}
            </motion.div>
          ) : (
            /* Default Hero - Two column with animations */
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
              {/* Left - Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-center lg:text-left"
              >
                {/* Badge */}
                <motion.div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm font-semibold tracking-wide">{badge}</span>
                </motion.div>
                
                {/* Typewriter Headline */}
                <TypewriterText 
                  text={headline}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
                />
                
                {subheadline && (
                  <motion.h2 
                    className="text-xl md:text-2xl font-medium text-white/85 mb-6 italic"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    "{subheadline}"
                  </motion.h2>
                )}

                <motion.p 
                  className="text-lg text-white/75 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  {heroDescription}
                </motion.p>

                {/* CTAs - Enhanced */}
                <motion.div
                  className="flex flex-wrap gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-white/30 blur-xl rounded-full" />
                    <Button 
                      size="lg" 
                      className="relative bg-white text-slate-900 hover:bg-white/95 font-bold px-8 shadow-2xl text-base"
                      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      {primaryCTA}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                  {secondaryCTA && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 backdrop-blur-sm"
                        onClick={() => document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        {secondaryCTA}
                      </Button>
                    </motion.div>
                  )}
                </motion.div>

                {/* Trust Badge - NEW */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="mt-8 flex items-center gap-3 justify-center lg:justify-start"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-xs font-bold text-white">
                        {["S", "R", "A", "P"][i-1]}
                      </div>
                    ))}
                  </div>
                  <p className="text-white/70 text-sm font-medium">
                    <span className="text-white font-bold">500+</span> founders trust us
                  </p>
                </motion.div>
              </motion.div>

              {/* Right - 3D Visual */}
              <motion.div
                className="hidden lg:flex items-center justify-center relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                {/* Blueprint wireframe */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-96 h-96 text-white/10" viewBox="0 0 200 200">
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      strokeDasharray="8 4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1, rotate: 360 }}
                      transition={{ duration: 4, ease: "easeInOut", rotate: { duration: 30, repeat: Infinity, ease: "linear" } }}
                    />
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="60"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      strokeDasharray="8 4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1, rotate: -360 }}
                      transition={{ duration: 3, delay: 0.3, ease: "easeInOut", rotate: { duration: 25, repeat: Infinity, ease: "linear" } }}
                    />
                    <motion.rect
                      x="45"
                      y="45"
                      width="110"
                      height="110"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      strokeDasharray="8 4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.6 }}
                    />
                  </svg>
                </div>
                
                {/* Floating 3D Icon */}
                <motion.div
                  className="relative z-10"
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-44 h-44 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl">
                    <Icon className="w-24 h-24 text-white" strokeWidth={1} />
                  </div>
                  
                  {/* Floating annotation */}
                  <motion.div
                    className="absolute -right-8 -top-4 bg-white rounded-lg px-3 py-1.5 shadow-xl"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <p className="text-xs font-bold text-slate-800">Validated ✓</p>
                  </motion.div>
                  
                  <motion.div
                    className="absolute -left-6 bottom-8 bg-white rounded-lg px-3 py-1.5 shadow-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.8 }}
                  >
                    <p className="text-xs font-bold text-slate-800">90-Day Plan</p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Social Proof Marquee - Hidden in minimal mode */}
      {heroStyle !== 'minimal' && (
        <section className="py-4 bg-slate-900 border-b border-slate-800 overflow-hidden">
          <div className="relative">
            {/* Gradient Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10" />
            
            {/* Marquee */}
            <div className="flex animate-marquee">
              {[...socialProofItems, ...socialProofItems].map((item, index) => (
                <div key={index} className="flex items-center gap-3 mx-8 whitespace-nowrap">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Strip - Hidden in minimal mode */}
      {heroStyle !== 'minimal' && (
        <motion.section 
          className="py-8 glass-stats relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
              {flightData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 200 }}
                  className="flex items-center gap-4 justify-center md:justify-start"
                >
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <item.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div className="text-left">
                    <p className="text-white/60 text-xs uppercase tracking-widest font-medium">{item.label}</p>
                    <p className="text-white text-lg md:text-xl font-bold">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* NEW: Section 2 - Who This Is For (Audience Section for 9-section structure) - ENHANCED */}
      {audienceSection && (
        <section className="py-24 bg-gradient-to-b from-white via-slate-50/30 to-white relative overflow-hidden">
          {/* Gradient accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${bgColor}`} />
          
          {/* Background decorative elements */}
          <motion.div 
            className="absolute -right-20 top-20 w-72 h-72 rounded-full blur-3xl opacity-30"
            style={{ background: `linear-gradient(135deg, ${accentColor || 'hsl(var(--primary))'}, transparent)` }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <motion.span 
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full ${iconBg} ${iconColor} text-sm font-bold mb-6`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Users className="w-4 h-4" />
                Who This Is For
              </motion.span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-10">
                {audienceSection.headline}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {audienceSection.designedFor.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                    whileHover={{ y: -4 }}
                  >
                    {/* Subtle gradient overlay on hover */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${bgColor.replace('bg-', 'bg-gradient-to-br from-').replace('to-', '/5 to-')}/5`} />
                    
                    <div className="relative z-10 flex items-start gap-4">
                      <motion.div 
                        className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Check className={`w-5 h-5 ${iconColor}`} />
                      </motion.div>
                      <p className="text-slate-700 text-lg leading-relaxed font-medium">{item}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {audienceSection.notFor && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-5 bg-gradient-to-r from-red-50 to-red-50/50 rounded-2xl border border-red-100/80 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <X className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    <span className="font-bold text-red-600">Not for:</span> {audienceSection.notFor}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* NEW: Section 3 - Why This System Exists (Why Section for 9-section structure) - ENHANCED DARK THEME */}
      {whySection && (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          {/* Animated background pattern */}
          <motion.div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(221_73%_49%/0.08)_1px,transparent_1px)] bg-[size:32px_32px]"
            animate={{ backgroundPosition: ["0px 0px", "32px 32px"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Glowing orbs */}
          <motion.div 
            className="absolute -left-20 top-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
            animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -right-20 bottom-1/4 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl"
            animate={{ opacity: [0.1, 0.25, 0.1], scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />
          
          {/* Decorative accent bar on left */}
          <div className={`absolute left-0 top-1/4 bottom-1/4 w-1.5 ${bgColor} hidden lg:block`} />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <motion.span 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-bold mb-6 border border-white/10"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Sparkles className="w-4 h-4" />
                Why This System Exists
              </motion.span>
              
              {/* Large decorative quote */}
              <motion.div 
                className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-5 hidden lg:block"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.05 }}
                viewport={{ once: true }}
              >
                <Quote className="w-32 h-32 text-white" />
              </motion.div>
              
              <div className="space-y-8">
                {whySection.paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className={`leading-relaxed ${
                      index === 0 
                        ? "text-2xl md:text-3xl text-white font-medium" 
                        : "text-xl text-slate-300"
                    }`}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Problem Section - Hidden for 9-section pages, Conditional styling for minimal mode */}
      {!is9SectionPage && (
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-graph-paper-light" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              className={`inline-block px-4 py-2 rounded-full ${heroStyle === 'minimal' ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-600'} text-sm font-semibold mb-4`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              {heroStyle === 'minimal' ? '💡 Sound Familiar?' : '⚠️ The Reality Check'}
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-3">
              {problemSection.headline}
            </h2>
            {problemSection.subheadline && (
              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                <WavyUnderline>{problemSection.subheadline}</WavyUnderline>
              </h3>
            )}
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              {problemSection.description}
            </p>
          </motion.div>

          {/* Bento Grid Layout - Conditional styling for minimal mode */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {problemSection.errorCards.map((card, index) => {
              const isLarge = heroStyle !== 'minimal' && index === 0;
              const statValues = ["87%", "72%", "91%", "68%", "83%", "79%"];
              return (
                <motion.div
                  key={index}
                  custom={index}
                  variants={staggerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`${heroStyle === 'minimal' ? 'bg-white border-slate-200' : 'warning-card-gradient border-orange-100/80'} rounded-2xl p-8 border shadow-lg group cursor-default relative overflow-hidden ${isLarge ? 'md:row-span-2' : ''}`}
                  whileHover={{ y: -8, boxShadow: heroStyle === 'minimal' ? "0 25px 50px -12px rgba(0, 0, 0, 0.1)" : "0 25px 50px -12px rgba(251, 146, 60, 0.2)" }}
                >
                  {/* Stat Badge - Hidden in minimal mode */}
                  {heroStyle !== 'minimal' && (
                    <motion.div 
                      className="absolute top-4 right-4 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {card.stat || `${statValues[index % statValues.length]} fail here`}
                    </motion.div>
                  )}
                  
                  {/* Emoji - Hidden in minimal mode */}
                  {heroStyle !== 'minimal' && (
                    <div className="mb-4">
                      <span className="emoji-icon text-4xl">{errorEmojis[index % errorEmojis.length]}</span>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{card.description}</p>
                  
                  {/* Animated arrow - Hidden in minimal mode */}
                  {heroStyle !== 'minimal' && (
                    <motion.div 
                      className="mt-4 text-orange-400"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {problemSection.footer && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12 text-xl font-semibold text-slate-800 max-w-3xl mx-auto"
            >
              {problemSection.footer}
            </motion.p>
          )}
        </div>
      </section>
      )}

      {/* Outcomes Section (BoltGuider specific) - After Problem, Before Quote - ENHANCED */}
      {outcomesSection && (
        <section className="py-24 bg-gradient-to-b from-white to-slate-50/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-graph-paper-light" />
          
          {/* Decorative elements */}
          <motion.div 
            className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.span 
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full ${iconBg} ${iconColor} text-sm font-bold mb-4`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Target className="w-4 h-4" />
                What We Help You Do
              </motion.span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
                {outcomesSection.headline}
              </h2>
              <p className="text-slate-600 max-w-3xl mx-auto text-lg">
                {outcomesSection.supportingLine}
              </p>
            </motion.div>

            {/* Enhanced 2-column grid layout */}
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
              {outcomesSection.outcomes.map((outcome, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group relative bg-white rounded-2xl p-6 border-l-4 shadow-sm hover:shadow-xl transition-all duration-300`}
                  style={{ borderLeftColor: accentColor || 'hsl(var(--primary))' }}
                  whileHover={{ y: -6 }}
                >
                  {/* Number badge */}
                  <motion.div 
                    className={`absolute -top-3 -right-3 w-8 h-8 rounded-full ${bgColor} flex items-center justify-center text-white text-sm font-bold shadow-lg`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  >
                    {index + 1}
                  </motion.div>
                  
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Check className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{outcome.title}</h3>
                      <p className="text-slate-600">{outcome.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced closing line callout */}
            {outcomesSection.closingLine && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-14 max-w-2xl mx-auto"
              >
                <div className={`relative p-6 rounded-2xl bg-gradient-to-r ${bgColor.replace('bg-', 'from-').replace(' ', ' to-')}/10 border border-primary/20`}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Sparkles className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <p className="text-center text-lg font-semibold text-slate-800">
                    {outcomesSection.closingLine}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Value Quote Section - Hidden in minimal mode */}
      {heroStyle !== 'minimal' && (
      <section className={`py-20 md:py-28 ${bgColor} relative overflow-hidden`}>
        {/* Dynamic mesh gradient background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_100%/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_100%/0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        {/* Large decorative quote marks with glow */}
        <motion.div 
          className="absolute left-[5%] md:left-[10%] top-1/2 -translate-y-1/2"
          animate={{ y: [-15, 15, -15], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Quote className="w-24 h-24 md:w-40 md:h-40 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]" />
        </motion.div>
        <motion.div 
          className="absolute right-[5%] md:right-[10%] top-1/2 -translate-y-1/2 rotate-180"
          animate={{ y: [15, -15, 15], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Quote className="w-24 h-24 md:w-40 md:h-40 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]" />
        </motion.div>

        {/* Floating sparkles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`quote-sparkle-${i}`}
            className="absolute text-white/20"
            style={{ left: `${20 + i * 30}%`, top: `${20 + i * 20}%` }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0.5, 1.2, 0.5],
              y: [0, -10, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        ))}
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Decorative line above */}
            <motion.div 
              className="w-16 h-1 bg-white/30 mx-auto mb-8 rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            
            <p className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-relaxed">
              <span className="bg-gradient-to-r from-white via-white/90 to-white bg-clip-text">
                "{displayQuote}"
              </span>
            </p>
            
            {/* Attribution line */}
            <motion.p 
              className="mt-6 text-white/60 text-sm font-medium uppercase tracking-widest"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              — The FounderPlane Philosophy
            </motion.p>
            
            {/* Decorative line below */}
            <motion.div 
              className="w-16 h-1 bg-white/30 mx-auto mt-8 rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </motion.div>
        </div>
      </section>
      )}

      {/* Comparison Section - ENHANCED with visual metaphors and premium styling */}
      {comparisonSection && (
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-graph-paper-light" />
          
          {/* Decorative gradient orbs */}
          <motion.div 
            className="absolute -left-32 top-1/4 w-64 h-64 bg-red-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -right-32 top-1/4 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.span 
                className="inline-block px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 text-sm font-bold mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                ⚔️ The Difference
              </motion.span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
                Choose Your <span className="text-primary">Path</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
              {/* The Old Way - with visual metaphor */}
              <motion.div
                initial={{ opacity: 0, x: -40, rotateY: 10 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative group"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-200/50 to-orange-200/50 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                
                <div className="bg-gradient-to-br from-white to-red-50/50 rounded-3xl p-8 md:p-10 border-2 border-red-200/80 shadow-xl relative overflow-hidden">
                  {/* Top accent bar with gradient */}
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-400 via-orange-400 to-red-400" />
                  
                  {/* Visual Metaphor - Maze/Confusion illustration */}
                  <div className="w-full h-36 bg-gradient-to-br from-slate-100 to-red-50 rounded-2xl mb-8 flex items-center justify-center border border-red-100 relative overflow-hidden">
                    {/* Scattered elements representing confusion */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center gap-4"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {/* Question marks scattered */}
                      <div className="absolute top-4 left-6 text-red-300/60 text-2xl font-bold rotate-12">?</div>
                      <div className="absolute top-8 right-12 text-red-300/60 text-xl font-bold -rotate-6">?</div>
                      <div className="absolute bottom-6 left-12 text-red-300/60 text-lg font-bold rotate-6">?</div>
                      <div className="absolute bottom-4 right-8 text-red-300/60 text-2xl font-bold -rotate-12">?</div>
                      
                      {/* Central confused icon */}
                      <div className="bg-white rounded-xl p-4 shadow-lg border border-red-200 relative z-10">
                        <AlertTriangle className="w-10 h-10 text-red-400" />
                      </div>
                    </motion.div>
                    
                    {/* Random lines representing scattered thoughts */}
                    <svg className="absolute inset-0 w-full h-full text-red-200/40" viewBox="0 0 200 100">
                      <motion.path
                        d="M20,50 Q50,20 80,50 T140,50 T200,50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                    {comparisonSection.oldWay.title}
                  </h3>
                  <p className="text-lg font-bold text-red-500 mb-8 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    {comparisonSection.oldWay.subtitle}
                  </p>
                  
                  <ul className="space-y-5 mb-8">
                    {comparisonSection.oldWay.points.map((point, idx) => (
                      <motion.li 
                        key={idx} 
                        className="flex items-start gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <X className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="text-slate-700 leading-relaxed">
                          {point.text}
                          {point.highlight && <strong className="text-red-600"> {point.highlight}</strong>}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <div className="pt-6 border-t-2 border-red-100 bg-red-50/50 -mx-8 md:-mx-10 -mb-8 md:-mb-10 px-8 md:px-10 py-6 rounded-b-3xl">
                    <p className="flex items-start gap-3 text-slate-800">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        <X className="w-5 h-5 text-red-500" />
                      </div>
                      <span className="text-lg"><strong className="text-red-600">Result:</strong> {comparisonSection.oldWay.result}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* The [SERVICE] Way - with visual metaphor */}
              <motion.div
                initial={{ opacity: 0, x: 40, rotateY: -10 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative group"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/50 to-teal-200/50 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                
                <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-3xl p-8 md:p-10 border-2 border-emerald-200/80 shadow-xl relative overflow-hidden">
                  {/* Top accent bar with gradient */}
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400" />
                  
                  {/* Visual Metaphor - Clear path/Blueprint illustration */}
                  <div className="w-full h-36 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl mb-8 flex items-center justify-center border border-emerald-100 relative overflow-hidden">
                    {/* Clear path visualization */}
                    <motion.div 
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      {/* Target/goal markers */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
                        {/* Clear direct path */}
                        <motion.path
                          d="M30,50 L170,50"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                        />
                        {/* Arrow head */}
                        <motion.path
                          d="M160,40 L175,50 L160,60"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.5 }}
                        />
                        {/* Milestone dots */}
                        <motion.circle cx="30" cy="50" r="6" fill="hsl(var(--primary))" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} />
                        <motion.circle cx="80" cy="50" r="4" fill="hsl(var(--primary))" opacity="0.6" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }} />
                        <motion.circle cx="130" cy="50" r="4" fill="hsl(var(--primary))" opacity="0.6" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.1 }} />
                      </svg>
                    </motion.div>
                    
                    {/* Service badge */}
                    <motion.div 
                      className={`absolute right-4 top-4 ${iconBg} rounded-lg px-3 py-1.5 shadow-md border border-white`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 }}
                    >
                      <span className={`text-sm font-bold ${iconColor}`}>{name}</span>
                    </motion.div>
                    
                    {/* Checkmark indicators */}
                    <div className="absolute left-4 top-4 flex gap-2">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.15 }}
                        >
                          <Check className="w-3 h-3 text-emerald-500" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                    {comparisonSection.newWay.title}
                  </h3>
                  <p className="text-lg font-bold text-emerald-500 mb-8 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    {comparisonSection.newWay.subtitle}
                  </p>
                  
                  <ul className="space-y-5 mb-8">
                    {comparisonSection.newWay.points.map((point, idx) => (
                      <motion.li 
                        key={idx} 
                        className="flex items-start gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 + 0.2 }}
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <Check className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="text-slate-700 leading-relaxed">
                          {point.text}
                          {point.highlight && <strong className="text-emerald-600"> {point.highlight}</strong>}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <div className="pt-6 border-t-2 border-emerald-100 bg-emerald-50/50 -mx-8 md:-mx-10 -mb-8 md:-mb-10 px-8 md:px-10 py-6 rounded-b-3xl">
                    <p className="flex items-start gap-3 text-slate-800">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-emerald-500" />
                      </div>
                      <span className="text-lg"><strong className="text-emerald-600">Result:</strong> {comparisonSection.newWay.result}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Process Steps Section - ENHANCED 9-Section Page Design */}
      {processSection && (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          {/* Animated background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(221_73%_49%/0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          {/* Glowing orbs */}
          <motion.div 
            className="absolute -left-20 top-1/3 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -right-20 bottom-1/3 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.span 
                className="inline-block px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-bold mb-4 uppercase tracking-wider"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                ⚙️ Our Process
              </motion.span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                {processSection.headline}
              </h2>
              <p className="text-slate-400 max-w-3xl mx-auto text-lg">
                {processSection.subheadline}
              </p>
            </motion.div>

            {/* Process Steps - Responsive Grid with Timeline */}
            <div className="relative max-w-6xl mx-auto">
              {/* Desktop Timeline connector */}
              <div className="hidden lg:block absolute top-[72px] left-[10%] right-[10%] h-0.5 bg-slate-700" />
              <motion.div 
                className="hidden lg:block absolute top-[72px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary via-primary to-primary origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.3 }}
              />

              {/* Steps Grid - 2x2 on tablet, 4 cols on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
                {processSection.steps.map((step, index) => {
                  const stepIcons = [Target, Zap, Users, Award];
                  const StepIcon = stepIcons[index % stepIcons.length];
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15, duration: 0.5 }}
                      className="relative group"
                    >
                      {/* Step number circle on timeline - desktop */}
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 + 0.3, type: "spring", stiffness: 300 }}
                        className={`hidden lg:flex absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-14 h-14 rounded-full ${bgColor} items-center justify-center shadow-lg shadow-primary/20 border-4 border-slate-900 ring-4 ring-primary/20`}
                      >
                        <span className="text-white font-black text-xl">{index + 1}</span>
                      </motion.div>

                      {/* Card */}
                      <motion.div
                        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 lg:pt-14 border border-slate-700/50 relative overflow-hidden h-full group-hover:border-primary/50 group-hover:bg-slate-800/80 transition-all duration-300"
                        whileHover={{ y: -6, boxShadow: "0 20px 40px -15px rgba(79, 112, 229, 0.3)" }}
                      >
                        {/* Gradient accent line */}
                        <div className={`absolute inset-x-0 top-0 h-1 ${bgColor} opacity-60 group-hover:opacity-100 transition-opacity`} />
                        
                        {/* Mobile step number */}
                        <div className="lg:hidden flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center shadow-lg`}>
                            <span className="text-white font-bold text-lg">{index + 1}</span>
                          </div>
                          <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Step {index + 1}</span>
                        </div>
                        
                        {/* Icon */}
                        <motion.div 
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <StepIcon className="w-6 h-6 text-primary" />
                        </motion.div>
                        
                        <h3 className="text-lg font-bold text-white mb-1">
                          {step.title}
                        </h3>
                        <p className="text-primary text-sm font-semibold mb-3 italic">
                          "{step.subtitle}"
                        </p>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          {step.description}
                        </p>

                        {/* Hover arrow indicator */}
                        <motion.div
                          className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.1 }}
                        >
                          <ArrowRight className="w-4 h-4 text-primary" />
                        </motion.div>
                      </motion.div>

                      {/* Mobile connector */}
                      {index < processSection.steps.length - 1 && (
                        <div className="md:hidden flex justify-center py-3">
                          <motion.div 
                            className="w-0.5 h-6 bg-gradient-to-b from-primary to-primary/20 rounded-full"
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 + 0.4 }}
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Roadmap Section - Hidden for 9-section pages */}
      {!is9SectionPage && (
      <section id="roadmap" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-graph-paper-light" />
        <motion.div 
          className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              className="inline-block px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              🗺️ The Roadmap
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Your Path to <span className="text-primary">Success</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              A structured approach to get you from where you are to where you want to be
            </p>
          </motion.div>


          {/* Bento Grid with Assembly Animation */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {roadmapPhases.map((phase, index) => {
              const directions = ['left', 'top', 'right', 'bottom'];
              const direction = directions[index % 4];
              const isLarge = index === 0;
              const isExpanded = expandedPhase === index;
              
              return (
                <motion.div
                  key={index}
                  custom={direction}
                  variants={assemblyVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  className={`bg-white rounded-2xl p-8 border-2 border-slate-100 shadow-lg relative overflow-hidden group cursor-pointer ${isLarge ? 'lg:col-span-2' : ''} ${isExpanded ? 'ring-2 ring-primary/30' : ''}`}
                  whileHover={{ y: -6, borderColor: "hsl(221 73% 49% / 0.3)", boxShadow: "0 25px 50px -12px hsla(221, 73%, 49%, 0.15)" }}
                  onClick={() => setExpandedPhase(isExpanded ? null : index)}
                >
                  {/* Phase watermark */}
                  <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-8xl font-black text-slate-900">{phase.phase}</span>
                  </div>
                  
                  {/* Accent bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${bgColor} rounded-l-2xl`} />
                  
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center mb-5`}>
                      <span className={`text-xl font-bold ${iconColor}`}>{phase.phase}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className={`w-8 h-8 rounded-full ${isExpanded ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'} flex items-center justify-center`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{phase.title}</h3>
                  <p className={`text-sm font-semibold ${iconColor} mb-4 italic`}>"{phase.subtitle}"</p>
                  <p className="text-slate-600 leading-relaxed">{phase.description}</p>
                  
                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && phase.details && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <ul className="space-y-2">
                            {phase.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Deliverables Section (BoltGuider specific - Clean, No Pricing) - ENHANCED with Bento Grid */}
      {deliverablesSection && (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(221_73%_49%/0.08)_1px,transparent_1px)] bg-[size:32px_32px]"
            animate={{ backgroundPosition: ["0px 0px", "32px 32px"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Glowing orbs */}
          <motion.div 
            className="absolute -left-20 top-1/3 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -right-20 bottom-1/3 w-48 h-48 bg-violet-500/15 rounded-full blur-3xl"
            animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <motion.span 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-bold mb-4 uppercase tracking-wider border border-white/10"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <FileText className="w-4 h-4" />
                Your Deliverables
              </motion.span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                {deliverablesSection.headline}
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                {deliverablesSection.supportingLine}
              </p>
            </motion.div>

            {/* Enhanced Bento Grid Layout */}
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
              {deliverablesSection.items.map((item, index) => {
                const deliverableIcons = [FileText, BarChart3, CheckSquare, Route, Target, Award];
                const DeliverableIcon = deliverableIcons[index % deliverableIcons.length];
                const isWide = index === 0 || index === deliverablesSection.items.length - 1;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300 ${isWide ? 'md:col-span-2' : ''}`}
                    whileHover={{ y: -4 }}
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10 flex items-start gap-5">
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                        whileHover={{ rotate: 5 }}
                      >
                        <DeliverableIcon className="w-6 h-6 text-primary" />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-slate-400">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Enhanced Callout with border beam effect */}
            {deliverablesSection.callout && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-14 max-w-2xl mx-auto"
              >
                <div className="relative p-6 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 overflow-hidden">
                  {/* Shimmer border effect */}
                  <div className="absolute inset-0 rounded-2xl">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
                         style={{ backgroundSize: "200% 100%" }} />
                  </div>
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <p className="text-white/90 text-lg font-medium">
                      {deliverablesSection.callout}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Section 7: How We Work With You - ENHANCED with 3-column cards and glassmorphism */}
      {is9SectionPage && workStyleSection && (
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
          {/* Decorative background elements */}
          <motion.div 
            className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-10 right-10 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-12">
                <motion.span 
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full ${iconBg} ${iconColor} text-sm font-bold mb-4`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <Users className="w-4 h-4" />
                  How We Work With You
                </motion.span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900">
                  Our Working Style
                </h2>
              </div>
              
              {/* 3-column card grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {workStyleSection.points.map((point, index) => {
                  const workIcons = [Zap, Clock, Shield, Target, Rocket, Users];
                  const WorkIcon = workIcons[index % workIcons.length];
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300"
                      whileHover={{ y: -6 }}
                    >
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${bgColor.replace('bg-', 'from-').split(' ')[0]}/5 to-transparent`} />
                      
                      <div className="relative z-10">
                        <motion.div 
                          className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}
                          whileHover={{ rotate: 5 }}
                        >
                          <WorkIcon className={`w-6 h-6 ${iconColor}`} />
                        </motion.div>
                        <p className="text-slate-700 text-base leading-relaxed font-medium">{point}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* UNIFIED Strategic Toolkit Section - Merged Deliverables + Value Stack */}
      {(deliverables || valueStack) && !deliverablesSection && (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          {/* Animated background pattern */}
          <motion.div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(221_73%_49%/0.1)_1px,transparent_1px)] bg-[size:32px_32px]"
            animate={{ backgroundPosition: ["0px 0px", "32px 32px"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Gradient orbs */}
          <motion.div 
            className="absolute -left-40 top-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl"
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -right-40 bottom-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl"
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <motion.span 
                className="inline-block px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-bold mb-4 uppercase tracking-wider"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                🎯 Tangible Assets, Engineered For You
              </motion.span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                {deliverables?.headline || "Our Complete Strategic Toolkit."}
              </h2>
              {valueStack && (
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                  Expert-built assets for immediate clarity and action.
                </p>
              )}
            </motion.div>

            {/* Quick Summary Cards - Main Deliverables */}
            {deliverables && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
                {deliverables.items.slice(0, 4).map((item, index) => {
                  const deliverableIcons = [FileText, BarChart3, CheckSquare, Route];
                  const DeliverableIcon = deliverableIcons[index % deliverableIcons.length];
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-slate-800/90 to-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-primary/50 transition-all group relative overflow-hidden"
                      whileHover={{ y: -6, boxShadow: "0 20px 40px -15px rgba(79, 112, 229, 0.3)" }}
                    >
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 250 }}
                          className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 shadow-lg"
                        >
                          <DeliverableIcon className="w-7 h-7 text-primary" />
                        </motion.div>
                        
                        <h3 className="text-lg font-bold text-white leading-tight mb-2">{item.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">{item.description}</p>
                        
                        {item.worth && (
                          <motion.span 
                            className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.4 }}
                          >
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2" />
                            Worth {item.worth}
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Full Value Stack Card */}
            {valueStack && (
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl overflow-hidden border-2 border-white/20"
                >
                  {/* Header with gradient */}
                  <div className={`${bgColor} p-8 text-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_100%/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_100%/0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="relative z-10"
                    >
                      <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                        {valueStack.headline}
                      </h3>
                      <p className="text-white/80 text-lg max-w-2xl mx-auto">
                        {valueStack.subheadline}
                      </p>
                    </motion.div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 md:p-10">
                    {/* Visual preview mockup */}
                    <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-6 mb-8 border border-slate-200">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${iconColor}`} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Your Custom {name} Kit</p>
                          <p className="text-slate-500 text-sm">Everything you need to succeed</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            className="h-16 bg-white rounded-lg border border-slate-200 flex items-center justify-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <div className={`w-8 h-8 rounded ${iconBg} flex items-center justify-center`}>
                              <Check className={`w-4 h-4 ${iconColor}`} />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    {/* What's included list */}
                    <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary" />
                      </span>
                      What's Included:
                    </h4>
                    
                    <ul className="space-y-4 mb-8">
                      {valueStack.items.map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          className={`flex items-start gap-4 p-4 rounded-xl ${item.isBonus ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 border border-slate-100'} hover:shadow-md transition-shadow`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.isBonus ? 'bg-amber-100' : 'bg-primary/10'}`}>
                            {item.isBonus ? (
                              <Award className="w-4 h-4 text-amber-600" />
                            ) : (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-bold text-slate-900">
                                {item.isBonus && <span className="text-amber-600">FREE BONUS: </span>}
                                {item.title}
                              </span>
                              {item.worth && (
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  Worth {item.worth}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 text-sm">{item.description}</p>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                    
                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-8" />
                    
                    {/* Pricing CTA */}
                    <div className="text-center">
                      {(valueStack.totalValue || valueStack.yourPrice) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          className="inline-block"
                        >
                          {valueStack.totalValue && (
                            <p className="text-2xl font-bold text-orange-500 mb-2">
                              Total Value: <span className="line-through">{valueStack.totalValue}</span>
                            </p>
                          )}
                          {valueStack.yourPrice && (
                            <>
                              <p className="text-lg font-semibold text-slate-600 mb-2">
                                Your Investment Today:
                              </p>
                              <motion.p 
                                className={`text-5xl md:text-6xl font-black ${iconColor} mb-6`}
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                {valueStack.yourPrice}
                              </motion.p>
                            </>
                          )}
                        </motion.div>
                      )}
                      
                      <motion.div 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        className="inline-block"
                      >
                        <Button 
                          size="lg" 
                          className={`${bgColor} hover:opacity-90 text-white font-bold px-12 py-6 text-lg shadow-xl`}
                          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          {valueStack.ctaText}
                        </Button>
                      </motion.div>
                      {valueStack.ctaSubtext && (
                        <motion.p 
                          className="text-sm text-red-500 mt-3 font-medium"
                          animate={{ opacity: [1, 0.7, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          ⏰ {valueStack.ctaSubtext}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Bento Box Section - Feature Highlights (Why Choose [Service]) */}
      {bentoItems && bentoItems.length > 0 && (
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.span 
                className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                ✨ Why Choose {name}
              </motion.span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                What Makes Us Different
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {bentoItems.map((item, index) => {
                const ItemIcon = item.icon;
                const isWide = item.span === 'wide';
                const isTall = item.span === 'tall';
                
                return (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={staggerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className={`relative group rounded-2xl p-6 border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${isWide ? 'lg:col-span-2' : ''} ${isTall ? 'lg:row-span-2' : ''}`}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    {/* Background Glow */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${bgColor}/5 blur-2xl`} />
                    
                    {/* Icon */}
                    <motion.div 
                      className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-4 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ItemIcon className={`w-6 h-6 ${iconColor}`} />
                    </motion.div>
                    
                    {/* Content */}
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                    
                    {/* Decorative Corner */}
                    <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full ${bgColor}/10 blur-2xl group-hover:scale-150 transition-transform duration-500`} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Service Catalog Section */}
      {serviceCatalog && (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(221_73%_49%/0.1)_1px,transparent_1px)] bg-[size:32px_32px]"
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                {serviceCatalog.headline}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {serviceCatalog.categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <h3 className="text-lg font-bold text-white mb-4">{category.title}</h3>
                  <ul className="space-y-3">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                        <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section - Enhanced */}
      {pricingTiers && (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-graph-paper-light" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.span 
                className="inline-block px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                💰 Investment
              </motion.span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
                Choose Your <span className="text-primary">Plan</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className={`rounded-2xl p-8 relative overflow-hidden ${
                    tier.isPopular 
                      ? 'bg-slate-900 text-white shadow-2xl scale-105' 
                      : 'bg-white border-2 border-slate-100 shadow-lg'
                  }`}
                  whileHover={{ y: -8 }}
                >
                  {tier.isPopular && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary animate-shimmer bg-[length:200%_100%]" />
                  )}
                  
                  {tier.isPopular && (
                    <motion.div 
                      className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                    >
                      MOST POPULAR
                    </motion.div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className={`text-xl font-bold mb-2 ${tier.isPopular ? 'text-white' : 'text-slate-900'}`}>
                      {tier.name}
                    </h3>
                    <p className={`text-sm ${tier.isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
                      {tier.description}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    {tier.originalPrice && (
                      <p className={`text-sm line-through ${tier.isPopular ? 'text-slate-400' : 'text-slate-400'}`}>
                        {tier.originalPrice}
                      </p>
                    )}
                    <p className={`text-4xl font-extrabold ${tier.isPopular ? 'text-white' : 'text-slate-900'}`}>
                      {tier.price}
                    </p>
                    {tier.priceNote && (
                      <p className={`text-sm ${tier.isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                        {tier.priceNote}
                      </p>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.isPopular ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        <span className={`text-sm ${tier.isPopular ? 'text-white/90' : 'text-slate-700'}`}>{feature}</span>
                      </li>
                    ))}
                    {tier.notIncluded?.map((feature, idx) => (
                      <li key={`not-${idx}`} className="flex items-start gap-3 opacity-50">
                        <X className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.isPopular ? 'text-white/40' : 'text-slate-400'}`} />
                        <span className={`text-sm line-through ${tier.isPopular ? 'text-white/50' : 'text-slate-400'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full font-bold ${
                      tier.isPopular 
                        ? 'bg-white text-slate-900 hover:bg-white/90' 
                        : index === 0 
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                          : `${bgColor} text-white hover:opacity-90`
                    }`}
                    size="lg"
                    onClick={() => {
                      // If this is the first tier (Stage Clarity Check) and we have a diagnostic callback, use it
                      if (index === 0 && tier.price === 'Free' && onOpenDiagnostic) {
                        onOpenDiagnostic();
                      } else {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {tier.ctaText}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guarantee Section - Hidden for minimal/BoltGuider style */}
      {heroStyle !== 'minimal' && (
        <section className="py-16 bg-emerald-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto"
            >
              {/* Shield Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="w-28 h-28 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                  <Shield className="w-14 h-14 text-white" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award className="w-5 h-5 text-white" />
                </motion.div>
              </motion.div>
              
              {/* Guarantee Text */}
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
                  100% Satisfaction Guarantee
                </h3>
                <p className="text-slate-600 text-lg max-w-lg">
                  We're confident in the value we provide. If you're not completely satisfied with your experience, 
                  we'll work with you to make it right — no questions asked.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Fit Check Section - Two Column (BoltGuider specific) */}
      {fitCheckSection && (
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-graph-paper-light" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.span 
                className="inline-block px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                👤 Is This For You?
              </motion.span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
                {fitCheckSection.headline}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* For You If... */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-emerald-50 rounded-2xl p-8 border-2 border-emerald-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">This is for you if...</h3>
                </div>
                <ul className="space-y-4">
                  {fitCheckSection.forYouIf.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Not For You If... */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-slate-50 rounded-2xl p-8 border-2 border-slate-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center">
                    <X className="w-6 h-6 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">This is not for you if...</h3>
                </div>
                <ul className="space-y-4">
                  {fitCheckSection.notForYouIf.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {fitCheckSection.closingLine && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mt-12 text-lg font-medium text-slate-600 max-w-2xl mx-auto"
              >
                {fitCheckSection.closingLine}
              </motion.p>
            )}
          </div>
        </section>
      )}

      {/* Audience Tracks Section - Only show if audienceTracks provided and no fitCheckSection */}
      {audienceTracks && audienceTracks.length > 0 && !fitCheckSection && (
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-graph-paper-light" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.span 
                className="inline-block px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                👤 Who Is This For?
              </motion.span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
                Find Your <span className="text-primary">Track</span>
              </h2>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {audienceTracks.map((track, index) => {
                const trackColors = [
                  { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'text-blue-600', iconBg: 'bg-blue-100' },
                  { bg: 'bg-purple-50', border: 'border-purple-200', accent: 'text-purple-600', iconBg: 'bg-purple-100' },
                  { bg: 'bg-emerald-50', border: 'border-emerald-200', accent: 'text-emerald-600', iconBg: 'bg-emerald-100' },
                ];
                const color = trackColors[index % trackColors.length];
                
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`${color.bg} rounded-2xl p-7 border-2 ${color.border} relative overflow-hidden`}
                    whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.1)" }}
                  >
                    {index === 0 && (
                      <motion.div 
                        className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                      >
                        Most Popular
                      </motion.div>
                    )}
                    
                    <div className={`w-16 h-16 rounded-xl ${color.iconBg} flex items-center justify-center mb-5`}>
                      <track.icon className={`w-8 h-8 ${color.accent}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{track.title}</h3>
                    <p className={`text-sm font-medium ${color.accent} mb-5`}>{track.forText}</p>
                    
                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="text-slate-400 uppercase tracking-wider text-xs font-semibold">Status:</span>
                        <p className="text-slate-700 mt-1">{track.status}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase tracking-wider text-xs font-semibold">Goal:</span>
                        <p className="text-slate-700 mt-1">{track.goal}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase tracking-wider text-xs font-semibold">We Provide:</span>
                        <p className="text-slate-700 mt-1">{track.weProvide}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* Post-Engagement Section (BoltGuider specific) */}
      {postEngagementSection && (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-graph-paper-light" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.span 
                className="inline-block px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                🚀 What's Next?
              </motion.span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
                {postEngagementSection.headline}
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                {postEngagementSection.supportingLine}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {postEngagementSection.paths.map((path, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 border-2 border-slate-100 shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <span className="text-2xl font-bold text-primary">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{path.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{path.description}</p>
                </motion.div>
              ))}
            </div>

            {postEngagementSection.trustStatement && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mt-12 text-lg font-medium text-slate-700 max-w-3xl mx-auto bg-white p-6 rounded-xl border border-slate-200"
              >
                {postEngagementSection.trustStatement}
              </motion.p>
            )}
          </div>
        </section>
      )}

      {/* Application Steps Section - Hidden for 9-section pages */}
      {!is9SectionPage && (
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(221_73%_49%/0.1)_1px,transparent_1px)] bg-[size:32px_32px]"
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              className="inline-block px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-bold mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              🚀 How To Apply
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              Start Your <span className="text-primary">Journey</span>
            </h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {applicationSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center relative"
              >
                {/* Connecting line */}
                {index < applicationSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-white/10" />
                )}
                
                <motion.div 
                  className={`w-16 h-16 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-5 shadow-lg`}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className={`text-2xl font-bold ${iconColor}`}>{step.step}</span>
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      )}

      {/* FAQ Section - Hidden for 9-section pages */}
      {!is9SectionPage && (
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-graph-paper-light" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="faq-split-layout max-w-6xl mx-auto">
            {/* Left - Title */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:sticky md:top-32 md:h-fit"
            >
              <motion.span 
                className="inline-block px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                ❓ FAQs
              </motion.span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Frequently Asked<br />
                <span className="text-primary"><WavyUnderline>Questions</WavyUnderline></span>
              </h2>
              <p className="text-slate-600 mb-6">
                Got questions? We've got answers.
              </p>
              
              {/* WhatsApp support */}
              <a 
                href="https://wa.me/919999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat with us on WhatsApp</span>
              </a>
            </motion.div>

            {/* Right - FAQ Cards with enhanced states */}
            <div className="space-y-4">
              {faqItems.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                const FaqIcon = getFaqIcon(index);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className={`bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      isOpen 
                        ? 'border-primary/30 shadow-lg shadow-primary/5' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {/* Colored left border when open */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${isOpen ? bgColor : 'bg-transparent'}`} />
                    
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className={`w-full px-6 py-5 flex items-center gap-4 text-left transition-colors relative ${
                        isOpen ? 'bg-primary/5' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isOpen ? `${bgColor} text-white` : 'bg-slate-100 text-slate-500'
                      }`}>
                        <FaqIcon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-slate-900 flex-1">{faq.question}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isOpen ? `${bgColor} text-white` : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pl-20 text-slate-600 leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Footer CTA Section - Enhanced / Minimal mode supported */}
      <section className={`py-24 ${bgColor} relative overflow-hidden`}>
        {/* Floating shapes - Hidden in minimal mode */}
        {heroStyle !== 'minimal' && (
          <>
            <motion.div 
              className="absolute top-10 right-[10%] w-24 h-24 rounded-full bg-white/10 blur-xl"
              animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-10 left-[10%] w-32 h-32 rounded-full bg-white/10 blur-xl"
              animate={{ y: [0, 20, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            />
            
            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/20"
                style={{
                  top: `${15 + i * 15}%`,
                  left: `${5 + i * 18}%`,
                }}
                animate={{
                  opacity: [0.2, 0.6, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
            ))}
          </>
        )}
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={heroStyle === 'minimal' ? 'max-w-3xl mx-auto' : ''}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              {footerCTA.headline}
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              {footerCTA.subheadline}
            </p>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                {heroStyle !== 'minimal' && (
                  <div className="absolute inset-0 bg-white/30 blur-xl rounded-full" />
                )}
                <Button 
                  size="lg" 
                  className="relative bg-white text-slate-900 hover:bg-white/95 font-bold px-10 py-6 text-lg shadow-2xl"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {footerCTA.buttonText}
                  {heroStyle !== 'minimal' && <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>
              </motion.div>
              {heroStyle !== 'minimal' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-bold px-10 py-6 text-lg"
                    onClick={() => (window as { Intercom?: (...args: unknown[]) => void }).Intercom?.('show')}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat With Us
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Secondary text for minimal mode */}
            {heroStyle === 'minimal' && footerCTA.secondaryText && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 text-white/60 text-base"
              >
                {footerCTA.secondaryText}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Section 9: Platform Reassurance - ENHANCED with gradient banner and logo */}
      {is9SectionPage && platformReassurance && (
        <section className="py-16 bg-gradient-to-r from-slate-50 via-white to-slate-50 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          {/* Decorative gradient accents */}
          <motion.div 
            className={`absolute left-0 top-0 bottom-0 w-1 ${bgColor} opacity-50`}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div 
            className={`absolute right-0 top-0 bottom-0 w-1 ${bgColor} opacity-50`}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 shadow-sm overflow-hidden">
                {/* Shimmer border effect */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer opacity-50" 
                       style={{ backgroundSize: "200% 100%" }} />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  {/* FounderPlane Logo */}
                  <Link to="/" className="flex-shrink-0 group">
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center shadow-lg`}
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <img
                        src={founderplaneLogo}
                        alt="FounderPlane"
                        className="w-10 h-10"
                      />
                    </motion.div>
                  </Link>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <Shield className={`w-5 h-5 ${iconColor}`} />
                      <span className={`text-sm font-bold ${iconColor} uppercase tracking-wider`}>FounderPlane Guarantee</span>
                    </div>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      {platformReassurance.content}
                    </p>
                    <Link 
                      to="/" 
                      className="inline-flex items-center gap-1.5 mt-3 text-primary font-semibold text-sm hover:underline"
                    >
                      Learn more about FounderPlane
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact Form Section - Hidden for 9-section pages */}
      {!is9SectionPage && (
      <section id="contact" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-graph-paper-light" />
        <motion.div 
          className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.span 
                className="inline-block px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                ✉️ Contact
              </motion.span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
                Let's <span className="text-primary">Talk</span>
              </h2>
              <p className="text-slate-600 text-lg">
                Fill out the form below and we'll reach out to discuss how {name} can help you.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 md:p-10 border-2 border-slate-100 shadow-xl"
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full border-slate-200 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full border-slate-200 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone (Optional)</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full border-slate-200 focus:border-primary"
                />
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-700">Message</label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAiAssist}
                    disabled={isAiLoading}
                    className="text-primary hover:text-primary/80 gap-1 h-auto py-1 font-semibold"
                  >
                    {isAiLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    AI Assist
                  </Button>
                </div>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us about your business and goals..."
                  className="w-full min-h-[140px] border-slate-200 focus:border-primary"
                  required
                />
              </div>

              <Button type="submit" className={`w-full ${bgColor} text-white font-bold`} size="lg">
                Submit Inquiry
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.form>
          </div>
        </div>
      </section>
      )}

      {/* OLD: Section 7 - How We Work With You - FOR NON-9-SECTION PAGES ONLY */}
      {!is9SectionPage && workStyleSection && (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-graph-paper-light" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <motion.span 
                className={`inline-block px-5 py-2.5 rounded-full ${iconBg} ${iconColor} text-sm font-bold mb-4`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                🤝 How We Work With You
              </motion.span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8">
                Our Working Style
              </h2>
              
              <div className="space-y-4">
                {workStyleSection.points.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
                  >
                    <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Check className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <p className="text-slate-700 text-lg leading-relaxed">{point}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* OLD: Section 9 - Platform Reassurance - FOR NON-9-SECTION PAGES ONLY */}
      {!is9SectionPage && platformReassurance && (
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mx-auto mb-4`}>
                <Shield className={`w-6 h-6 ${iconColor}`} />
              </div>
              <p className="text-slate-600 text-lg leading-relaxed">
                {platformReassurance.content}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Simplified Footer - No Sub-brand Links */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Left - Logo & Description */}
            <div>
              <Link to="/" className="flex items-center gap-3 mb-4 group">
                <img
                  src={founderplaneLogo}
                  alt="FounderPlane"
                  width={44}
                  height={44}
                  className="h-11 w-11"
                />
                <span className="text-2xl font-bold text-white">FounderPlane</span>
              </Link>
              <p className="text-primary font-semibold text-lg mb-4">
                Strategy. Systems. Scale.
              </p>
              <p className="text-slate-400 leading-relaxed">
                The growth ecosystem for ambitious founders and business owners. We provide the Strategy, Systems, and Team to build profitable companies from scratch to scale.
              </p>
            </div>

            {/* Right - Social & Support */}
            <div className="md:text-right">
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Connect With Us</h4>
              
              {/* Social Links */}
              <div className="flex gap-4 mb-8 md:justify-end">
                <a 
                  href="https://linkedin.com/company/founderplane" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://youtube.com/@founderplane" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com/founderplane" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
              
              {/* Support */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">For Support</h4>
                <a 
                  href="https://wa.me/919999999999" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat With Us on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} FounderPlane. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Refund Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Footer */}
      {pricingTiers && (
        <AnimatePresence>
          {showStickyFooter && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden sticky-footer-glass border-t border-slate-200 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Starting at</p>
                  <p className="text-2xl font-extrabold text-slate-900">{stickyPrice}</p>
                </div>
                <Button 
                  className={`${bgColor} text-white flex-1 font-bold`}
                  size="lg"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </main>
  );
};

export default ServicePageLayout;
