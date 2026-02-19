import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PhoneInput from 'react-phone-number-input';
import '@/components/StageClarityCheck/phone-input-styles.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName?: string;
  sourcePage?: string;
}

const stages = [
  { value: 'idea', label: 'Just an idea' },
  { value: 'early_launch', label: 'Early launch / Pre-revenue' },
  { value: 'revenue', label: 'Generating revenue' },
  { value: 'scaling', label: 'Scaling / Growth stage' },
  { value: 'established', label: 'Established business' },
];

const services = [
  { value: 'BoltGuider', label: 'BoltGuider — Clarity & Direction' },
  { value: 'BrandToFly', label: 'BrandToFly — Brand & Positioning' },
  { value: 'D2CBolt', label: 'D2CBolt — D2C Growth System' },
  { value: 'B2BBolt', label: 'B2BBolt — B2B Growth System' },
  { value: 'BoltRunway', label: 'BoltRunway — Operations' },
  { value: 'ScaleRunway', label: 'ScaleRunway — Scale & Exit' },
  { value: 'unsure', label: "Not sure yet — help me decide" },
];

const LeadCaptureModal = ({ isOpen, onClose, serviceName, sourcePage }: LeadCaptureModalProps) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    startup_stage: '',
    service_interest: serviceName || '',
    message: '',
  });
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
        body: JSON.stringify({ ...form, source_page: sourcePage || 'unknown' }),
      });

      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({ name: '', email: '', phone: '', company: '', startup_stage: '', service_interest: serviceName || '', message: '' });
    setSubmitted(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const content = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          data-testid="lead-capture-modal"
        >
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            data-testid="lead-modal-close"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>

          <div className="p-8 md:p-10">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
                data-testid="lead-success-message"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                  <ArrowRight className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  We'll be in touch.
                </h3>
                <p className="text-slate-500 mb-6">
                  Our team will review your request and reach out within 24 hours.
                </p>
                <Button onClick={handleClose} className="rounded-full px-8 bg-slate-900 hover:bg-slate-800">
                  Close
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-widest text-emerald-600 font-mono mb-2">
                    Discovery Session
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Let's map your growth plan.
                  </h3>
                  <p className="text-slate-500 text-sm mt-2">
                    Tell us about your business and we'll design a custom deployment plan.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lead-name" className="text-slate-600 text-sm mb-1.5 block">Name *</Label>
                      <Input
                        id="lead-name"
                        data-testid="lead-name-input"
                        value={form.name}
                        onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Your name"
                        className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lead-company" className="text-slate-600 text-sm mb-1.5 block">Company</Label>
                      <Input
                        id="lead-company"
                        data-testid="lead-company-input"
                        value={form.company}
                        onChange={(e) => setForm(p => ({ ...p, company: e.target.value }))}
                        placeholder="Brand / Company"
                        className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lead-email" className="text-slate-600 text-sm mb-1.5 block">Email *</Label>
                    <Input
                      id="lead-email"
                      data-testid="lead-email-input"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@company.com"
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-slate-600 text-sm mb-1.5 block">Phone / WhatsApp</Label>
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="IN"
                      value={form.phone}
                      onChange={(v) => setForm(p => ({ ...p, phone: v || '' }))}
                      className="phone-input-wrapper-light"
                      inputComponent={Input}
                      style={{ display: 'flex', gap: '0.5rem' }}
                      numberInputProps={{
                        className: 'flex-1 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-600 text-sm mb-1.5 block">Startup Stage</Label>
                      <select
                        data-testid="lead-stage-select"
                        value={form.startup_stage}
                        onChange={(e) => setForm(p => ({ ...p, startup_stage: e.target.value }))}
                        className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        <option value="">Select stage...</option>
                        {stages.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-slate-600 text-sm mb-1.5 block">Interested In</Label>
                      <select
                        data-testid="lead-service-select"
                        value={form.service_interest}
                        onChange={(e) => setForm(p => ({ ...p, service_interest: e.target.value }))}
                        className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        <option value="">Select service...</option>
                        {services.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-600 text-sm mb-1.5 block">Anything else? (optional)</Label>
                    <textarea
                      data-testid="lead-message-input"
                      value={form.message}
                      onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us about your biggest challenge right now..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button
                    type="submit"
                    data-testid="lead-submit-btn"
                    disabled={submitting || !form.name.trim() || !form.email.trim()}
                    className="w-full rounded-full py-6 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                    ) : (
                      <>Request Discovery Session <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};

export default LeadCaptureModal;
