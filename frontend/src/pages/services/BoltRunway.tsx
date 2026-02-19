import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Minus, Check, Shield, Hourglass, TrendingDown, Shuffle, Compass } from 'lucide-react';
import founderplaneLogo from '@/assets/founderplane-logo-new.png';
import ScrollTracker from '@/components/ScrollTracker';

const BOLTRUNWAY_SECTIONS = [
  { id: 'boltrunway-hero', name: 'Hero' },
  { id: 'boltrunway-diagnosis', name: 'Diagnosis' },
  { id: 'boltrunway-truth', name: 'Truth' },
  { id: 'boltrunway-ownership', name: 'Ownership' },
  { id: 'boltrunway-architecture', name: 'Architecture' },
  { id: 'boltrunway-requirements', name: 'Requirements' },
  { id: 'boltrunway-diagnostic', name: 'Diagnostic' },
  { id: 'boltrunway-gateway', name: 'Gateway' },
  { id: 'boltrunway-faq', name: 'FAQ' },
];
import StageClarityCheck from '@/components/StageClarityCheck';

/* ═══════════════════════════════════════════════════════════════════
   DESIGN TOKENS — BOLTRUNWAY IDENTITY (Crimson Red)
   ═══════════════════════════════════════════════════════════════════ */
const C = {
  crimson: '#D70040',
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
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(215,0,64,0.06), rgba(215,0,64,0.02) 40%, transparent 70%)`,
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
   BOLTRUNWAY BRANDED LEAD CAPTURE FORM (Crimson Red theme)
   ═══════════════════════════════════════════════════════════════════ */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

interface BoltRunwayFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const BoltRunwayLeadForm = ({ isOpen, onClose }: BoltRunwayFormProps) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Close on Escape key
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
        body: JSON.stringify({
          ...form,
          service_interest: 'BoltRunway',
          source_page: 'BoltRunway',
        }),
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
          data-testid="boltrunway-lead-form-modal"
        >
          <div className="px-8 pt-8 pb-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" style={{ color: C.crimson }} />
              <span className="font-bold text-sm" style={{ fontFamily: F.inter, color: C.jetBlack }}>BoltRunway</span>
            </div>
            <button
              onClick={handleClose}
              data-testid="boltrunway-form-close"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-slate-100"
              style={{ color: C.lightGrey }}
            >
              <Plus className="w-4 h-4 rotate-45" />
            </button>
          </div>

          <div className="p-8">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
                data-testid="boltrunway-form-success"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: C.crimson + '15' }}
                >
                  <Check className="w-6 h-6" style={{ color: C.crimson }} />
                </div>
                <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: F.playfair, color: C.jetBlack }}>
                  We'll be in touch.
                </h3>
                <p className="text-sm mb-6" style={{ color: C.graphite }}>
                  Our team will review your request and reach out within 24 hours.
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ background: C.crimson }}
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: F.mono, color: C.crimson }}>
                    Stability Assessment
                  </p>
                  <h3 className="text-xl font-semibold" style={{ fontFamily: F.playfair, color: C.jetBlack }}>
                    Let's stabilize your operations.
                  </h3>
                  <p className="text-sm mt-1" style={{ color: C.graphite }}>
                    Tell us about your business and we'll assess your scale readiness.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: C.graphite }}>Name *</label>
                      <input
                        data-testid="boltrunway-form-name"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Your name"
                        required
                        className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                        style={{ border: `1px solid ${C.borderGrey}`, color: C.jetBlack, fontFamily: F.inter }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = C.crimson; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.crimson}15`; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = C.borderGrey; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: C.graphite }}>Company</label>
                      <input
                        data-testid="boltrunway-form-company"
                        value={form.company}
                        onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                        placeholder="Your company"
                        className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                        style={{ border: `1px solid ${C.borderGrey}`, color: C.jetBlack, fontFamily: F.inter }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = C.crimson; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.crimson}15`; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = C.borderGrey; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: C.graphite }}>Email *</label>
                    <input
                      data-testid="boltrunway-form-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="you@company.com"
                      required
                      className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                      style={{ border: `1px solid ${C.borderGrey}`, color: C.jetBlack, fontFamily: F.inter }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = C.crimson; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.crimson}15`; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = C.borderGrey; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: C.graphite }}>Phone (optional)</label>
                    <input
                      data-testid="boltrunway-form-phone"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+91 000-000-0000"
                      className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                      style={{ border: `1px solid ${C.borderGrey}`, color: C.jetBlack, fontFamily: F.inter }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = C.crimson; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.crimson}15`; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = C.borderGrey; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: C.graphite }}>What's your biggest scaling challenge? (optional)</label>
                    <textarea
                      data-testid="boltrunway-form-message"
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us about your operational bottleneck..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all resize-none"
                      style={{ border: `1px solid ${C.borderGrey}`, color: C.jetBlack, fontFamily: F.inter }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = C.crimson; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.crimson}15`; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = C.borderGrey; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit"
                    data-testid="boltrunway-form-submit"
                    disabled={submitting || !form.name.trim() || !form.email.trim()}
                    className="w-full py-3.5 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: C.crimson, fontFamily: F.inter }}
                  >
                    {submitting ? 'Submitting...' : (
                      <>Request Diagnostic Session <ArrowRight className="w-4 h-4" /></>
                    )}
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
   CARD ICONS — Crimson SVG Icons for Diagnosis Section
   ═══════════════════════════════════════════════════════════════════ */
