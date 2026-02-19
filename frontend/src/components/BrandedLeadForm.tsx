import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Plus, type LucideIcon } from 'lucide-react';

const F = {
  playfair: "'Playfair Display', serif",
  inter: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

interface BrandedLeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  brandColor: string;
  brandIcon: LucideIcon;
  eyebrowText?: string;
  headlineText?: string;
  descriptionText?: string;
  submitText?: string;
  serviceName: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const BrandedLeadForm = ({
  isOpen,
  onClose,
  brandName,
  brandColor,
  brandIcon: BrandIcon,
  eyebrowText = 'Discovery Session',
  headlineText,
  descriptionText,
  submitText,
  serviceName,
}: BrandedLeadFormProps) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const headline = headlineText || `Let\u2019s discuss ${brandName}.`;
  const description = descriptionText || `Tell us about your business and we\u2019ll design a plan tailored to your needs.`;
  const submit = submitText || `Request ${brandName} Session`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, service_interest: serviceName, source_page: serviceName }),
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
        data-testid={`${serviceName.toLowerCase()}-form-overlay`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-2xl overflow-hidden"
          style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', boxShadow: '0 40px 80px rgba(0,0,0,0.15)' }}
          data-testid={`${serviceName.toLowerCase()}-lead-form-modal`}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrandIcon className="w-5 h-5" style={{ color: brandColor }} />
              <span className="font-bold text-sm" style={{ fontFamily: F.inter, color: '#1D1D1F' }}>{brandName}</span>
            </div>
            <button
              onClick={handleClose}
              data-testid={`${serviceName.toLowerCase()}-form-close`}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-slate-100"
              style={{ color: '#86868B' }}
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
                data-testid={`${serviceName.toLowerCase()}-form-success`}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: brandColor + '15' }}
                >
                  <Check className="w-6 h-6" style={{ color: brandColor }} />
                </div>
                <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: F.playfair, color: '#1D1D1F' }}>
                  We'll be in touch.
                </h3>
                <p className="text-sm mb-6" style={{ color: '#424245' }}>
                  Our team will review your request and reach out within 24 hours.
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ background: brandColor }}
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: F.mono, color: brandColor }}>
                    {eyebrowText}
                  </p>
                  <h3 className="text-xl font-semibold" style={{ fontFamily: F.playfair, color: '#1D1D1F' }}>
                    {headline}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#424245' }}>
                    {description}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: '#424245' }}>Name *</label>
                      <input
                        data-testid={`${serviceName.toLowerCase()}-form-name`}
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Your name"
                        required
                        className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                        style={{ border: '1px solid #E5E5E5', color: '#1D1D1F', fontFamily: F.inter }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = brandColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${brandColor}15`; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: '#424245' }}>Company</label>
                      <input
                        data-testid={`${serviceName.toLowerCase()}-form-company`}
                        value={form.company}
                        onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                        placeholder="Your company"
                        className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                        style={{ border: '1px solid #E5E5E5', color: '#1D1D1F', fontFamily: F.inter }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = brandColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${brandColor}15`; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: '#424245' }}>Email *</label>
                    <input
                      data-testid={`${serviceName.toLowerCase()}-form-email`}
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="you@company.com"
                      required
                      className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                      style={{ border: '1px solid #E5E5E5', color: '#1D1D1F', fontFamily: F.inter }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = brandColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${brandColor}15`; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: '#424245' }}>Phone (optional)</label>
                    <input
                      data-testid={`${serviceName.toLowerCase()}-form-phone`}
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                      className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                      style={{ border: '1px solid #E5E5E5', color: '#1D1D1F', fontFamily: F.inter }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = brandColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${brandColor}15`; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: '#424245' }}>Message (optional)</label>
                    <textarea
                      data-testid={`${serviceName.toLowerCase()}-form-message`}
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us about your situation..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all resize-none"
                      style={{ border: '1px solid #E5E5E5', color: '#1D1D1F', fontFamily: F.inter }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = brandColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${brandColor}15`; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit"
                    data-testid={`${serviceName.toLowerCase()}-form-submit`}
                    disabled={submitting || !form.name.trim() || !form.email.trim()}
                    className="w-full py-3.5 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: brandColor, fontFamily: F.inter }}
                  >
                    {submitting ? 'Submitting...' : (<>{submit} <ArrowRight className="w-4 h-4" /></>)}
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

export default BrandedLeadForm;
