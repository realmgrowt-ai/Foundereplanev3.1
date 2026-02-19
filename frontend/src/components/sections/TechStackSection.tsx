import { motion } from "framer-motion";
import { X, Check, Clock, DollarSign, Users, Target, Compass, Cog, Heart, Zap } from "lucide-react";

const problems = [
  { icon: Clock, text: "Wasting months following random advice" },
  { icon: DollarSign, text: "Spending on tools, ads, or hires without clarity" },
  { icon: Users, text: "Becoming the bottleneck too early" },
  { icon: Target, text: "Making critical decisions alone" },
];

const successes = [
  { icon: Compass, text: "Clear direction based on your actual stage" },
  { icon: Cog, text: "Systems that replace chaos" },
  { icon: Heart, text: "Decisions backed by structure, not emotion" },
  { icon: Zap, text: "A business that moves forward without burning you out" },
];

const TechStackSection = () => {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      {/* Decorative blur orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-10 w-40 h-40 bg-red-500/10 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-green-500/10 rounded-full blur-2xl" />

      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4"
          >
            The Difference
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white mb-4">
            Why Founders Choose <span className="text-primary">FounderPlane</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg">
            Because building a business isn't about doing more — it's about doing the right things, in the right order.
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* The Cost of Guessing */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/5 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 backdrop-blur-sm h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
                  <X className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-red-400">The Cost of Guessing</h3>
              </div>
              <ul className="space-y-5">
                {problems.map((problem, index) => {
                  const Icon = problem.icon;
                  return (
                    <motion.li
                      key={index}
                      className="flex items-start gap-4 group/item"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-red-500/20 transition-colors">
                        <Icon className="w-5 h-5 text-red-400/80" />
                      </div>
                      <span className="text-slate-300 text-lg leading-relaxed pt-1.5">{problem.text}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>

          {/* The Result of Engineering */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-600/5 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 backdrop-blur-sm h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center">
                  <Check className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-green-400">The Result of Engineering</h3>
              </div>
              <ul className="space-y-5">
                {successes.map((success, index) => {
                  const Icon = success.icon;
                  return (
                    <motion.li
                      key={index}
                      className="flex items-start gap-4 group/item"
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-green-500/20 transition-colors">
                        <Icon className="w-5 h-5 text-green-400/80" />
                      </div>
                      <span className="text-slate-300 text-lg leading-relaxed pt-1.5">{success.text}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Closing Statement */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto">
            FounderPlane is built for founders who want <span className="text-white font-semibold">clarity first</span>, <span className="text-white font-semibold">systems next</span>, and <span className="text-white font-semibold">growth that actually lasts</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;
