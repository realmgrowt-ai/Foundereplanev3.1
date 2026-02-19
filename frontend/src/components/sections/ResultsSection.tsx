import { Users, TrendingUp, Zap, Gift, Award } from "lucide-react";
import { motion } from "framer-motion";

const proofBlocks = [
  {
    icon: Users,
    title: "Trusted by Ambitious Founders",
    description: "Used by founders, operators, and business owners building across multiple stages."
  },
  {
    icon: TrendingUp,
    title: "₹50 Cr+ Revenue Engineered",
    description: "Systems and strategies applied across businesses generating cumulative real revenue."
  },
  {
    icon: Zap,
    title: "From Chaos to Clarity — Fast",
    description: "Founders move from confusion to a clear execution path in weeks, not months."
  },
  {
    icon: Gift,
    title: "Startup & Partner Benefits Available",
    description: "Access to tools, platforms, and partner advantages designed to reduce early-stage burn."
  }
];

const ResultsSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--primary)/0.03)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(221_73%_49%/0.03)_0%,transparent_50%)]" />
      
      {/* Floating orbs */}
      <motion.div 
        className="absolute top-20 left-[5%] w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-20 right-[10%] w-56 h-56 bg-primary/5 rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, 25, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          {/* Section Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-4 py-2 mb-6"
          >
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Track Record</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 mb-4">
            Proven. Practical. <span className="text-primary">Trusted by Builders.</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            FounderPlane systems are designed from real execution — not theory, not templates, not trends.
          </p>
        </motion.div>

        {/* Proof Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {proofBlocks.map((block, index) => {
            const Icon = block.icon;
            return (
              <motion.div 
                key={index}
                className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:border-primary/40 transition-all duration-500 group overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ 
                  y: -4,
                  boxShadow: "0 20px 40px -15px rgba(33, 87, 217, 0.15)"
                }}
              >
                {/* Shimmer border on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer bg-[length:200%_100%]" />
                </div>
                
                {/* Icon with animation */}
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-all relative z-10"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className="w-7 h-7 text-primary" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">
                  {block.title}
                </h3>
                <p className="text-slate-600 relative z-10">
                  {block.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