const DiagnosisIcons = [
  // Hourglass - Founder Bottleneck
  () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.crimson} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h14M5 21h14M7 3v4.5L12 12l-5 4.5V21M17 3v4.5L12 12l5 4.5V21" />
    </svg>
  ),
  // Broken Chart - Fragile Margins
  () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.crimson} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20L8 15l3 3 4-6 3 2 3-5" />
      <path d="M3 20h18" />
      <circle cx="14" cy="12" r="1" fill={C.crimson} />
    </svg>
  ),
  // Tangled Knot - Operational Chaos
  () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.crimson} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12c0-3 2-6 5-6s4 3 4 6-2 6-5 6" />
      <path d="M20 12c0 3-2 6-5 6s-4-3-4-6 2-6 5-6" />
    </svg>
  ),
  // Compass - Strategic Drift
  () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.crimson} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={C.crimson} opacity="0.2" stroke={C.crimson} />
    </svg>
  ),
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN BOLTRUNWAY COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const BoltRunway = () => {
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
    <main className="min-h-screen overflow-x-hidden" style={{ fontFamily: F.inter }} data-testid="boltrunway-page">
      <ScrollTracker page="BoltRunway" sections={BOLTRUNWAY_SECTIONS} />
      {/* Stage Clarity Check Modal */}
      <StageClarityCheck isOpen={showStageClarityCheck} onClose={() => setShowStageClarityCheck(false)} />

      {/* BoltRunway Branded Lead Form */}
      <BoltRunwayLeadForm isOpen={showLeadForm} onClose={() => setShowLeadForm(false)} />

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
            <motion.div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.crimson }}>
              <Shield className="w-5 h-5 text-white" />
            </motion.div>
            <span style={{ fontFamily: F.inter, fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em', color: C.jetBlack }}>
              BoltRunway
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
              data-testid="boltrunway-nav-chat-btn"
              onClick={openChat}
              className="px-5 py-2 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg text-white"
              style={{ backgroundColor: C.crimson, fontFamily: F.mono, fontSize: '12px', fontWeight: 500 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              CHAT
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: THE HERO — "Scale Structure. Not Chaos."
          Background: Gallery White (#FFFFFF)
      ═══════════════════════════════════════════════════════════ */}
      <section
        data-testid="boltrunway-hero"
        className="relative flex flex-col items-center justify-center"
        style={{ backgroundColor: C.white, paddingTop: '180px', paddingBottom: '140px', minHeight: '100vh' }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-[800px] mx-auto">
            <motion.p
              data-testid="boltrunway-hero-eyebrow"
              className="mb-8 uppercase tracking-wider"
              style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.crimson, letterSpacing: '0.05em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              FOUNDERPLANE STRATEGIC CONSULTING
            </motion.p>

            <motion.h1
              className="mb-8"
              style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 1.1, color: C.jetBlack }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Scale Structure. Not Chaos.
            </motion.h1>

            <motion.p
              className="mx-auto mb-12"
              style={{ fontFamily: F.inter, fontWeight: 400, fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.5, maxWidth: '640px', color: C.graphite }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Growth doesn't fix broken systems; it exposes them. We install the strategic infrastructure you need to handle speed before you accelerate.
            </motion.p>

            <motion.button
              data-testid="boltrunway-hero-cta"
              onClick={openChat}
              className="px-8 py-4 rounded-full flex items-center gap-3 mx-auto mb-6 text-white"
              style={{ backgroundColor: C.crimson, fontFamily: F.mono, fontWeight: 500, fontSize: '15px', letterSpacing: '0.02em' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              DEPLOY THE ARCHITECTURE
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.p
              style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey, marginTop: '24px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              For revenue-generating founders ready to scale without breaking.
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
        data-testid="boltrunway-diagnosis"
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
                  style={{ fontFamily: F.mono, fontSize: '14px', color: C.crimson, letterSpacing: '0.05em' }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  THE SCALING GAP
                </motion.p>
                <h2 style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', letterSpacing: '-0.02em', color: C.jetBlack, lineHeight: 1.15 }}>
                  <WordReveal text="The Dangerous Stage Between Startup and Scaleup." delay={0.1} />
                </h2>
                <motion.p
                  className="mt-6"
                  style={{ fontFamily: F.inter, fontSize: '18px', lineHeight: 1.6, color: C.graphite, maxWidth: '400px' }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  You have validated your product. Revenue is coming in. But suddenly, decisions feel heavier, margins fluctuate, and you have become the bottleneck.
                </motion.p>
              </div>

              {/* Right Column (60%) — Scrolling Glass Box Cards */}
              <div className="md:col-span-3 space-y-6">
                {[
                  { title: 'The Founder Bottleneck.', body: 'You are involved in every decision. The business cannot grow faster than your personal energy, and you are running out of hours.', Icon: DiagnosisIcons[0] },
                  { title: 'Fragile Margins.', body: 'Revenue is up, but profit is unpredictable. You are scaling activity, but you aren\'t scaling efficiency.', Icon: DiagnosisIcons[1] },
                  { title: 'Operational Chaos.', body: 'What worked at \u20B910L/month breaks at \u20B91Cr/month. Your "hustle" systems are starting to crack under the pressure of volume.', Icon: DiagnosisIcons[2] },
                  { title: 'Strategic Drift.', body: 'You are reacting, not planning. You are so busy fighting fires today that you have no clear roadmap for next quarter.', Icon: DiagnosisIcons[3] },
                ].map((card, i) => (
                  <SpotlightCard
                    key={i}
                    className="rounded-2xl border"
                    style={{
                      backgroundColor: C.white,
                      borderColor: activeCard === i ? C.crimson : C.borderGrey,
                      boxShadow: activeCard === i ? '0 20px 40px rgba(0,0,0,0.06)' : '0px 4px 24px rgba(0, 0, 0, 0.04)',
                      opacity: activeCard === i ? 1 : 0.55,
                      padding: '40px',
                      marginBottom: '0',
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
        data-testid="boltrunway-truth"
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ backgroundColor: C.black, padding: '160px 0' }}
      >
        {/* Crimson glow — faint warning light in the dark */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(215,0,64,0.10) 0%, transparent 70%)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-[900px] mx-auto">
            <motion.p
              className="uppercase tracking-wider mb-8"
              style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.crimson, letterSpacing: '0.05em' }}
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
              "Most businesses don't fail because they lack ambition. They fail because they speed up before they buckle up."
            </motion.h2>

            <RevealText delay={0.6}>
              <p style={{ fontFamily: F.inter, fontSize: 'clamp(16px, 2vw, 20px)', color: C.faintGrey, marginTop: '40px' }}>
                Before you accelerate, you must ensure the machine is built to handle the speed.
              </p>
            </RevealText>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: THE OWNERSHIP — "Enterprise Thinking. Founder Speed."
          Background: Gallery White (#FFFFFF)
      ═══════════════════════════════════════════════════════════ */}
      <section
        data-testid="boltrunway-ownership"
        className="relative"
        style={{ backgroundColor: C.white, padding: '140px 0' }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-[800px] mx-auto">
            <motion.p
              className="uppercase tracking-wider mb-4 text-center"
              style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.crimson, letterSpacing: '0.05em' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE SCOPE
            </motion.p>

            <h2 className="text-center" style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', color: C.jetBlack, lineHeight: 1.15, marginBottom: '20px' }}>
              <WordReveal text="Enterprise Thinking. Founder Speed." />
            </h2>

            <RevealText delay={0.2}>
              <p className="text-center mx-auto" style={{ fontFamily: F.inter, fontSize: '20px', lineHeight: 1.5, color: C.graphite, maxWidth: '600px', marginBottom: '56px' }}>
                BoltRunway is not a marketing agency or a generic coaching program. It is a strategic installation of the 5 core systems needed to scale.
              </p>
            </RevealText>

            {/* What We Install */}
            <div className="mb-12">
              <h3 className="mb-6" style={{ fontFamily: F.inter, fontWeight: 700, fontSize: '18px', color: C.jetBlack }}>
                What We Install
              </h3>
              <div className="space-y-6">
                {[
                  { title: 'Strategic Growth Architecture:', body: 'Your 6\u201312 month roadmap defined with precision focus.' },
                  { title: 'Revenue Alignment:', body: 'Restructuring unit economics and pricing for profit.' },
                  { title: 'Operational Systems:', body: 'Building the SOPs and workflows that allow execution without you.' },
                  { title: 'Organizational Design:', body: 'Mapping your hiring, delegation, and leadership evolution.' },
                  { title: 'Scale Readiness:', body: 'Stress-testing your business model before adding speed.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <div className="w-6 h-6 mr-4 mt-0.5 flex-shrink-0 rounded-full flex items-center justify-center" style={{ backgroundColor: C.crimson }}>
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
                We are not your outsourced marketing team, and we do not run your daily ads. We build the strategic systems that make those teams effective.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: THE ARCHITECTURE — 6-Phase Vertical Stack
          Background: Mist Grey (#F5F5F7)
      ═══════════════════════════════════════════════════════════ */}
      <section data-testid="boltrunway-architecture" className="relative" style={{ backgroundColor: C.mist, padding: '140px 0' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-20">
              <motion.p
                className="uppercase tracking-wider mb-4"
                style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.crimson, letterSpacing: '0.05em' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                THE SYSTEM
              </motion.p>
              <h2 style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', color: C.jetBlack, lineHeight: 1.15, marginBottom: '20px' }}>
                <WordReveal text="The 6-Phase Scale Infrastructure." />
              </h2>
              <RevealText delay={0.2}>
                <p className="mx-auto" style={{ fontFamily: F.inter, fontSize: '18px', lineHeight: 1.5, color: C.graphite, maxWidth: '600px' }}>
                  We don't give you random advice. We follow a structured engineering process to reinforce your business from the bottom up.
                </p>
              </RevealText>
            </div>

            {/* 6 Phases with vertical connector */}
            <div className="relative">
              {/* Vertical connector line */}
              <div
                className="absolute left-[23px] top-[20px] bottom-[20px] w-px"
                style={{ backgroundColor: C.borderGrey }}
              />

              <div className="space-y-[60px]">
                {[
                  { phase: '01', title: 'Scale Readiness Diagnostic.', body: 'We identify the cracks before growth exposes them. A full structural assessment of your revenue, operations, and risks.' },
                  { phase: '02', title: 'Strategic Growth Architecture.', body: 'We design the roadmap. We define exactly what to scale, what to eliminate, and where to concentrate resources.' },
                  { phase: '03', title: 'Financial Structuring.', body: 'We fix the money model. We refine pricing, margins, and forecasting to ensure profitable scalability.' },
                  { phase: '04', title: 'Operational Optimization.', body: 'We remove the friction. We install the workflows and accountability systems that create stability during growth.' },
                  { phase: '05', title: 'Leadership Design.', body: 'We replace "hero mode" with structure. We define the org chart, hiring roadmap, and delegation pathways.' },
                  { phase: '06', title: 'Change Advisory.', body: 'We guide the transition. As you execute, we provide high-level strategic oversight to keep the expansion controlled.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-6 relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                  >
                    {/* Numbered circle node */}
                    <div
                      className="w-[48px] h-[48px] rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                      style={{
                        border: `2px solid ${C.crimson}`,
                        backgroundColor: C.mist,
                      }}
                    >
                      <span style={{ fontFamily: F.mono, fontWeight: 600, fontSize: '14px', color: C.crimson }}>
                        {item.phase}
                      </span>
                    </div>

                    <div className="pt-2">
                      <h3 style={{ fontFamily: F.inter, fontWeight: 600, fontSize: '18px', color: C.jetBlack, marginBottom: '6px' }}>
                        {item.title}
                      </h3>
                      <p style={{ fontFamily: F.inter, fontSize: '15px', lineHeight: 1.6, color: C.graphite }}>
                        {item.body}
                      </p>
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
      <section data-testid="boltrunway-requirements" className="relative" style={{ backgroundColor: C.mist, padding: '140px 0' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-[60px]">
              <motion.p
                className="uppercase tracking-wider mb-4"
                style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.crimson, letterSpacing: '0.05em' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                OPERATIONAL THRESHOLDS
              </motion.p>
              <h2 style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', color: C.jetBlack, lineHeight: 1.15 }}>
                <WordReveal text="Is BoltRunway Right For You?" />
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-20">
              {/* Compatible Column */}
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }}>
                <h3 style={{ fontFamily: F.inter, fontWeight: 700, fontSize: '20px', color: C.jetBlack, marginBottom: '28px' }}>Compatible</h3>
                <div className="space-y-5">
                  {[
                    'You are a revenue-generating startup or D2C brand.',
                    'You are hiring teams and facing operational complexity.',
                    'You feel "stuck" in the day-to-day operations.',
                    'You are ready to invest in long-term stability.',
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start group cursor-default"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className="w-6 h-6 mr-4 mt-0.5 flex-shrink-0 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: C.crimson }}
                      >
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
                    'You are still in the "Idea Phase" (Pre-Revenue).',
                    'You want a "Done-For-You" marketing agency.',
                    'You are looking for cheap, generic coaching.',
                    'You are unwilling to change how you work.',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start" style={{ opacity: 0.7 }}>
                      <div
                        className="w-6 h-6 mr-4 mt-0.5 flex-shrink-0 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: C.borderGrey }}
                      >
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
          SECTION 7: THE DIAGNOSTIC — Stage Clarity Check Gateway
          Background: Gallery White (#FFFFFF)
      ═══════════════════════════════════════════════════════════ */}
      <section data-testid="boltrunway-diagnostic" className="relative overflow-hidden" style={{ backgroundColor: C.white, padding: '140px 0' }}>
        {/* Faint decision tree watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ opacity: 0.04 }}>
          <svg width="600" height="400" viewBox="0 0 600 400" fill="none" stroke={C.crimson} strokeWidth="1">
            <circle cx="300" cy="40" r="20" />
            <line x1="300" y1="60" x2="300" y2="100" />
            <line x1="300" y1="100" x2="150" y2="160" />
            <line x1="300" y1="100" x2="450" y2="160" />
            <circle cx="150" cy="170" r="15" />
            <circle cx="450" cy="170" r="15" />
            <line x1="150" y1="185" x2="80" y2="240" />
            <line x1="150" y1="185" x2="220" y2="240" />
            <line x1="450" y1="185" x2="380" y2="240" />
            <line x1="450" y1="185" x2="520" y2="240" />
            <circle cx="80" cy="250" r="12" />
            <circle cx="220" cy="250" r="12" />
            <circle cx="380" cy="250" r="12" />
            <circle cx="520" cy="250" r="12" />
            <line x1="80" y1="262" x2="80" y2="300" />
            <line x1="220" y1="262" x2="220" y2="300" />
            <line x1="380" y1="262" x2="380" y2="300" />
            <line x1="520" y1="262" x2="520" y2="300" />
            <rect x="55" y="300" width="50" height="30" rx="5" />
            <rect x="195" y="300" width="50" height="30" rx="5" />
            <rect x="355" y="300" width="50" height="30" rx="5" />
            <rect x="495" y="300" width="50" height="30" rx="5" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-[800px] mx-auto text-center">
            <motion.p
              className="uppercase tracking-wider mb-4"
              style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.crimson, letterSpacing: '0.05em' }}
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
              Not sure if you're ready to scale?
            </motion.h2>

            <RevealText delay={0.2}>
              <p className="mx-auto" style={{ fontFamily: F.inter, fontSize: '18px', lineHeight: 1.6, color: C.graphite, maxWidth: '600px', marginBottom: '48px' }}>
                Scaling a broken foundation is the fastest way to collapse. If you are unsure if BoltRunway is right for you, identify your exact scaling bottleneck in 2 minutes with our Stage Clarity Check.
              </p>
            </RevealText>

            <motion.button
              data-testid="boltrunway-find-stage-btn"
              className="px-8 py-4 rounded-full flex items-center gap-3 mx-auto"
              style={{
                border: `2px solid ${C.crimson}`,
                color: C.crimson,
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
              whileHover={{ scale: 1.05, backgroundColor: C.crimson, color: '#fff' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowStageClarityCheck(true)}
            >
              FIND YOUR STAGE
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
        data-testid="boltrunway-gateway"
        className="relative flex flex-col items-center justify-center"
        style={{ backgroundColor: C.black, padding: '160px 0' }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-[800px] mx-auto">
            <motion.p
              className="uppercase tracking-wider mb-8"
              style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.crimson, letterSpacing: '0.05em' }}
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
              Stop Scaling Chaos.
            </motion.h2>

            <RevealText delay={0.4}>
              <p className="mx-auto" style={{ fontFamily: F.inter, fontSize: '20px', lineHeight: 1.5, color: C.faintGrey, maxWidth: '600px', marginBottom: '48px' }}>
                If you are ready to build a business that can grow without breaking, request a diagnostic session. We will assess your scale readiness.
              </p>
            </RevealText>

            <motion.button
              data-testid="boltrunway-gateway-cta"
              onClick={openChat}
              className="px-10 py-5 rounded-full flex items-center gap-3 mx-auto mb-6 text-white"
              style={{ backgroundColor: C.crimson, fontFamily: F.mono, fontWeight: 500, fontSize: '15px', letterSpacing: '0.02em' }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              animate={{ scale: [1, 1.02, 1] }}
            >
              REQUEST DIAGNOSTIC SESSION
            </motion.button>

            <motion.p
              style={{ fontFamily: F.inter, fontStyle: 'italic', fontSize: '14px', color: C.mediumGrey, marginTop: '24px' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              We accept a limited number of consulting partners per quarter.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 9: SYSTEM FAQs — Accordion
          Background: Gallery White (#FFFFFF)
      ═══════════════════════════════════════════════════════════ */}
      <section data-testid="boltrunway-faq" className="relative" style={{ backgroundColor: C.white, padding: '140px 0' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-[60px]">
              <h2 style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', color: C.jetBlack, lineHeight: 1.15 }}>
                <WordReveal text="Common Questions." />
              </h2>
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              {[
                { q: 'Is BoltRunway a marketing agency?', a: 'No. Agencies focus on traffic. We focus on the infrastructure that handles the traffic. We fix the business model, operations, and margins\u2014not just the ads.' },
                { q: 'Is this for early-stage founders?', a: 'No. BoltRunway is exclusively for post-validation founders who are generating revenue and facing the complexity of growth. If you are still in the "Idea Phase," this system is too advanced.' },
                { q: 'How is this different from a Mastermind or Coach?', a: 'Masterminds offer community and motivation. BoltRunway offers engineered consulting and structural implementation. We build systems; we don\'t just chat.' },
                { q: 'What is the "Scale Readiness Diagnostic"?', a: 'It is our proprietary audit process where we stress-test your current revenue model and operations to find the breaking points before you add more weight.' },
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
                    data-testid={`boltrunway-faq-${i}`}
                    className="w-full py-6 flex items-center justify-between text-left group"
                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  >
                    <span
                      style={{
                        fontFamily: F.inter,
                        fontWeight: 500,
                        fontSize: '18px',
                        color: openFAQ === i ? C.crimson : C.jetBlack,
                        transition: 'color 0.2s',
                      }}
                      className="pr-4"
                    >
                      {item.q}
                    </span>
                    <motion.div animate={{ rotate: openFAQ === i ? 45 : 0 }} transition={{ duration: 0.2 }}>
                      <Plus className="w-5 h-5 flex-shrink-0" style={{ color: openFAQ === i ? C.crimson : C.lightGrey }} />
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
              <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }}>BoltRunway by FounderPlane</span>
            </Link>
            <div className="flex items-center gap-8">
              <Link to="/services/boltguider" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">BoltGuider</Link>
              <Link to="/services/brandtofly" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">BrandToFly</Link>
              <Link to="/services/d2cbolt" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">D2CBolt</Link>
              <Link to="/services/b2bbolt" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">B2BBolt</Link>
              <Link to="/services/scalerunway" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">ScaleRunway</Link>
              <Link to="/" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">FounderPlane</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default BoltRunway;
