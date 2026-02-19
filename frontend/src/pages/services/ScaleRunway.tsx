import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Minus, Check, Settings } from 'lucide-react';
import founderplaneLogo from '@/assets/founderplane-logo-new.png';
import StageClarityCheck from '@/components/StageClarityCheck';

/* ═══════════════════════════════════════════════════════════════════
   DESIGN TOKENS — SCALERUNWAY IDENTITY (Gold/Yellow)
   ═══════════════════════════════════════════════════════════════════ */
const C = {
  gold: '#F5A623',
  white: '#FFFFFF',
  mist: '#F5F5F7',
  black: '#0A0A0B',
  jetBlack: '#1D1D1F',
  graphite: '#424245',
  darkGrey: '#444444',
  lightGrey: '#86868B',
  mediumGrey: '#666666',
  borderGrey: '#E5E5E5',
  faintGrey: '#A0A0A5',
};

const F = {
  playfair: "'Playfair Display', serif",
  inter: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

/* ═══════════════════════════════════════════════════════════════════
   PREMIUM MOTION COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245,166,35,0.06), rgba(245,166,35,0.02) 40%, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const WordReveal = ({ text, className, style, delay = 0 }: {
  text: string; className?: string; style?: React.CSSProperties; delay?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const words = text.split(' ');
  return (
    <span ref={ref} className={className} style={style}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: delay + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
    viewport={{ once: true, margin: '-50px' }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════
   SCALERUNWAY BRANDED LEAD CAPTURE FORM (Gold theme)
   ═══════════════════════════════════════════════════════════════════ */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

interface ScaleRunwayFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScaleRunwayLeadForm = ({ isOpen, onClose }: ScaleRunwayFormProps) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, service_interest: 'ScaleRunway', source_page: 'ScaleRunway' }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({ name: '', email: '', phone: '', company: '', message: '' });
    setSubmitted(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        style={{ backgroundColor: 'rgba(10,10,11,0.7)', backdropFilter: 'blur(12px)' }}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-2xl overflow-hidden"
          style={{ background: C.white, border: `1px solid ${C.borderGrey}`, boxShadow: '0 40px 80px rgba(0,0,0,0.15)' }}
          data-testid="scalerunway-lead-form-modal"
        >
          <div className="px-8 pt-8 pb-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" style={{ color: C.gold }} />
              <span className="font-bold text-sm" style={{ fontFamily: F.inter, color: C.jetBlack }}>ScaleRunway</span>
            </div>
            <button onClick={handleClose} data-testid="scalerunway-form-close" className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-slate-100" style={{ color: C.lightGrey }}>
              <Plus className="w-4 h-4 rotate-45" />
            </button>
          </div>

          <div className="p-8">
            {submitted ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8" data-testid="scalerunway-form-success">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: C.gold + '20' }}>
                  <Check className="w-6 h-6" style={{ color: C.gold }} />
                </div>
                <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: F.playfair, color: C.jetBlack }}>We'll be in touch.</h3>
                <p className="text-sm mb-6" style={{ color: C.graphite }}>Our team will review your request and reach out within 24 hours.</p>
                <button onClick={handleClose} className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105" style={{ background: C.gold }}>Close</button>
              </motion.div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: F.mono, color: C.gold }}>Scale Planning Session</p>
                  <h3 className="text-xl font-semibold" style={{ fontFamily: F.playfair, color: C.jetBlack }}>Let's automate your growth.</h3>
                  <p className="text-sm mt-1" style={{ color: C.graphite }}>Tell us about your business and we'll map your automation potential.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: C.graphite }}>Name *</label>
                      <input data-testid="scalerunway-form-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Your name" required className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all" style={{ border: `1px solid ${C.borderGrey}`, color: C.jetBlack, fontFamily: F.inter }} onFocus={(e) => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.gold}20`; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.borderGrey; e.currentTarget.style.boxShadow = 'none'; }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: C.graphite }}>Company</label>
                      <input data-testid="scalerunway-form-company" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} placeholder="Your company" className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all" style={{ border: `1px solid ${C.borderGrey}`, color: C.jetBlack, fontFamily: F.inter }} onFocus={(e) => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.gold}20`; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.borderGrey; e.currentTarget.style.boxShadow = 'none'; }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: C.graphite }}>Email *</label>
                    <input data-testid="scalerunway-form-email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="you@company.com" required className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all" style={{ border: `1px solid ${C.borderGrey}`, color: C.jetBlack, fontFamily: F.inter }} onFocus={(e) => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.gold}20`; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.borderGrey; e.currentTarget.style.boxShadow = 'none'; }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: C.graphite }}>Phone (optional)</label>
                    <input data-testid="scalerunway-form-phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+91 000-000-0000" className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all" style={{ border: `1px solid ${C.borderGrey}`, color: C.jetBlack, fontFamily: F.inter }} onFocus={(e) => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.gold}20`; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.borderGrey; e.currentTarget.style.boxShadow = 'none'; }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: C.graphite }}>What's your biggest operational challenge? (optional)</label>
                    <textarea data-testid="scalerunway-form-message" value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} placeholder="Tell us where you feel stuck in the day-to-day..." rows={3} className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all resize-none" style={{ border: `1px solid ${C.borderGrey}`, color: C.jetBlack, fontFamily: F.inter }} onFocus={(e) => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.gold}20`; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.borderGrey; e.currentTarget.style.boxShadow = 'none'; }} />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button type="submit" data-testid="scalerunway-form-submit" disabled={submitting || !form.name.trim() || !form.email.trim()} className="w-full py-3.5 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: C.gold, fontFamily: F.inter }}>
                    {submitting ? 'Submitting...' : (<>Request Discovery Session <ArrowRight className="w-4 h-4" /></>)}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   CARD ICONS — Gold SVG Icons for Diagnosis Section
   ═══════════════════════════════════════════════════════════════════ */
