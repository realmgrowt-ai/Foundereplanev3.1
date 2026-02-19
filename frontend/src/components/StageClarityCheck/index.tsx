import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Compass, TrendingUp, Rocket, Route, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import './phone-input-styles.css';
import { StageClarityCheckProps, Answers, DiagnosticResult, UserDetails, Stage } from './types';
import { questions } from './questions';
import { interpretAnswers } from './logic';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

const TOTAL_QUESTIONS = 7;
const TOTAL_STEPS = 10; // Start + 7 Questions + Partial + Gate + Full

const StageClarityCheck = ({ isOpen, onClose }: StageClarityCheckProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1); // -1 means no option focused by default
  const [userDetails, setUserDetails] = useState<UserDetails>({ name: '', email: '', phone: '', country: 'IN' });
  const [detectedCountry, setDetectedCountry] = useState<string>('IN');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Detect country from IP on mount
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code || 'IN';
        setDetectedCountry(countryCode);
        setUserDetails(prev => ({ ...prev, country: countryCode }));
      } catch (error) {
        console.log('Country detection failed, defaulting to India');
        setDetectedCountry('IN');
        setUserDetails(prev => ({ ...prev, country: 'IN' }));
      }
    };
    detectCountry();
  }, []);

  // Reset state and manage focus when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      setCurrentStep(0);
      setAnswers({});
      setResult(null);
      setSelectedOption(null);
      setFocusedIndex(-1); // No option focused initially
      setUserDetails({ name: '', email: '', phone: '', country: detectedCountry });
      document.body.style.overflow = 'hidden';
      setTimeout(() => modalRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, detectedCountry]);

  useEffect(() => {
    setFocusedIndex(-1); // Set to -1 so no option is highlighted by default
  }, [currentStep]);

  const handleOptionSelect = useCallback((questionId: string, value: string) => {
    setSelectedOption(value);
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    setTimeout(() => {
      const questionIndex = currentStep - 1;
      if (questionIndex === TOTAL_QUESTIONS - 1) {
        // Last question - calculate result and go to partial
        setResult(interpretAnswers(newAnswers));
        setCurrentStep(TOTAL_QUESTIONS + 1); // Partial result step
      } else {
        setCurrentStep(prev => prev + 1);
      }
      setSelectedOption(null);
    }, 300);
  }, [currentStep, answers]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      // From partial result, go back to last question
      if (currentStep === TOTAL_QUESTIONS + 1) {
        setCurrentStep(TOTAL_QUESTIONS);
      } else if (currentStep === TOTAL_QUESTIONS + 2) {
        // From gate, go back to partial
        setCurrentStep(TOTAL_QUESTIONS + 1);
      } else {
        setCurrentStep(prev => prev - 1);
      }
      setSelectedOption(null);
    }
  }, [currentStep]);

  const handleStart = useCallback(() => setCurrentStep(1), []);

  const handleContinueToGate = useCallback(() => {
    setCurrentStep(TOTAL_QUESTIONS + 2); // Gate step
  }, []);

  const handleSubmitGate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (userDetails.name.trim() && userDetails.email.trim() && userDetails.phone.trim()) {
      setIsLoadingAI(true);
      setAiError(null);
      
      try {
        // Call AI-powered assessment API
        const response = await fetch(`${API_URL}/api/stage-assessment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers,
            user_details: {
              name: userDetails.name.trim(),
              email: userDetails.email.trim(),
              phone: userDetails.phone.trim(),
              country: userDetails.country,
            }
          })
        });
        
        if (!response.ok) {
          throw new Error('AI assessment failed');
        }
        
        const aiResult = await response.json();
        
        // Transform AI response to DiagnosticResult format
        const diagnosticResult: DiagnosticResult = {
          stage: aiResult.stage as Stage,
          bottleneck: aiResult.bottleneck,
          stageDescription: aiResult.stage_description,
          bottleneckDescription: aiResult.bottleneck_description,
          whatToAvoid: aiResult.what_to_avoid,
          recommendedSystem: aiResult.recommended_system,
          personalizedInsight: aiResult.personalized_insight,
          leadId: aiResult.lead_id,
        };
        
        setResult(diagnosticResult);
        setCurrentStep(TOTAL_QUESTIONS + 3); // Full result step
        
      } catch (error) {
        console.error('AI Assessment error:', error);
        // Fallback to local logic if AI fails
        const localResult = interpretAnswers(answers);
        setResult(localResult);
        setAiError('AI assessment unavailable. Showing standard results.');
        setCurrentStep(TOTAL_QUESTIONS + 3);
      } finally {
        setIsLoadingAI(false);
      }
    }
  }, [userDetails, answers]);

  const progressValue = currentStep === 0 ? 0 : Math.min((currentStep / TOTAL_STEPS) * 100, 100);
  const isQuestionStep = currentStep >= 1 && currentStep <= TOTAL_QUESTIONS;
  const isPartialStep = currentStep === TOTAL_QUESTIONS + 1;
  const isGateStep = currentStep === TOTAL_QUESTIONS + 2;
  const isFullResultStep = currentStep === TOTAL_QUESTIONS + 3;

  if (!isOpen) return null;

  const content = (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-900 flex flex-col outline-none"
        role="dialog"
        aria-modal="true"
        aria-label="Stage Clarity Check diagnostic"
      >
        <div className="absolute top-0 left-0 right-0 h-1">
          <Progress value={progressValue} className="h-1 rounded-none bg-slate-800" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="flex-1 overflow-y-auto px-4 py-12">
          <div className="min-h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <WelcomeScreen key="welcome" onStart={handleStart} />
              )}
              
              {isQuestionStep && (
                <QuestionScreen
                  key={`question-${currentStep}`}
                  question={questions[currentStep - 1]}
                  selectedOption={selectedOption}
                  onSelect={handleOptionSelect}
                  currentStep={currentStep}
                  totalQuestions={TOTAL_QUESTIONS}
                  focusedIndex={focusedIndex}
                  setFocusedIndex={setFocusedIndex}
                />
              )}
              
              {isPartialStep && result && (
                <PartialResultScreen
                  key="partial"
                  result={result}
                  onContinue={handleContinueToGate}
                />
              )}
              
              {isGateStep && (
                <SoftGateScreen
                  key="gate"
                  userDetails={userDetails}
                  setUserDetails={setUserDetails}
                  onSubmit={handleSubmitGate}
                  isLoading={isLoadingAI}
                />
              )}
              
              {isFullResultStep && result && (
                <FullResultScreen
                  key="full-result"
                  result={result}
                  userName={userDetails.name}
                  onClose={onClose}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {(isQuestionStep || isPartialStep || isGateStep) && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-slate-400 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};

// Welcome Screen
const WelcomeScreen = ({ onStart }: { onStart: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    className="max-w-2xl mx-auto text-center"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-8"
    >
      <Compass className="w-10 h-10 text-primary" />
    </motion.div>
    
    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
      Stage Clarity Check
    </h1>
    
    <p className="text-lg text-slate-300 mb-4">
      A simple, honest diagnostic to help you understand where you are and what might actually help.
    </p>
    
    <p className="text-slate-400 mb-8">
      7 questions · ~2 minutes · No email required to start
    </p>
    
    <Button
      size="lg"
      onClick={onStart}
      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 rounded-full text-lg"
    >
      Begin
      <ArrowRight className="w-5 h-5 ml-2" />
    </Button>
    
    <p className="text-sm text-slate-500 mt-6">
      This is not a sales funnel. Just a tool to help you think clearly.
    </p>
  </motion.div>
);

// Question Screen
const QuestionScreen = ({
  question,
  selectedOption,
  onSelect,
  currentStep,
  totalQuestions,
  focusedIndex,
  setFocusedIndex,
}: {
  question: { id: string; question: string; options: { value: string; label: string }[] };
  selectedOption: string | null;
  onSelect: (questionId: string, value: string) => void;
  currentStep: number;
  totalQuestions: number;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
}) => {
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (focusedIndex >= 0) {
      const timeout = setTimeout(() => {
        optionRefs.current[focusedIndex]?.focus();
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [focusedIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const optionsCount = question.options.length;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        setFocusedIndex((focusedIndex + 1) % optionsCount);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedIndex((focusedIndex - 1 + optionsCount) % optionsCount);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(question.id, question.options[focusedIndex].value);
        break;
    }
  }, [focusedIndex, question, onSelect, setFocusedIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto w-full px-4"
      role="radiogroup"
      aria-label={question.question}
    >
      <div className="mb-8">
        <p className="text-sm text-slate-400 mb-6 text-center">
          Question {currentStep} of {totalQuestions}
        </p>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 text-center leading-tight" id={`question-${question.id}`}>
          {question.question}
        </h2>
      </div>
      
      <div className="space-y-3" onKeyDown={handleKeyDown}>
        {question.options.map((option, index) => (
          <motion.button
            key={option.value}
            ref={(el) => { optionRefs.current[index] = el; }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(question.id, option.value)}
            onFocus={() => setFocusedIndex(index)}
            role="radio"
            aria-checked={selectedOption === option.value}
            aria-describedby={`question-${question.id}`}
            className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 outline-none ${
              selectedOption === option.value
                ? 'border-primary bg-primary/10 text-white shadow-lg shadow-primary/20'
                : focusedIndex === index
                ? 'border-primary/50 bg-slate-800 text-white ring-2 ring-primary/20'
                : 'border-slate-700/60 bg-slate-800/40 text-slate-200 hover:border-slate-600 hover:bg-slate-800/70'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="text-lg">{option.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Partial Result Screen (ungated)
const PartialResultScreen = ({
  result,
  onContinue,
}: {
  result: DiagnosticResult;
  onContinue: () => void;
}) => {
  const stageIcons: Record<Stage, typeof Compass> = {
    'Launch': Rocket,
    'Growth': TrendingUp,
    'Scale': Compass,
  };
  const StageIcon = stageIcons[result.stage];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto w-full text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6"
      >
        <StageIcon className="w-8 h-8 text-primary" />
      </motion.div>

      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">
        Here's what we found
      </h1>

      <div className="space-y-6 text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
        >
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Your Current Stage</p>
          <h3 className="text-2xl font-bold text-white">{result.stage}</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
        >
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Primary Bottleneck</p>
          <h3 className="text-xl font-bold text-white mb-2">{result.bottleneck}</h3>
          <p className="text-slate-300 text-sm">{result.bottleneckDescription}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10"
      >
        <Button
          size="lg"
          onClick={onContinue}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 rounded-full text-lg"
        >
          Get Full Results
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

// Soft Gate Screen
const SoftGateScreen = ({
  userDetails,
  setUserDetails,
  onSubmit,
  isLoading = false,
}: {
  userDetails: UserDetails;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}) => {
  const [emailError, setEmailError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Phone validation
  const validatePhone = (phone: string) => {
    if (!phone || phone.length < 8) {
      return 'Please enter a valid phone number';
    }
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setUserDetails(prev => ({ ...prev, email }));
    if (emailTouched) {
      const error = validateEmail(email);
      setEmailError(error);
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    const error = validateEmail(userDetails.email);
    setEmailError(error);
  };

  const handlePhoneChange = (value: string) => {
    setUserDetails(prev => ({ ...prev, phone: value || '' }));
    if (phoneTouched) {
      const error = validatePhone(value || '');
      setPhoneError(error);
    }
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    const error = validatePhone(userDetails.phone);
    setPhoneError(error);
  };

  const isFormValid = 
    userDetails.name.trim().length > 0 &&
    validateEmail(userDetails.email) === '' &&
    validatePhone(userDetails.phone) === '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto w-full text-center px-4"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Get your full clarity summary
      </h1>
      
      <p className="text-slate-300 mb-8 text-base">
        Complete stage analysis, what to avoid, and your recommended next step.
      </p>

      <form onSubmit={onSubmit} className="space-y-5 text-left">
        <div>
          <Label htmlFor="name" className="text-slate-300 text-sm mb-2 block">
            Name <span className="text-red-400">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            value={userDetails.name}
            onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Your name"
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-slate-300 text-sm mb-2 block">
            Email <span className="text-red-400">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={userDetails.email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            placeholder="you@example.com"
            className={`bg-slate-800 text-white placeholder:text-slate-500 transition-all ${
              emailError && emailTouched ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }`}
            required
          />
          {emailError && emailTouched && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-2"
            >
              {emailError}
            </motion.p>
          )}
        </div>
        
        <div>
          <Label htmlFor="phone" className="text-slate-300 text-sm mb-2 block">
            Phone / WhatsApp <span className="text-red-400">*</span>
          </Label>
          <PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry={userDetails.country as any}
            value={userDetails.phone}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            className="phone-input-wrapper"
            inputComponent={Input}
            style={{
              display: 'flex',
              gap: '0.5rem'
            }}
            numberInputProps={{
              className: `flex-1 bg-slate-800 text-white placeholder:text-slate-500 transition-all ${
                phoneError && phoneTouched ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`
            }}
          />
          {phoneError && phoneTouched && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-2"
            >
              {phoneError}
            </motion.p>
          )}
        </div>

        <div className="pt-6">
          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid || isLoading}
            className={`w-full font-semibold py-6 rounded-full text-lg transition-all duration-300 ${
              isFormValid && !isLoading
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing your responses...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Get My AI-Powered Results
              </>
            )}
          </Button>
          {!isFormValid && !isLoading && (
            <p className="text-slate-500 text-xs mt-3 text-center">
              Please complete all required fields
            </p>
          )}
          {isLoading && (
            <p className="text-primary/80 text-xs mt-3 text-center">
              Our AI is creating your personalized assessment...
            </p>
          )}
        </div>
      </form>

      <p className="text-xs text-slate-500 mt-6">
        We respect your privacy. Your details are secure.
      </p>
    </motion.div>
  );
};

// Full Result Screen with v2 Copy and Personalization
const FullResultScreen = ({
  result,
  userName,
  onClose,
}: {
  result: DiagnosticResult;
  userName: string;
  onClose: () => void;
}) => {
  const stageIcons: Record<Stage, typeof Compass> = {
    'Launch': Rocket,
    'Growth': TrendingUp,
    'Scale': Compass,
  };
  const StageIcon = stageIcons[result.stage];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto w-full px-4 pb-8"
    >
      {/* Header with Personalization */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4"
        >
          <StageIcon className="w-8 h-8 text-primary" />
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {userName}, this is your clarity summary
        </h1>
        <p className="text-slate-400 text-base">
          Based on your answers, here's where you are and what matters most right now.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Your Stage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
        >
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Your Stage</p>
          <h3 className="text-xl font-bold text-white mb-3">You're in the {result.stage} stage</h3>
          <p className="text-slate-300 leading-relaxed">{result.stageDescription}</p>
        </motion.div>

        {/* Section 2: Your Primary Bottleneck */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
        >
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Your Primary Bottleneck</p>
          <h3 className="text-xl font-bold text-white mb-3">Your biggest constraint right now: {result.bottleneck}</h3>
          <p className="text-slate-300 leading-relaxed">{result.bottleneckDescription}</p>
        </motion.div>

        {/* Section 2.5: AI Personalized Insight */}
        {result.personalizedInsight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-gradient-to-br from-blue-900/30 to-indigo-900/20 rounded-2xl p-6 border border-blue-700/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <p className="text-xs uppercase tracking-widest text-blue-400/80">AI-Powered Insight</p>
            </div>
            <p className="text-slate-200 leading-relaxed italic">{result.personalizedInsight}</p>
          </motion.div>
        )}

        {/* Section 3: What to Avoid Right Now */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-amber-900/20 rounded-2xl p-6 border border-amber-700/30"
        >
          <p className="text-xs uppercase tracking-widest text-amber-400/80 mb-2">What not to focus on yet</p>
          <p className="text-slate-200 leading-relaxed">{result.whatToAvoid}</p>
        </motion.div>

        {/* Section 4: Recommended Next System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-6 border border-primary/30"
        >
          <p className="text-xs uppercase tracking-widest text-primary/80 mb-2">Your recommended next step</p>
          <div className="flex items-center gap-3 mb-3">
            <Route className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-white">{result.recommendedSystem.name}</h3>
          </div>
          <p className="text-slate-300 leading-relaxed mb-6">{result.recommendedSystem.description}</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={result.recommendedSystem.route} onClick={onClose}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 rounded-full w-full sm:w-auto"
              >
                Explore {result.recommendedSystem.name}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StageClarityCheck;
