import { motion } from "framer-motion";
import { Target, Cog, ListChecks, TrendingUp, ChevronRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Target,
    title: "Understand Your Stage",
    description: "Identify where your business actually is — not where you think it should be."
  },
  {
    number: "02",
    icon: Cog,
    title: "Get the Right System",
    description: "We connect you to the exact engine designed for your stage — no overlap, no premature systems."
  },
  {
    number: "03",
    icon: ListChecks,
    title: "Build in the Correct Order",
    description: "Execute with clarity, not chaos or premature scaling."
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Progress Without Chaos",
    description: "Move forward with structure that scales."
  }
];

const PlatformSection = () => {
  return (
    <section data-testid="index-platform" className="py-24 md:py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-y-1/2" />
      
      <div className="container relative z-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4"
            >
              The Platform
            </motion.span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-slate-900 mb-4">
              How <span className="text-primary">FounderPlane</span> Works
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              FounderPlane works as a guided platform, not a single service.
            </p>
          </motion.div>

          {/* Steps Flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-white rounded-2xl p-6 h-full border border-slate-200 hover:border-primary/40 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      {/* Number & Icon Row */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-5xl font-bold text-slate-100 font-display group-hover:text-primary/20 transition-colors duration-300">
                          {step.number}
                        </span>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                          <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Connector Arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ChevronRight className="w-6 h-6 text-primary/40" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Ecosystem Clarity Block */}
          <motion.div 
            className="relative overflow-hidden rounded-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_100%/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_100%/0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 p-10 text-center">
              <p className="text-2xl md:text-3xl font-bold text-white mb-3">
                One platform. Multiple systems. One clear path.
              </p>
              <p className="text-white/80 text-lg">
                The first step is knowing where you are right now.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
