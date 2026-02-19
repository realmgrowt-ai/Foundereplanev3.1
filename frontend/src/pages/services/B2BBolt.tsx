import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Minus, Zap, Check } from 'lucide-react';
import founderplaneLogo from '@/assets/founderplane-logo-new.png';
import ScrollTracker from '@/components/ScrollTracker';

const B2BBOLT_SECTIONS = [
  { id: 'b2bbolt-hero', name: 'Hero' },
  { id: 'b2bbolt-diagnosis', name: 'Diagnosis' },
  { id: 'b2bbolt-truth', name: 'Truth' },
  { id: 'b2bbolt-ownership', name: 'Ownership' },
  { id: 'b2bbolt-architecture', name: 'Architecture' },
  { id: 'b2bbolt-requirements', name: 'Requirements' },
  { id: 'b2bbolt-diagnostic', name: 'Diagnostic' },
  { id: 'b2bbolt-gateway', name: 'Gateway' },
  { id: 'b2bbolt-faq', name: 'FAQ' },
];
import StageClarityCheck from '@/components/StageClarityCheck';

/* ═══════════════════════════════════════════════════════════════════
   DESIGN TOKENS — B2BBOLT IDENTITY
   ═══════════════════════════════════════════════════════════════════ */
const C = {
  orange: '#FF4400',
  white: '#FFFFFF',
  mist: '#F5F5F7',
  black: '#0A0A0B',
  jetBlack: '#1D1D1F',
  graphite: '#424245',
  darkGrey: '#444444',
  lightGrey: '#86868B',
  mediumGrey: '#666666',
  borderGrey: '#E5E5E5',
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
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,68,0,0.06), rgba(255,68,0,0.02) 40%, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-all duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          boxShadow: 'inset 0 0 0 1px rgba(255,68,0,0.12), inset 0 0 30px rgba(255,68,0,0.02)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const AnimatedBullet = ({ delay = 0 }: { delay?: number }) => (
  <div className="relative w-2 h-2 mr-3 mt-2 flex-shrink-0">
    <motion.div
      className="w-full h-full rounded-full"
      style={{ backgroundColor: C.orange }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring', stiffness: 400, damping: 15 }}
    />
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{ backgroundColor: C.orange }}
      animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.5 }}
    />
  </div>
);

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
   B2BBOLT BRANDED LEAD CAPTURE FORM (Catalyst Orange theme)
   ═══════════════════════════════════════════════════════════════════ */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

