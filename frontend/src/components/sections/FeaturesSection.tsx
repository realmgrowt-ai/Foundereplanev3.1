import { Building2, Map, TrendingUp, Settings, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Building2,
    titleHighlight: "One Partner,",
    titleRest: "No Chaos.",
    description: "Stop juggling freelancers. We handle Strategy, Build, and Growth under one roof. Your entire engine, aligned by one team.",
  },
  {
    icon: Map,
    titleHighlight: "A Step-by-Step",
    titleRest: "Map.",
    description: "Stop waking up confused. We give you a Blueprint so you know exactly what to do today, tomorrow, and next month.",
  },
  {
    icon: TrendingUp,
    titleHighlight: "The Profit-First",
    titleRest: "System.",
    description: "We don't chase 'Vanity Metrics.' We use a Profit-First Methodology to ensure every rupee spent brings a return.",
  },
  {
    icon: Settings,
    titleHighlight: "Business on",
    titleRest: "Autopilot.",
    description: "You shouldn't work 16 hours a day. We build systems (SOPs) that transform your business from survival mode to growth mode.",
  },
  {
    icon: Zap,
    titleHighlight: "Launch In Weeks,",
    titleRest: "Not Months.",
    description: "While others are still planning, you will be live. Speed is how you win when you are starting out.",
  },
  {
    icon: Shield,
    titleHighlight: "Honest",
    titleRest: "Partners.",
    description: "We don't sell false dreams. If an idea won't work, we tell you immediately. We protect your capital like it is our own.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900">
            <span className="text-primary">Why Founders Choose</span> FounderPlane.
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {/* Icon Container */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center group-hover:bg-primary/15 group-hover:border-primary/40 transition-all duration-300">
                  <feature.icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold font-display text-slate-900 mb-3">
                <span className="text-primary">{feature.titleHighlight}</span> {feature.titleRest}
              </h3>
              
              {/* Description */}
              <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
