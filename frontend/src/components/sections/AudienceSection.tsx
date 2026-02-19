import { Rocket, ShoppingBag, User, Video, Building2, Target } from "lucide-react";
import { motion } from "framer-motion";

const audiences = [
  {
    icon: Rocket,
    label: "The First-Timer",
    title: "Startups & Aspiring Founders",
    description: "Don't just have an idea; have a plan. Escape 'Analysis Paralysis' and turn your passion project into a structured revenue engine.",
  },
  {
    icon: ShoppingBag,
    label: "The E-Com Owner",
    title: "D2C & E-commerce Brands",
    description: "Stop burning cash on ads. Install a predictable profit engine that fixes your margins and scales sustainably.",
  },
  {
    icon: User,
    label: "The Consultant",
    title: "Coaches & Consultants",
    description: "Break the 'Time for Money' trap. Build an automated system that brings qualified leads while you sleep.",
  },
  {
    icon: Video,
    label: "The Creator",
    title: "Creators & Influencers",
    description: "Your content is elite, but your business is chaos. Turn your rented audience into a resilient, owned asset.",
  },
  {
    icon: Building2,
    label: "The Agency Owner",
    title: "Agency Owners",
    description: "Stop being the firefighter. Productize your service and build delivery systems that run perfectly without supervision.",
  },
  {
    icon: Target,
    label: "The Scaler",
    title: "SMEs & Established Founders",
    description: "You have revenue, but no freedom. Transition from 'Busy Operator' to 'Strategic Owner' by digitizing your operations.",
  },
];

const AudienceSection = () => {
  return (
    <section className="py-24 bg-[hsl(221_73%_20%)] relative overflow-hidden">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,hsl(221_73%_49%/0.4)_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(221_73%_15%)]/30 via-transparent to-[hsl(221_73%_15%)]/30" />

      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display text-primary-foreground">
            <span className="text-accent">Who Is</span> FounderPlane For?
          </h2>
        </motion.div>

        {/* Audience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {audiences.map((audience, index) => (
            <motion.div 
              key={index} 
              className="group p-6 rounded-2xl bg-background/10 backdrop-blur-sm border border-primary-foreground/20 hover:border-accent/40 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              {/* Icon */}
              <div className="mb-4">
                <audience.icon className="w-10 h-10 text-accent" strokeWidth={1.5} />
              </div>
              
              {/* Label */}
              <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full mb-3">
                {audience.label}
              </span>
              
              {/* Title */}
              <h3 className="text-lg font-bold font-display text-primary-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                {audience.title}
              </h3>
              
              {/* Description */}
              <p className="text-primary-foreground/70 text-sm leading-relaxed group-hover:text-primary-foreground/90 transition-colors duration-300">
                {audience.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
