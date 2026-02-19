import { motion } from "framer-motion";
import { AlertCircle, ChevronDown } from "lucide-react";

const stages = [
  { name: "IDEA", description: "Where you begin" },
  { name: "CLARITY", description: "Define direction" },
  { name: "SYSTEMS", description: "Build foundation" },
  { name: "GROWTH", description: "Execute & expand" },
  { name: "SCALE", description: "Multiply impact" },
];

const bulletPoints = [
  "Starting execution before clarity",
  "Scaling before systems exist",
  "Copying advice from the wrong stage",
];

const ProblemSection = () => {
  return (
    <section data-testid="index-problem" className="py-24 md:py-32 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Floating orbs with animation */}
      <motion.div 
        className="absolute top-20 left-10 w-72 h-72 bg-red-500/8 rounded-full blur-3xl"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl"
        animate={{ 
          x: [0, -25, 0],
          y: [0, 25, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          x: [0, 40, 0],
          y: [0, -30, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      {/* Floating particles */}
      <motion.div 
        className="absolute top-32 right-1/4 w-3 h-3 bg-red-400/40 rounded-full"
        animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-40 left-1/4 w-2 h-2 bg-emerald-400/40 rounded-full"
        animate={{ y: [0, -80, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      <motion.div 
        className="absolute top-1/3 right-20 w-4 h-4 bg-primary/30 rounded-full"
        animate={{ y: [0, -60, 0], x: [0, 20, 0], opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      
      <div className="container relative z-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-2 mb-6"
            >
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-600">The Hidden Problem</span>
            </motion.div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-slate-900 leading-tight">
              Why Most Businesses Feel <span className="text-primary relative">
                Stuck
                <motion.span 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
              </span>
              <br className="hidden md:block" />
              <span className="text-slate-400"> — Even After Starting</span>
            </h2>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              {/* Eyebrow */}
              <p className="text-primary font-semibold mb-6 text-lg tracking-wide">
                The real problem isn't effort. It's order.
              </p>
              
              {/* Body Copy */}
              <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-8">
                Founders don't fail because they're lazy. They fail because they build out of sequence.
                Without clarity, every decision is a guess. Without systems, every win becomes fragile.
                When the order is wrong, effort turns into wasted motion.
              </p>
              
              {/* Bullet Points */}
              <div className="space-y-4 mb-10">
                {bulletPoints.map((point, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-4 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 * index }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 group-hover:border-red-200 transition-all duration-300">
                      <span className="text-red-500 font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-slate-700 font-medium text-lg group-hover:text-slate-900 transition-colors">{point}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Closing Statement */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
                <p className="text-white font-semibold text-lg md:text-xl relative z-10">
                  This is not a hustle problem. <span className="text-primary">It's a structure problem.</span>
                </p>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual Diagram */}
            <motion.div 
              className="flex items-center justify-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="relative py-8 px-4"
                animate={{
                  boxShadow: [
                    "0 0 30px 10px rgba(99, 102, 241, 0.05)",
                    "0 0 60px 20px rgba(99, 102, 241, 0.1)",
                    "0 0 30px 10px rgba(99, 102, 241, 0.05)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Pulsing glow ring around container */}
                <motion.div 
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-100/20 via-primary/10 to-emerald-100/20"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Vertical connecting line with enhanced shimmer */}
                <div className="absolute left-1/2 top-0 bottom-0 w-2 -translate-x-1/2 rounded-full overflow-hidden shadow-lg">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-b from-red-400 via-amber-400 via-primary via-sky-400 to-emerald-400"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{ originY: 0 }}
                  />
                  {/* Enhanced shimmer effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-white/90 to-transparent"
                    animate={{ y: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                  />
                </div>
                
                {/* Stage Labels */}
                <div className="relative z-10 space-y-6">
                  {stages.map((stage, index) => {
                    const isFirst = index === 0;
                    const isLast = index === stages.length - 1;
                    
                    return (
                      <motion.div
                        key={stage.name}
                        className="flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.15 * index + 0.4 }}
                      >
                        <motion.div 
                          className={`
                            relative px-10 py-5 rounded-2xl font-bold text-sm tracking-widest
                            transition-all duration-300 cursor-default group backdrop-blur-sm
                            ${isFirst 
                              ? "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 text-red-600 shadow-xl shadow-red-200/60 ring-2 ring-red-100" 
                              : isLast 
                                ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300 text-emerald-600 shadow-xl shadow-emerald-200/60 ring-2 ring-emerald-100" 
                                : index === 1
                                  ? "bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 text-amber-600 shadow-lg shadow-amber-100/50 ring-1 ring-amber-100"
                                  : index === 2
                                    ? "bg-gradient-to-br from-primary/5 to-indigo-50 border-2 border-indigo-200 text-indigo-600 shadow-lg shadow-indigo-100/50 ring-1 ring-indigo-100"
                                    : "bg-gradient-to-br from-sky-50 to-cyan-50 border-2 border-sky-200 text-sky-600 shadow-lg shadow-sky-100/50 ring-1 ring-sky-100"
                            }
                          `}
                          whileHover={{ 
                            scale: 1.1,
                            x: 12,
                            boxShadow: isFirst 
                              ? "0 25px 50px -15px rgba(239, 68, 68, 0.4)"
                              : isLast
                                ? "0 25px 50px -15px rgba(16, 185, 129, 0.4)"
                                : index === 1
                                  ? "0 25px 50px -15px rgba(245, 158, 11, 0.3)"
                                  : index === 2
                                    ? "0 25px 50px -15px rgba(99, 102, 241, 0.3)"
                                    : "0 25px 50px -15px rgba(14, 165, 233, 0.3)"
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          {/* Dot indicator with glow and pulse */}
                          <motion.span 
                            className={`
                              absolute -left-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-4 
                              ${isFirst 
                                ? "bg-red-500 border-red-200 shadow-lg shadow-red-500/50" 
                                : isLast 
                                  ? "bg-emerald-500 border-emerald-200 shadow-lg shadow-emerald-500/50" 
                                  : index === 1
                                    ? "bg-amber-500 border-amber-200 shadow-md shadow-amber-500/30"
                                    : index === 2
                                      ? "bg-indigo-500 border-indigo-200 shadow-md shadow-indigo-500/30"
                                      : "bg-sky-500 border-sky-200 shadow-md shadow-sky-500/30"
                              }
                            `}
                            animate={isFirst || isLast ? { 
                              scale: [1, 1.2, 1],
                              boxShadow: isFirst 
                                ? ["0 0 0 0 rgba(239, 68, 68, 0.4)", "0 0 0 8px rgba(239, 68, 68, 0)", "0 0 0 0 rgba(239, 68, 68, 0.4)"]
                                : ["0 0 0 0 rgba(16, 185, 129, 0.4)", "0 0 0 8px rgba(16, 185, 129, 0)", "0 0 0 0 rgba(16, 185, 129, 0.4)"]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                          
                          <span className="text-base">{stage.name}</span>
                          
                          {/* Enhanced animated chevron between stages */}
                          {!isLast && (
                            <motion.div 
                              className="absolute -bottom-6 left-1/2 -translate-x-1/2"
                            >
                              <motion.div
                                animate={{ y: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
                              >
                                <ChevronDown 
                                  className={`w-6 h-6 drop-shadow-md ${
                                    isFirst ? "text-amber-400" 
                                    : index === 1 ? "text-indigo-400"
                                    : index === 2 ? "text-sky-400"
                                    : "text-emerald-400"
                                  }`} 
                                  strokeWidth={3} 
                                />
                              </motion.div>
                            </motion.div>
                          )}
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Enhanced side labels with glow */}
                <motion.div 
                  className="absolute -left-16 top-6 text-sm font-bold text-red-600 bg-gradient-to-r from-red-100 to-red-50 px-5 py-2.5 rounded-xl border-2 border-red-300 shadow-xl shadow-red-200/60"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  animate={{ 
                    boxShadow: ["0 4px 20px -1px rgba(239, 68, 68, 0.3)", "0 4px 30px -1px rgba(239, 68, 68, 0.6)", "0 4px 20px -1px rgba(239, 68, 68, 0.3)"],
                    y: [0, -3, 0]
                  }}
                >
                  ▶ START
                </motion.div>
                <motion.div 
                  className="absolute -left-16 bottom-6 text-sm font-bold text-emerald-600 bg-gradient-to-r from-emerald-100 to-emerald-50 px-5 py-2.5 rounded-xl border-2 border-emerald-300 shadow-xl shadow-emerald-200/60"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 }}
                  animate={{ 
                    boxShadow: ["0 4px 20px -1px rgba(16, 185, 129, 0.3)", "0 4px 30px -1px rgba(16, 185, 129, 0.6)", "0 4px 20px -1px rgba(16, 185, 129, 0.3)"],
                    y: [0, -3, 0]
                  }}
                >
                  ✓ GOAL
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