const DiagnosisIcons = [
  // Lock - Decision Bottleneck
  () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <circle cx="12" cy="16" r="1" fill={C.gold} />
    </svg>
  ),
  // Hourglass - Manual Trap
  () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h14M5 21h14M7 3v4.5L12 12l-5 4.5V21M17 3v4.5L12 12l5 4.5V21" />
    </svg>
  ),
  // Brain - Knowledge Silo
  () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 5.5V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.5c1.5-1 3-3 3-5.5a7 7 0 0 0-7-7z" />
      <path d="M9 21h6M10 17v4M14 17v4" />
    </svg>
  ),
  // Ceiling - Scalability Ceiling
  () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h18M12 7v10M8 11l4-4 4 4M7 21h10" />
      <path d="M3 3v18M21 3v18" />
    </svg>
  ),
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN SCALERUNWAY COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const ScaleRunway = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showStageClarityCheck, setShowStageClarityCheck] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const diagnosisRef = useRef<HTMLDivElement>(null);

  // CRITICAL: Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Scroll-based card activation for Diagnosis
  useEffect(() => {
    const handleScroll = () => {
      if (!diagnosisRef.current) return;
      const rect = diagnosisRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - window.innerHeight)));
      setActiveCard(Math.min(3, Math.floor(scrollProgress * 4)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openChat = () => setShowLeadForm(true);

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ fontFamily: F.inter }} data-testid="scalerunway-page">
      {/* Stage Clarity Check Modal */}
      <StageClarityCheck isOpen={showStageClarityCheck} onClose={() => setShowStageClarityCheck(false)} />
      {/* ScaleRunway Branded Lead Form */}
      <ScaleRunwayLeadForm isOpen={showLeadForm} onClose={() => setShowLeadForm(false)} />

      {/* ═══════════════════════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════════════════════ */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${C.borderGrey}` }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div className="flex items-center gap-2.5" whileHover={{ scale: 1.02 }}>
            <motion.div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.gold }}>
              <Settings className="w-5 h-5 text-white" />
            </motion.div>
            <span style={{ fontFamily: F.inter, fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em', color: C.jetBlack }}>
              ScaleRunway
            </span>
          </motion.div>
          <div className="flex items-center gap-4">
            <Link to="/" className="hidden md:flex items-center gap-2 transition-opacity hover:opacity-70">
              <span className="text-sm" style={{ color: C.lightGrey }}>by</span>
              <img src={founderplaneLogo} alt="FounderPlane" className="h-7 w-7" />
              <span className="font-medium text-sm" style={{ color: C.jetBlack }}>FounderPlane</span>
            </Link>
            <div className="hidden md:block w-px h-5 bg-slate-200" />
            <motion.button
              data-testid="scalerunway-nav-chat-btn"
              onClick={openChat}
              className="px-5 py-2 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg text-white"
              style={{ backgroundColor: C.gold, fontFamily: F.mono, fontSize: '12px', fontWeight: 500 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              CHAT
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: THE HERO — "Scale Without The Bottleneck."
          Background: Gallery White (#FFFFFF)
      ═══════════════════════════════════════════════════════════ */}
      <section
        data-testid="scalerunway-hero"
        className="relative flex flex-col items-center justify-center"
        style={{ backgroundColor: C.white, paddingTop: '180px', paddingBottom: '140px', minHeight: '100vh' }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-[800px] mx-auto">
            <motion.p
              data-testid="scalerunway-hero-eyebrow"
              className="mb-8 uppercase tracking-wider"
              style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.gold, letterSpacing: '0.05em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              FOUNDERPLANE OPERATIONAL LEVERAGE SYSTEM
            </motion.p>

            <motion.h1
              className="mb-8"
              style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 1.1, color: C.jetBlack }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Scale Without The Bottleneck.
            </motion.h1>

            <motion.p
              className="mx-auto mb-12"
              style={{ fontFamily: F.inter, fontWeight: 400, fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.5, maxWidth: '640px', color: C.graphite }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              The business works, but it cannot grow without you. We install the automation and operational architecture needed to remove the founder from the day-to-day.
            </motion.p>

            <motion.button
              data-testid="scalerunway-hero-cta"
              onClick={openChat}
              className="px-8 py-4 rounded-full flex items-center gap-3 mx-auto mb-6 text-white"
              style={{ backgroundColor: C.gold, fontFamily: F.mono, fontWeight: 500, fontSize: '15px', letterSpacing: '0.02em' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              INSTALL THE OPERATING SYSTEM
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.p
              style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey, marginTop: '24px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              For founders who are tired of being the "Chief Everything Officer."
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: THE DIAGNOSIS — Sticky Split-Screen
          Background: Mist Grey (#F5F5F7)
      ═══════════════════════════════════════════════════════════ */}
      <section
        ref={diagnosisRef}
        data-testid="scalerunway-diagnosis"
        className="relative min-h-[200vh]"
        style={{ backgroundColor: C.mist, padding: '140px 0' }}
      >
        <div className="sticky top-0 min-h-screen flex items-center">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-5 gap-12 items-start">
              {/* Left Column (40%) — Sticky headline */}
              <div className="md:col-span-2">
                <motion.p
                  className="uppercase tracking-widest mb-4"
                  style={{ fontFamily: F.mono, fontSize: '14px', color: C.gold, letterSpacing: '0.05em' }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  THE FOUNDER TRAP
                </motion.p>
                <h2 style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', letterSpacing: '-0.02em', color: C.jetBlack, lineHeight: 1.15 }}>
                  <WordReveal text="Growth Stops Being Fun When It Starts Being Exhausting." delay={0.1} />
                </h2>
                <motion.p
                  className="mt-6"
                  style={{ fontFamily: F.inter, fontSize: '18px', lineHeight: 1.6, color: C.graphite, maxWidth: '400px' }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  You have revenue. You have a team. But you are still the center of gravity. Every decision, approval, and problem flows through you.
                </motion.p>
              </div>

              {/* Right Column (60%) — Scrolling Glass Box Cards */}
              <div className="md:col-span-3 space-y-6">
                {[
                  { title: 'The Decision Bottleneck.', body: 'The team waits for your "yes" before they move. You are slowing down your own company because you can\'t be in ten places at once.', Icon: DiagnosisIcons[0] },
                  { title: 'The Manual Trap.', body: 'You are doing high-value strategy in the morning and low-value admin in the afternoon. You are overqualified for half the work you do.', Icon: DiagnosisIcons[1] },
                  { title: 'The Knowledge Silo.', body: 'The "process" lives in your head. If you took a month off, the business wouldn\'t just stall\u2014it would break.', Icon: DiagnosisIcons[2] },
                  { title: 'The Scalability Ceiling.', body: 'Adding more clients just adds more chaos. You aren\'t building a business; you are building a high-stress job that you can\'t quit.', Icon: DiagnosisIcons[3] },
                ].map((card, i) => (
                  <SpotlightCard
                    key={i}
                    className="rounded-2xl border"
                    style={{
                      backgroundColor: C.white,
                      borderColor: activeCard === i ? C.gold : C.borderGrey,
                      boxShadow: activeCard === i ? '0 20px 40px rgba(0,0,0,0.06)' : '0px 4px 24px rgba(0, 0, 0, 0.04)',
                      opacity: activeCard === i ? 1 : 0.55,
                      padding: '40px',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <div className="mb-4">
                      <card.Icon />
                    </div>
                    <h3 style={{ fontFamily: F.playfair, fontWeight: 700, fontSize: '22px', color: C.jetBlack, marginBottom: '10px' }}>
                      {card.title}
                    </h3>
                    <p style={{ fontFamily: F.inter, fontSize: '15px', lineHeight: 1.6, color: C.graphite }}>
                      {card.body}
                    </p>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: THE TRUTH — Cinematic Dark Mode
          Background: Jet Black (#0A0A0B)
      ═══════════════════════════════════════════════════════════ */}
      <section
        data-testid="scalerunway-truth"
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ backgroundColor: C.black, padding: '160px 0' }}
      >
        {/* Gold glow — vault/treasure in the dark */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(245,166,35,0.10) 0%, transparent 70%)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-[900px] mx-auto">
            <motion.p
              className="uppercase tracking-wider mb-8"
              style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.gold, letterSpacing: '0.05em' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE PHILOSOPHY
            </motion.p>

            <motion.h2
              style={{ fontFamily: F.playfair, fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(32px, 4.5vw, 56px)', color: C.white, lineHeight: 1.2, marginBottom: '32px' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            >
              "If your business stops when you stop, you haven't built a company. You've built a cage."
            </motion.h2>

            <RevealText delay={0.6}>
              <p style={{ fontFamily: F.inter, fontSize: 'clamp(16px, 2vw, 20px)', color: C.faintGrey, marginTop: '40px' }}>
                Scale isn't about working harder. It is about replacing human friction with system leverage.
              </p>
            </RevealText>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: THE OWNERSHIP — "We Build The Machine. You Drive It."
          Background: Gallery White (#FFFFFF)
      ═══════════════════════════════════════════════════════════ */}
      <section
        data-testid="scalerunway-ownership"
        className="relative"
        style={{ backgroundColor: C.white, padding: '140px 0' }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-[800px] mx-auto">
            <motion.p
              className="uppercase tracking-wider mb-4 text-center"
              style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.gold, letterSpacing: '0.05em' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE SCOPE
            </motion.p>

            <h2 className="text-center" style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', color: C.jetBlack, lineHeight: 1.15, marginBottom: '20px' }}>
              <WordReveal text="We Build The Machine. You Drive It." />
            </h2>

            <RevealText delay={0.2}>
              <p className="text-center mx-auto" style={{ fontFamily: F.inter, fontSize: '20px', lineHeight: 1.5, color: C.graphite, maxWidth: '600px', marginBottom: '56px' }}>
                ScaleRunway is not a consulting advisory. It is an infrastructure installation. We engineer the backend so the frontend runs automatically.
              </p>
            </RevealText>

            {/* What We Install */}
            <div className="mb-12">
              <h3 className="mb-6" style={{ fontFamily: F.inter, fontWeight: 700, fontSize: '18px', color: C.jetBlack }}>
                What We Install
              </h3>
              <div className="space-y-6">
                {[
                  { title: 'Operational Architecture:', body: 'We map and redesign exactly how work flows through your company.' },
                  { title: 'Workflow Automation:', body: 'We replace manual coordination with system-triggered execution (Zapier/API).' },
                  { title: 'Delegation Frameworks:', body: 'We define decision boundaries so your team can act without you.' },
                  { title: 'KPI Infrastructure:', body: 'We build the dashboards that let you monitor performance without micromanagement.' },
                  { title: 'Founder Extraction:', body: 'We systematically remove you from the critical path of delivery.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <div className="w-6 h-6 mr-4 mt-0.5 flex-shrink-0 rounded-full flex items-center justify-center" style={{ backgroundColor: C.gold }}>
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </div>
                    <div>
                      <span style={{ fontFamily: F.inter, fontWeight: 600, fontSize: '16px', color: C.jetBlack }}>{item.title}</span>{' '}
                      <span style={{ fontFamily: F.inter, fontSize: '16px', lineHeight: 1.6, color: C.graphite }}>{item.body}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* The Boundary */}
            <motion.div
              className="pt-8"
              style={{ borderTop: `1px solid ${C.borderGrey}` }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="mb-3" style={{ fontFamily: F.inter, fontWeight: 700, fontSize: '18px', color: C.jetBlack }}>
                The Boundary
              </h3>
              <p style={{ fontFamily: F.inter, fontStyle: 'italic', fontSize: '16px', color: C.lightGrey, lineHeight: 1.7 }}>
                We do not manage your employees, and we do not write your marketing copy. We build the operating system that makes those functions scalable.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: THE ARCHITECTURE — 5-Phase Vertical Stack
          Background: Mist Grey (#F5F5F7)
      ═══════════════════════════════════════════════════════════ */}
      <section data-testid="scalerunway-architecture" className="relative" style={{ backgroundColor: C.mist, padding: '140px 0' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-20">
              <motion.p
                className="uppercase tracking-wider mb-4"
                style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.gold, letterSpacing: '0.05em' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                THE SYSTEM
              </motion.p>
              <h2 style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', color: C.jetBlack, lineHeight: 1.15, marginBottom: '20px' }}>
                <WordReveal text="The 5-Phase Leverage Protocol." />
              </h2>
              <RevealText delay={0.2}>
                <p className="mx-auto" style={{ fontFamily: F.inter, fontSize: '18px', lineHeight: 1.5, color: C.graphite, maxWidth: '600px' }}>
                  We don't just "organize" you. We re-engineer your business to run on code and clarity, not just willpower.
                </p>
              </RevealText>
            </div>

            {/* 5 Phases with vertical connector */}
            <div className="relative">
              <div className="absolute left-[23px] top-[20px] bottom-[20px] w-px" style={{ backgroundColor: C.borderGrey }} />
              <div className="space-y-[60px]">
                {[
                  { phase: '01', title: 'Operational Mapping.', body: 'We audit your entire business to find the friction. We identify exactly where the founder is trapped and where the process is broken.' },
                  { phase: '02', title: 'Process Engineering.', body: 'We standardize execution. We build the SOPs and decision frameworks that make quality repeatable without your supervision.' },
                  { phase: '03', title: 'Automation Architecture.', body: 'We replace manual work with code. We integrate your tools (CRM, Slack, Project Management) to trigger actions automatically.' },
                  { phase: '04', title: 'The Leverage Layer.', body: 'We install the reporting systems. We build the "Cockpit" dashboard that gives you a real-time view of business health.' },
                  { phase: '05', title: 'Founder Extraction.', body: 'We remove you from the machine. We hand off authority to the system and the team, elevating you from "Operator" to "Architect."' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-6 relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                  >
                    <div
                      className="w-[48px] h-[48px] rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                      style={{ border: `2px solid ${C.gold}`, backgroundColor: C.mist }}
                    >
                      <span style={{ fontFamily: F.mono, fontWeight: 600, fontSize: '14px', color: C.gold }}>{item.phase}</span>
                    </div>
                    <div className="pt-2">
                      <h3 style={{ fontFamily: F.inter, fontWeight: 600, fontSize: '18px', color: C.jetBlack, marginBottom: '6px' }}>{item.title}</h3>
                      <p style={{ fontFamily: F.inter, fontSize: '15px', lineHeight: 1.6, color: C.graphite }}>{item.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6: SYSTEM REQUIREMENTS — 2-Column Grid
          Background: Mist Grey (#F5F5F7)
      ═══════════════════════════════════════════════════════════ */}
      <section data-testid="scalerunway-requirements" className="relative" style={{ backgroundColor: C.mist, padding: '140px 0' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-4">
              <motion.p
                className="uppercase tracking-wider mb-4"
                style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.gold, letterSpacing: '0.05em' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                OPERATIONAL THRESHOLDS
              </motion.p>
              <h2 style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', color: C.jetBlack, lineHeight: 1.15, marginBottom: '20px' }}>
                <WordReveal text="Is ScaleRunway Right For You?" />
              </h2>
              <RevealText delay={0.2}>
                <p className="mx-auto" style={{ fontFamily: F.inter, fontSize: '17px', lineHeight: 1.7, color: C.graphite, maxWidth: '600px', marginBottom: '60px' }}>
                  Automation is a multiplier. If you automate a broken process, you get broken results faster. This system requires a working foundation.
                </p>
              </RevealText>
            </div>

            <div className="grid md:grid-cols-2 gap-20">
              {/* Compatible Column */}
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }}>
                <h3 style={{ fontFamily: F.inter, fontWeight: 700, fontSize: '20px', color: C.jetBlack, marginBottom: '28px' }}>Compatible</h3>
                <div className="space-y-5">
                  {[
                    'You have a revenue-generating business with 5+ team members.',
                    'You are overwhelmed by operational decisions.',
                    'You have proven product-market fit.',
                    'You are ready to let go of control to gain freedom.',
                  ].map((item, i) => (
                    <motion.div key={i} className="flex items-start group cursor-default" whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                      <div className="w-6 h-6 mr-4 mt-0.5 flex-shrink-0 rounded-full flex items-center justify-center" style={{ backgroundColor: C.gold }}>
                        <Plus className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </div>
                      <span style={{ fontFamily: F.inter, fontSize: '15px', lineHeight: 1.6, color: C.jetBlack }}>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Incompatible Column */}
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 0.7, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5 }}>
                <h3 style={{ fontFamily: F.inter, fontWeight: 400, fontSize: '20px', color: C.faintGrey, marginBottom: '28px' }}>Incompatible</h3>
                <div className="space-y-5">
                  {[
                    'You are a solo founder with no team.',
                    'You are still in the "Idea Phase" or "MVP Phase."',
                    'You want to micromanage every detail manually.',
                    'You are looking for a marketing agency to bring leads.',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start" style={{ opacity: 0.7 }}>
                      <div className="w-6 h-6 mr-4 mt-0.5 flex-shrink-0 rounded-full flex items-center justify-center" style={{ backgroundColor: C.borderGrey }}>
                        <Minus className="w-3.5 h-3.5" style={{ color: C.darkGrey }} strokeWidth={3} />
                      </div>
                      <span style={{ fontFamily: F.inter, fontSize: '15px', lineHeight: 1.6, color: C.graphite }}>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7: THE DIAGNOSTIC — Leverage Score Gateway
          Background: Gallery White (#FFFFFF)
      ═══════════════════════════════════════════════════════════ */}
      <section data-testid="scalerunway-diagnostic" className="relative overflow-hidden" style={{ backgroundColor: C.white, padding: '140px 0' }}>
        {/* Faint gears/circuit watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ opacity: 0.04 }}>
          <svg width="500" height="400" viewBox="0 0 500 400" fill="none" stroke={C.gold} strokeWidth="1">
            <circle cx="250" cy="200" r="60" />
            <circle cx="250" cy="200" r="40" />
            <path d="M250 130v-30M250 270v30M180 200h-30M320 200h30" />
            <path d="M200 150l-20-20M300 150l20-20M200 250l-20 20M300 250l20 20" />
            <circle cx="100" cy="100" r="30" />
            <circle cx="100" cy="100" r="18" />
            <path d="M100 65v-15M100 135v15M65 100h-15M135 100h15" />
            <circle cx="400" cy="300" r="35" />
            <circle cx="400" cy="300" r="22" />
            <path d="M400 260v-15M400 340v15M360 300h-15M440 300h15" />
            <line x1="130" y1="130" x2="200" y2="170" strokeDasharray="4 4" />
            <line x1="300" y1="230" x2="370" y2="275" strokeDasharray="4 4" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-[800px] mx-auto text-center">
            <motion.p
              className="uppercase tracking-wider mb-4"
              style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.gold, letterSpacing: '0.05em' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE DIAGNOSTIC
            </motion.p>

            <motion.h2
              style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', color: C.jetBlack, lineHeight: 1.15, marginBottom: '20px' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              What is your Operational Leverage Score?
            </motion.h2>

            <RevealText delay={0.2}>
              <p className="mx-auto" style={{ fontFamily: F.inter, fontSize: '18px', lineHeight: 1.6, color: C.graphite, maxWidth: '600px', marginBottom: '48px' }}>
                Are you running a scalable company or a heavy job? Take the 2-minute assessment to identify your exact operational bottleneck.
              </p>
            </RevealText>

            <motion.button
              data-testid="scalerunway-find-stage-btn"
              className="px-8 py-4 rounded-full flex items-center gap-3 mx-auto"
              style={{
                border: `2px solid ${C.gold}`,
                color: C.gold,
                backgroundColor: 'transparent',
                fontFamily: F.mono,
                fontWeight: 500,
                fontSize: '14px',
                letterSpacing: '0.02em',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.05, backgroundColor: C.gold, color: '#fff' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowStageClarityCheck(true)}
            >
              CHECK YOUR LEVERAGE
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8: THE GATEWAY — Final CTA, Dark Mode
          Background: Jet Black (#0A0A0B)
      ═══════════════════════════════════════════════════════════ */}
      <section
        data-testid="scalerunway-gateway"
        className="relative flex flex-col items-center justify-center"
        style={{ backgroundColor: C.black, padding: '160px 0' }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-[800px] mx-auto">
            <motion.p
              className="uppercase tracking-wider mb-8"
              style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.gold, letterSpacing: '0.05em' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE NEXT STEP
            </motion.p>

            <motion.h2
              style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(40px, 5vw, 64px)', color: C.white, lineHeight: 1.1, marginBottom: '24px' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Stop Scaling Chaos. Start Engineering Freedom.
            </motion.h2>

            <RevealText delay={0.4}>
              <p className="mx-auto" style={{ fontFamily: F.inter, fontSize: '20px', lineHeight: 1.5, color: C.faintGrey, maxWidth: '600px', marginBottom: '48px' }}>
                If you are ready to build a business that runs without you, request a system discovery session. We will map out your automation potential.
              </p>
            </RevealText>

            <motion.button
              data-testid="scalerunway-gateway-cta"
              onClick={openChat}
              className="px-10 py-5 rounded-full flex items-center gap-3 mx-auto mb-6 text-white"
              style={{ backgroundColor: C.gold, fontFamily: F.mono, fontWeight: 500, fontSize: '15px', letterSpacing: '0.02em' }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              animate={{ scale: [1, 1.02, 1] }}
            >
              REQUEST DISCOVERY SESSION
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.p
              style={{ fontFamily: F.inter, fontStyle: 'italic', fontSize: '14px', color: C.mediumGrey, marginTop: '24px' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              We only accept 5 engineering partners per quarter.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 9: SYSTEM FAQs — Accordion
          Background: Gallery White (#FFFFFF)
      ═══════════════════════════════════════════════════════════ */}
      <section data-testid="scalerunway-faq" className="relative" style={{ backgroundColor: C.white, padding: '140px 0' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-[60px]">
              <h2 style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', color: C.jetBlack, lineHeight: 1.15 }}>
                <WordReveal text="Common Questions." />
              </h2>
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              {[
                { q: 'Is this just setting up Zapier?', a: 'No. Tools are useless without architecture. We design the logic of your business first\u2014defining exactly how data and decisions flow\u2014then we use automation to execute it. We are architects, not IT support.' },
                { q: 'Will this replace my team?', a: 'No. It empowers them. By removing low-value manual work (data entry, scheduling, follow-ups), your team can focus on high-value execution and strategy. We automate the robot work so humans can do the human work.' },
                { q: 'How long does it take?', a: 'The typical installation takes 12 weeks to transform a manual, founder-led business into a system-led operation.' },
                { q: "I'm a solo founder. Is this for me?", a: 'No. ScaleRunway is designed for teams of 5+ who are facing coordination chaos. If you are solo, you don\'t need automation yet; you need clarity. Start with BoltGuider.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  style={{ borderBottom: `1px solid ${C.borderGrey}` }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <button
                    data-testid={`scalerunway-faq-${i}`}
                    className="w-full py-6 flex items-center justify-between text-left group"
                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  >
                    <span
                      style={{
                        fontFamily: F.inter,
                        fontWeight: 500,
                        fontSize: '18px',
                        color: openFAQ === i ? C.gold : C.jetBlack,
                        transition: 'color 0.2s',
                      }}
                      className="pr-4"
                    >
                      {item.q}
                    </span>
                    <motion.div animate={{ rotate: openFAQ === i ? 45 : 0 }} transition={{ duration: 0.2 }}>
                      <Plus className="w-5 h-5 flex-shrink-0" style={{ color: openFAQ === i ? C.gold : C.lightGrey }} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFAQ === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p style={{ fontFamily: F.inter, fontSize: '16px', lineHeight: 1.7, color: C.graphite, paddingBottom: '24px' }}>
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

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer style={{ backgroundColor: C.black, padding: '60px 0' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={founderplaneLogo} alt="FounderPlane" className="h-6 w-auto" />
              <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }}>ScaleRunway by FounderPlane</span>
            </Link>
            <div className="flex items-center gap-8">
              <Link to="/services/boltguider" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">BoltGuider</Link>
              <Link to="/services/brandtofly" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">BrandToFly</Link>
              <Link to="/services/d2cbolt" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">D2CBolt</Link>
              <Link to="/services/b2bbolt" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">B2BBolt</Link>
              <Link to="/services/boltrunway" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">BoltRunway</Link>
              <Link to="/" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">FounderPlane</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default ScaleRunway;
