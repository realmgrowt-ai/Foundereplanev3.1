import { Compass, Settings, Shield, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const principles = [
  { icon: Compass, text: "Stage-Based Decisions" },
  { icon: Settings, text: "Systems Over Hustle" },
  { icon: Shield, text: "Built for the Long Term" },
];

interface HeroSectionProps {
  onOpenDiagnostic?: () => void;
}

const HeroSection = ({ onOpenDiagnostic }: HeroSectionProps) => {
  return (
    <section data-testid="index-hero" className="relative min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Animated floating orbs - enhanced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-[10%] w-72 h-72 bg-primary/15 rounded-full blur-3xl"
          animate={{ 
            y: [0, -40, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-[15%] w-56 h-56 bg-purple-500/15 rounded-full blur-3xl"
          animate={{ 
            y: [0, 35, 0],
            x: [0, -25, 0],
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.5, 0.25]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-32 left-[20%] w-64 h-64 bg-emerald-500/12 rounded-full blur-3xl"
          animate={{ 
            y: [0, -30, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.45, 0.2]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-20 right-[25%] w-48 h-48 bg-amber-500/12 rounded-full blur-3xl"
          animate={{ 
            y: [0, 25, 0],
            x: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div 
          className="absolute top-1/3 left-[45%] w-40 h-40 bg-sky-500/10 rounded-full blur-3xl"
          animate={{ 
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.35, 0.15]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>
      
      {/* Animated floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-[15%] w-2 h-2 bg-primary/50 rounded-full"
          animate={{ y: [0, -120, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/3 right-[20%] w-3 h-3 bg-purple-400/40 rounded-full"
          animate={{ y: [0, -100, 0], x: [0, 20, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-[30%] w-2 h-2 bg-emerald-400/50 rounded-full"
          animate={{ y: [0, -80, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        />
        <motion.div 
          className="absolute top-1/2 right-[35%] w-1.5 h-1.5 bg-amber-400/50 rounded-full"
          animate={{ y: [0, -60, 0], x: [0, -15, 0], opacity: [0, 0.7, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-[15%] w-2.5 h-2.5 bg-sky-400/40 rounded-full"
          animate={{ y: [0, -90, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3.5 }}
        />
      </div>

      {/* Subtle grid pattern with pulse */}
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* Enhanced glowing accent ring behind content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] pointer-events-none">
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/8 via-purple-500/10 to-primary/8 blur-3xl"
          animate={{ 
            scale: [1, 1.08, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-10 rounded-full bg-gradient-to-br from-emerald-500/5 via-transparent to-amber-500/5 blur-2xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow - Enhanced tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center px-6 py-2.5 mb-6 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20"
          >
            <span className="text-primary font-medium text-sm md:text-base tracking-wide">
              Clarity first. → Systems next. → Growth after.
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-foreground">Don't Just Start a Business.</span>
            <br />
            <span className="text-foreground">Build It the </span>
            <span className="text-primary">Right Way.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A structured approach to help founders move from idea to scale — without chaos, guesswork, or wrong-stage decisions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 rounded-full text-lg shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 group"
              onClick={onOpenDiagnostic}
            >
              Find your stage
              <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              className="font-semibold px-8 py-6 rounded-full text-lg border-2 hover:bg-muted hover:scale-105 transition-all duration-300"
              onClick={() => {
                document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore the platform
            </Button>
          </motion.div>

          {/* Principles Row - Staggered */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            {principles.map((principle, index) => (
              <motion.div 
                key={index} 
                className="flex items-center gap-3 text-muted-foreground group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <principle.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm md:text-base font-medium group-hover:text-foreground transition-colors">{principle.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
