import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, AlertTriangle, Palette, TrendingUp, User, BarChart3 } from "lucide-react";

const stageOptions = [
  {
    icon: Lightbulb,
    title: "I'm exploring an idea",
    description: "You have a concept but need validation and a clear path forward.",
    route: "/services/boltguider",
    service: "BoltGuider",
    color: "blue"
  },
  {
    icon: AlertTriangle,
    title: "I've started, but things feel unstable",
    description: "You're in motion but lack structure, clarity, or consistent results.",
    route: "/services/boltguider",
    service: "BoltGuider",
    color: "amber"
  },
  {
    icon: Palette,
    title: "I need clarity, credibility, and positioning",
    description: "Your offering is real, but your brand doesn't reflect your value.",
    route: "/services/brandtofly",
    service: "BrandToFly",
    color: "violet"
  },
  {
    icon: TrendingUp,
    title: "I want predictable growth",
    description: "You have product–market fit but need a scalable growth engine.",
    route: "/services/d2cbolt",
    service: "D2CBolt",
    color: "emerald"
  },
  {
    icon: User,
    title: "The business depends too much on me",
    description: "You're the bottleneck. Growth requires systems, not more effort.",
    route: "/services/scalerunway",
    service: "ScaleRunway",
    color: "orange"
  },
  {
    icon: BarChart3,
    title: "I'm getting clients, but growth feels random",
    description: "Revenue exists, but there's no repeatable or reliable system.",
    route: "/services/b2bbolt",
    service: "B2BBolt",
    color: "cyan"
  }
];

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    hoverBorder: "hover:border-blue-300",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-100",
    hoverBorder: "hover:border-amber-300",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600"
  },
  violet: {
    bg: "bg-violet-50",
    border: "border-violet-100",
    hoverBorder: "hover:border-violet-300",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600"
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    hoverBorder: "hover:border-emerald-300",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600"
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-100",
    hoverBorder: "hover:border-orange-300",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600"
  },
  cyan: {
    bg: "bg-cyan-50",
    border: "border-cyan-100",
    hoverBorder: "hover:border-cyan-300",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600"
  }
};

const StageDiagnosisSection = () => {
  return (
    <section id="stage-diagnosis" data-testid="index-stage-diagnosis" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      
      <div className="container relative z-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-14"
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
              Self-Diagnosis
            </motion.span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-slate-900 mb-4">
              Where Are You <span className="text-primary">Right Now?</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Choose the option that best describes your current situation. 
              There is no "right" answer — only the right next step.
            </p>
          </motion.div>

          {/* Stage Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {stageOptions.map((option, index) => {
              const Icon = option.icon;
              const colors = colorClasses[option.color as keyof typeof colorClasses];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <Link 
                    to={option.route}
                    onClick={() => window.scrollTo(0, 0)}
                    className="group block h-full"
                  >
                    <div className={`${colors.bg} border ${colors.border} ${colors.hoverBorder} rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 relative overflow-hidden`}>
                      {/* Hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10">
                        {/* Icon */}
                        <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-6 h-6 ${colors.iconColor}`} />
                        </div>
                        
                        <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-slate-800 transition-colors">
                          {option.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                          {option.description}
                        </p>
                        <div className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <span>Explore solution</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Micro-copy */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="inline-flex items-center gap-2 text-slate-500 text-sm bg-slate-50 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Your answer determines the system — not a sales pitch.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StageDiagnosisSection;