interface B2BBoltFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const B2BBoltLeadForm = ({ isOpen, onClose }: B2BBoltFormProps) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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
          service_interest: 'B2BBolt',
          source_page: 'B2BBolt',
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
          data-testid="b2bbolt-lead-form-modal"
        >
          {/* Header bar */}
          <div className="px-8 pt-8 pb-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: C.orange }} />
              <span className="font-bold text-sm" style={{ fontFamily: F.inter, color: C.jetBlack }}>B2BBolt</span>
            </div>
            <button
              onClick={handleClose}
              data-testid="b2bbolt-form-close"
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
                data-testid="b2bbolt-form-success"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: C.orange + '15' }}
                >
                  <Check className="w-6 h-6" style={{ color: C.orange }} />
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
                  style={{ background: C.orange }}
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: F.mono, color: C.orange }}>
                    Discovery Session
                  </p>
                  <h3 className="text-xl font-semibold" style={{ fontFamily: F.playfair, color: C.jetBlack }}>
                    Let's map your revenue plan.
                  </h3>
                  <p className="text-sm mt-1" style={{ color: C.graphite }}>
                    Tell us about your business and we'll design a custom deployment plan.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: C.graphite }}>Name *</label>
                      <input
                        data-testid="b2bbolt-form-name"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Your name"
                        required
                        className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                        style={{ border: `1px solid ${C.borderGrey}`, color: C.jetBlack, fontFamily: F.inter }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.orange}15`; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = C.borderGrey; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: C.graphite }}>Company</label>
                      <input
                        data-testid="b2bbolt-form-company"
                        value={form.company}
                        onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                        placeholder="Your company"
                        className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                        style={{ border: `1px solid ${C.borderGrey}`, color: C.jetBlack, fontFamily: F.inter }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.orange}15`; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = C.borderGrey; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: C.graphite }}>Email *</label>
                    <input
                      data-testid="b2bbolt-form-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="you@company.com"
                      required
                      className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                      style={{ border: `1px solid ${C.borderGrey}`, color: C.jetBlack, fontFamily: F.inter }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.orange}15`; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = C.borderGrey; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: C.graphite }}>Phone (optional)</label>
                    <input
                      data-testid="b2bbolt-form-phone"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                      className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                      style={{ border: `1px solid ${C.borderGrey}`, color: C.jetBlack, fontFamily: F.inter }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.orange}15`; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = C.borderGrey; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: C.graphite }}>What's your biggest challenge? (optional)</label>
                    <textarea
                      data-testid="b2bbolt-form-message"
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us about your biggest revenue bottleneck..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all resize-none"
                      style={{ border: `1px solid ${C.borderGrey}`, color: C.jetBlack, fontFamily: F.inter }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.orange}15`; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = C.borderGrey; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit"
                    data-testid="b2bbolt-form-submit"
                    disabled={submitting || !form.name.trim() || !form.email.trim()}
                    className="w-full py-3.5 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: C.orange, fontFamily: F.inter }}
                  >
                    {submitting ? 'Submitting...' : (
                      <>Request Discovery Session <ArrowRight className="w-4 h-4" /></>
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
   MAIN B2BBOLT COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const B2BBolt = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showStageClarityCheck, setShowStageClarityCheck] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const diagnosisRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
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
    <main className="min-h-screen overflow-x-hidden" style={{ fontFamily: F.inter }}>
      <ScrollTracker page="B2BBolt" sections={B2BBOLT_SECTIONS} />
      {/* Stage Clarity Check Modal */}
      <StageClarityCheck isOpen={showStageClarityCheck} onClose={() => setShowStageClarityCheck(false)} />

      {/* B2BBolt Branded Lead Form */}
      <B2BBoltLeadForm isOpen={showLeadForm} onClose={() => setShowLeadForm(false)} />

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
            <motion.div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.orange }}>
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <span style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: '18px', letterSpacing: '-0.02em', color: C.jetBlack }}>
              B2BBolt
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
              data-testid="b2bbolt-nav-chat-btn"
              onClick={openChat}
              className="px-5 py-2 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg text-white"
              style={{ backgroundColor: C.orange, fontFamily: F.mono, fontSize: '12px', fontWeight: 500 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              CHAT
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: THE HERO
      ═══════════════════════════════════════════════════════════ */}
      <section
        data-testid="b2bbolt-hero"
        className="relative flex flex-col items-center justify-center"
        style={{ backgroundColor: C.white, paddingTop: '200px', paddingBottom: '160px', minHeight: '100vh' }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-[800px] mx-auto">
            <motion.p
              data-testid="b2bbolt-hero-eyebrow"
              className="mb-8 uppercase tracking-wider"
              style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.orange, letterSpacing: '0.04em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              FOUNDERPLANE &mdash; B2B REVENUE SYSTEM
            </motion.p>

            <motion.h1
              className="mb-8"
              style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 1.1, color: C.jetBlack }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Make Revenue Predictable.
            </motion.h1>

            <motion.p
              className="mx-auto mb-12"
              style={{ fontFamily: F.inter, fontWeight: 400, fontSize: 'clamp(16px, 2vw, 19px)', lineHeight: 1.7, maxWidth: '640px', color: C.graphite }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              You have a great offer, but your sales are inconsistent. We install the complete system you need to generate leads, book meetings, and close deals—without the chaos.
            </motion.p>

            <motion.button
              data-testid="b2bbolt-hero-cta"
              onClick={openChat}
              className="px-8 py-4 rounded-full flex items-center gap-3 mx-auto mb-6 text-white"
              style={{ backgroundColor: C.orange, fontFamily: F.mono, fontWeight: 500, fontSize: '15px' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              DEPLOY THE SYSTEM
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.p
              style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Built for B2B founders ready to scale beyond word-of-mouth.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: THE DIAGNOSIS (Sticky Split-Screen)
      ═══════════════════════════════════════════════════════════ */}
      <section
        ref={diagnosisRef}
        data-testid="b2bbolt-diagnosis"
        className="relative min-h-[200vh]"
        style={{ backgroundColor: C.mist, padding: '140px 0' }}
      >
        <div className="sticky top-0 min-h-screen flex items-center">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-5 gap-12 items-start">
              {/* Left — Sticky headline */}
              <div className="md:col-span-2">
                <motion.p
                  className="uppercase tracking-widest mb-4"
                  style={{ fontFamily: F.mono, fontSize: '14px', color: C.orange, letterSpacing: '0.04em' }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  THE DIAGNOSIS
                </motion.p>
                <h2 style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.02em', color: C.jetBlack, lineHeight: 1.1 }}>
                  <WordReveal text="Growth Without a System is Just Luck." delay={0.1} />
                </h2>
                <motion.p
                  className="mt-6"
                  style={{ fontFamily: F.inter, fontSize: '18px', lineHeight: 1.6, color: C.graphite, maxWidth: '400px' }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  Most B2B founders rely on "hustle" and referrals. When marketing works, sales breaks. When leads come, conversion is weak. You don't need more effort. You need a process.
                </motion.p>
              </div>

              {/* Right — Scrolling Spotlight Cards */}
              <div className="md:col-span-3 space-y-6">
                {[
                  { title: 'Waiting for Referrals.', body: "You rely on word-of-mouth. If the phone doesn't ring, you don't grow. You have no control over your pipeline." },
                  { title: 'Competing on Price.', body: "You offer too many services. Because your value isn't sharp, clients treat you like a vendor, not a partner." },
                  { title: 'Closing on Feelings.', body: 'Your sales process is random. You hold great meetings, but deals stall because there is no structured way to close them.' },
                  { title: 'The Founder Trap.', body: 'If you stop selling, revenue stops. The business is entirely dependent on your personal energy.' },
                ].map((card, i) => (
                  <SpotlightCard
                    key={i}
                    className="p-8 rounded-2xl border"
                    style={{
                      backgroundColor: `rgba(255,255,255,${activeCard === i ? 0.98 : 0.7})`,
                      borderColor: activeCard === i ? C.orange + '30' : C.borderGrey,
                      boxShadow: activeCard === i ? '0 20px 40px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.04)',
                      opacity: activeCard === i ? 1 : 0.45,
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <span className="text-xs font-semibold mb-3 block" style={{ fontFamily: F.mono, color: C.orange }}>
                      0{i + 1}
                    </span>
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
          SECTION 3: THE TRUTH (Cinematic / Dark)
      ═══════════════════════════════════════════════════════════ */}
      <section
        data-testid="b2bbolt-truth"
        className="relative min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: C.black, padding: '160px 0' }}
      >
        {/* Subtle orange glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(255,68,0,0.06) 0%, transparent 70%)' }} />

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-[900px] mx-auto">
            <motion.p
              className="uppercase tracking-wider mb-8"
              style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.orange, letterSpacing: '0.04em' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE TRUTH
            </motion.p>

            <h2 style={{ fontFamily: F.playfair, fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(32px, 4.5vw, 56px)', color: C.white, lineHeight: 1.2, marginBottom: '32px' }}>
              <WordReveal
                text={`"Hiring a lead-gen agency won't fix your business. Scaling a broken process doesn't create growth. It creates chaos."`}
                delay={0.2}
              />
            </h2>

            <RevealText delay={0.6}>
              <p style={{ fontFamily: F.inter, fontSize: 'clamp(16px, 2vw, 20px)', color: C.lightGrey, marginTop: '40px' }}>
                You don't need more leads yet. You need the architecture to close them. System first. Campaign second.
              </p>
            </RevealText>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: THE OWNERSHIP
      ═══════════════════════════════════════════════════════════ */}
      <section
        data-testid="b2bbolt-ownership"
        className="relative"
        style={{ backgroundColor: C.white, padding: '160px 0' }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.p
              className="uppercase tracking-wider mb-4"
              style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.orange, letterSpacing: '0.04em' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE OWNERSHIP
            </motion.p>

            <h2 style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', color: C.jetBlack, lineHeight: 1.15, marginBottom: '20px' }}>
              <WordReveal text="What We Engineer. What We Don't." />
            </h2>

            <RevealText delay={0.2}>
              <p style={{ fontFamily: F.inter, fontSize: '17px', lineHeight: 1.7, color: C.darkGrey, marginBottom: '56px', maxWidth: '600px' }}>
                B2BBolt is a comprehensive revenue installation. We take ownership of your strategy, pipeline, and sales logic.
              </p>
            </RevealText>

            <div className="space-y-5 mb-12">
              {[
                { title: 'The Revenue Blueprint:', body: 'We define your offer, pricing, and market position.' },
                { title: 'The Pipeline Architecture:', body: 'We build the exact setup for generating leads (inbound & outbound).' },
                { title: 'The Sales Playbook:', body: 'We script your calls, emails, and closing frameworks.' },
                { title: 'The CRM Dashboard:', body: 'We set up the tracking to measure every dollar.' },
                { title: 'The Handoff Protocol:', body: 'We structure how you move clients from "Sales" to "Delivery."' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <AnimatedBullet delay={i * 0.1} />
                  <div>
                    <span style={{ fontFamily: F.inter, fontWeight: 600, fontSize: '16px', color: C.jetBlack }}>{item.title}</span>{' '}
                    <span style={{ fontFamily: F.inter, fontSize: '15px', lineHeight: 1.6, color: C.graphite }}>{item.body}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="pt-8 border-t"
              style={{ borderColor: C.borderGrey }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <p style={{ fontFamily: F.inter, fontStyle: 'italic', fontSize: '15px', color: C.mediumGrey, lineHeight: 1.7, maxWidth: '600px' }}>
                <strong style={{ fontWeight: 500 }}>The Boundary:</strong> We do not make the cold calls for you, and we do not manage your employees. We build the engine that makes those functions profitable.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: THE ARCHITECTURE (4-Phase Timeline)
      ═══════════════════════════════════════════════════════════ */}
      <section data-testid="b2bbolt-architecture" className="relative" style={{ backgroundColor: C.mist, padding: '160px 0' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-20">
              <motion.p
                className="uppercase tracking-wider mb-4"
                style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.orange, letterSpacing: '0.04em' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                THE ARCHITECTURE
              </motion.p>
              <h2 style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', color: C.jetBlack, lineHeight: 1.15, marginBottom: '20px' }}>
                <WordReveal text="The 4-Phase Revenue Infrastructure." />
              </h2>
              <RevealText delay={0.2}>
                <p style={{ fontFamily: F.inter, fontSize: '17px', lineHeight: 1.7, color: C.darkGrey, maxWidth: '600px', margin: '0 auto' }}>
                  We engineer your offer and sales psychology first, ensuring your business can convert strangers into high-ticket clients before we turn on the traffic.
                </p>
              </RevealText>
            </div>

            <div className="space-y-5">
              {[
                { phase: '01', title: 'The Offer Strategy', body: 'We refine exactly what you sell. We turn complex services into a high-ticket offer that is easy to buy.' },
                { phase: '02', title: 'Pipeline Engineering', body: 'We build the lead generation system. We set up the specific channels that bring qualified meetings to your calendar.' },
                { phase: '03', title: 'Sales Process Installation', body: 'We fix how you close. We install the scripts, proposal templates, and objection handlers needed to close deals predictably.' },
                { phase: '04', title: 'Operational Alignment', body: 'We organize the backend. We integrate your CRM and tracking so you know exactly what is working and where the money is.' },
              ].map((item, i) => (
                <SpotlightCard
                  key={i}
                  className="p-10 rounded-2xl border"
                  style={{ backgroundColor: C.white, borderColor: C.borderGrey, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                >
                  <motion.div
                    className="flex flex-col md:flex-row md:items-start gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                  >
                    <span style={{ fontFamily: F.mono, fontWeight: 600, fontSize: '28px', color: C.orange, flexShrink: 0, opacity: 0.7 }}>
                      {item.phase}
                    </span>
                    <div>
                      <h3 style={{ fontFamily: F.inter, fontWeight: 600, fontSize: '18px', color: C.jetBlack, marginBottom: '6px' }}>
                        {item.title}
                      </h3>
                      <p style={{ fontFamily: F.inter, fontSize: '15px', lineHeight: 1.6, color: C.graphite }}>
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

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6: SYSTEM REQUIREMENTS
      ═══════════════════════════════════════════════════════════ */}
      <section data-testid="b2bbolt-requirements" className="relative" style={{ backgroundColor: C.mist, padding: '160px 0' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <motion.p
                className="uppercase tracking-wider mb-4"
                style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.orange, letterSpacing: '0.04em' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                OPERATIONAL THRESHOLDS
              </motion.p>
              <h2 style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', color: C.jetBlack, lineHeight: 1.15, marginBottom: '20px' }}>
                <WordReveal text="System Compatibility." />
              </h2>
              <RevealText delay={0.2}>
                <p style={{ fontFamily: F.inter, fontSize: '17px', lineHeight: 1.7, color: C.darkGrey, maxWidth: '600px', margin: '0 auto' }}>
                  B2BBolt is built for scaling, not starting. This infrastructure requires a proven foundation.
                </p>
              </RevealText>
            </div>

            <div className="grid md:grid-cols-2 gap-20">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }}>
                <h3 style={{ fontFamily: F.inter, fontWeight: 600, fontSize: '18px', color: C.jetBlack, marginBottom: '28px' }}>Compatible</h3>
                <div className="space-y-5">
                  {[
                    'You run a B2B Agency, Consultancy, or SaaS.',
                    'You have already sold your product and validated demand.',
                    'You are tired of inconsistent revenue months.',
                    'You are ready to follow a proven system.',
                  ].map((item, i) => (
                    <motion.div key={i} className="flex items-start group" whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                      <div className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0">
                        <Plus className="w-4 h-4" style={{ color: C.orange }} strokeWidth={2.5} />
                      </div>
                      <span style={{ fontFamily: F.inter, fontSize: '15px', lineHeight: 1.6, color: C.jetBlack }}>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="opacity-70" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 0.7, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5 }}>
                <h3 style={{ fontFamily: F.inter, fontWeight: 600, fontSize: '18px', color: C.darkGrey, marginBottom: '28px' }}>Incompatible</h3>
                <div className="space-y-5">
                  {[
                    'You are still looking for your first product idea.',
                    'You want "passive income" without work.',
                    'You are unwilling to invest in paid tools or teams.',
                    'You sell low-ticket B2C products.',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0">
                        <Minus className="w-4 h-4" style={{ color: C.lightGrey }} strokeWidth={2.5} />
                      </div>
                      <span style={{ fontFamily: F.inter, fontSize: '15px', lineHeight: 1.6, color: C.darkGrey }}>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8: THE DIAGNOSTIC (Stage Clarity Check)
      ═══════════════════════════════════════════════════════════ */}
      <section data-testid="b2bbolt-diagnostic" className="relative" style={{ backgroundColor: C.mist, padding: '160px 0' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-[600px] mx-auto text-center">
            <motion.p
              className="uppercase tracking-wider mb-4"
              style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.orange, letterSpacing: '0.04em' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE DIAGNOSTIC
            </motion.p>
            <h2 style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', color: C.jetBlack, lineHeight: 1.15, marginBottom: '20px' }}>
              <WordReveal text="Not sure where you stand?" />
            </h2>
            <RevealText delay={0.2}>
              <p style={{ fontFamily: F.inter, fontSize: '17px', lineHeight: 1.7, color: C.darkGrey, marginBottom: '48px', maxWidth: '520px', margin: '0 auto 48px' }}>
                Scaling at the wrong stage wastes capital. Identify your exact bottleneck in 2 minutes.
              </p>
            </RevealText>
            <motion.button
              data-testid="b2bbolt-find-stage-btn"
              className="px-8 py-4 rounded-full flex items-center gap-3 mx-auto border-2"
              style={{ borderColor: C.orange, color: C.orange, backgroundColor: 'transparent', fontFamily: F.mono, fontWeight: 500, fontSize: '14px' }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.05, backgroundColor: C.orange, color: '#fff' }}
              onClick={() => setShowStageClarityCheck(true)}
            >
              FIND YOUR STAGE
            </motion.button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 9: THE GATEWAY (Final CTA / Dark)
      ═══════════════════════════════════════════════════════════ */}
      <section
        data-testid="b2bbolt-gateway"
        className="relative min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: C.black, padding: '160px 0' }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-[700px] mx-auto">
            <motion.p
              className="uppercase tracking-wider mb-8"
              style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.orange, letterSpacing: '0.04em' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              THE NEXT STEP
            </motion.p>
            <h2 style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(40px, 5vw, 60px)', color: C.white, lineHeight: 1.15, marginBottom: '24px' }}>
              <WordReveal text="Stop Guessing. Deploy Your Revenue Engine." />
            </h2>
            <RevealText delay={0.4}>
              <p style={{ fontFamily: F.inter, fontSize: '17px', lineHeight: 1.7, color: C.lightGrey, marginBottom: '48px', maxWidth: '560px', margin: '0 auto 48px' }}>
                If you are ready to stop relying on referrals and start engineering growth, request a discovery session. We will map out your custom deployment plan.
              </p>
            </RevealText>
            <motion.button
              data-testid="b2bbolt-gateway-cta"
              onClick={openChat}
              className="px-10 py-5 rounded-full flex items-center gap-3 mx-auto mb-10 text-white"
              style={{ backgroundColor: C.orange, fontFamily: F.mono, fontWeight: 500, fontSize: '15px' }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              REQUEST A DISCOVERY SESSION
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.p
              style={{ fontFamily: F.inter, fontStyle: 'italic', fontSize: '14px', color: C.lightGrey }}
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

      {/* ═══════════════════════════════════════════════════════════
          SECTION 10: SYSTEM FAQs
      ═══════════════════════════════════════════════════════════ */}
      <section data-testid="b2bbolt-faq" className="relative" style={{ backgroundColor: C.white, padding: '160px 0' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-20">
              <motion.p
                className="uppercase tracking-wider mb-4"
                style={{ fontFamily: F.mono, fontWeight: 500, fontSize: '14px', color: C.orange, letterSpacing: '0.04em' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                CLARITY & PARAMETERS
              </motion.p>
              <h2 style={{ fontFamily: F.playfair, fontWeight: 600, fontSize: 'clamp(36px, 4vw, 48px)', color: C.jetBlack, lineHeight: 1.15 }}>
                <WordReveal text="Common Questions." />
              </h2>
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              {[
                { q: 'Do you run our ads for us?', a: 'No. We are not a marketing agency. We build the system that allows you to run ads, generate leads, and close deals efficiently. We are builders, not retainers.' },
                { q: 'How long does it take?', a: 'The typical installation takes 8\u201312 weeks to go from "chaos" to a fully running revenue engine.' },
                { q: 'Do I need a sales team?', a: 'Not yet. B2BBolt is designed to work for founder-led sales first, then scale to a team once the system is proven.' },
                { q: 'What if I sell a service, not a product?', a: 'Perfect. B2BBolt is specifically designed for high-ticket service businesses, agencies, and consultancies.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="border-b"
                  style={{ borderColor: C.borderGrey }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <button
                    data-testid={`b2bbolt-faq-${i}`}
                    className="w-full py-6 flex items-center justify-between text-left group"
                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  >
                    <span
                      style={{
                        fontFamily: F.inter,
                        fontWeight: 500,
                        fontSize: '18px',
                        color: openFAQ === i ? C.orange : C.jetBlack,
                        transition: 'color 0.2s',
                      }}
                      className="pr-4"
                    >
                      {item.q}
                    </span>
                    <motion.div animate={{ rotate: openFAQ === i ? 45 : 0 }} transition={{ duration: 0.2 }}>
                      <Plus className="w-5 h-5 flex-shrink-0" style={{ color: C.orange }} />
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
              <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }}>B2BBolt by FounderPlane</span>
            </Link>
            <div className="flex items-center gap-8">
              <Link to="/services/boltguider" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">BoltGuider</Link>
              <Link to="/services/brandtofly" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">BrandToFly</Link>
              <Link to="/services/d2cbolt" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">D2CBolt</Link>
              <Link to="/" style={{ fontFamily: F.inter, fontSize: '14px', color: C.lightGrey }} className="hover:text-white transition-colors">FounderPlane</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default B2BBolt;
