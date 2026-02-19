import { Search, Puzzle, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Understand Your Stage",
    description: "We diagnose where your business truly is.",
  },
  {
    icon: Puzzle,
    number: "02",
    title: "Install the Right Engine",
    description: "Based on your stage, we connect you to the system designed to solve that exact problem.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Move Forward With Clarity",
    description: "You execute with defined priorities, structure, and momentum.",
  },
];

const FounderSection = () => {
  return (
    <section id="founder" data-testid="index-founder" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(221_73%_49%/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(221_73%_49%/0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="container relative z-10 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 mb-4">
              How We <span className="text-primary">Work With You</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              FounderPlane works as a guided partnership — clear steps, clear systems, no chaos.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Connector Line (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[calc(50%+60px)] w-[calc(100%-60px)] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
                )}
                
                <div className="bg-slate-50 rounded-2xl p-8 h-full border border-slate-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                  {/* Step Number & Icon */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center group-hover:bg-primary/15 group-hover:border-primary/50 transition-all duration-300">
                      <step.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                    </div>
                    <span className="text-5xl font-bold font-display text-slate-200 group-hover:text-primary/20 transition-colors duration-300">
                      {step.number}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold font-display text-slate-900 mb-4 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Positioning Block */}
          <motion.div 
            className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-slate-700 text-lg">
              FounderPlane removes confusion first — so execution actually works.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
