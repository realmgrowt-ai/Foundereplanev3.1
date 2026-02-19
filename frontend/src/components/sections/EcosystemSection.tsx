import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Compass, ShoppingBag, Palette, Rocket, ArrowRight, type LucideIcon, Sparkles, Target, Crown, ChevronRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

// Stage data - ONLY 3 stages: Launch, Growth, Scale
const stages = [
  { id: "Launch", color: "from-blue-500 to-violet-600", textColor: "text-blue-500", bgColor: "bg-blue-500/10" },
  { id: "Growth", color: "from-emerald-500 to-cyan-600", textColor: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  { id: "Scale", color: "from-fuchsia-500 to-orange-600", textColor: "text-fuchsia-500", bgColor: "bg-fuchsia-500/10" },
];

const categories = ["All", ...stages.map(s => s.id)];

interface Service {
  icon: LucideIcon;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  category: string;
  bgColor: string;
  glowColor: string;
  slug: string;
  cta: string;
  stageNumber: number;
}

// Services ordered: BoltGuider → BrandToFly → D2CBolt → B2BBolt → BoltRunway → ScaleRunway
const services: Service[] = [
  {
    icon: Compass,
    name: "BOLTGUIDER",
    tagline: "We Build Your 90-Day Plan.",
    description: "We remove the chaos. BoltGuider validates your direction, identifies bottlenecks, and gives you a clear execution roadmap — so you know exactly what to do first.",
    badge: "For Early-Stage Founders",
    category: "Launch",
    bgColor: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700",
    glowColor: "shadow-blue-500/50",
    slug: "boltguider",
    cta: "Explore BoltGuider",
    stageNumber: 1,
  },
  {
    icon: Palette,
    name: "BRANDTOFLY",
    tagline: "We Build Your Brand.",
    description: "We bring your vision to life. From positioning to visual identity, we build brands that earn trust, clarity, and authority in the market.",
    badge: "Stand Out & Build Trust",
    category: "Launch",
    bgColor: "bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700",
    glowColor: "shadow-violet-500/50",
    slug: "brandtofly",
    cta: "Explore BrandToFly",
    stageNumber: 2,
  },
  {
    icon: ShoppingBag,
    name: "D2CBOLT",
    tagline: "We Scale E-Commerce.",
    description: "We fix unit economics first — then install performance systems designed for profitable, sustainable growth across paid, owned, and retention channels.",
    badge: "Stop Burning Ad Spend",
    category: "Growth",
    bgColor: "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700",
    glowColor: "shadow-emerald-500/50",
    slug: "d2cbolt",
    cta: "Explore D2CBolt",
    stageNumber: 3,
  },
  {
    icon: Target,
    name: "B2BBOLT",
    tagline: "We Build Predictable B2B Revenue.",
    description: "We design outbound, inbound, and sales systems that turn B2B demand into consistent pipelines — without founder-led selling.",
    badge: "Replace Founder Dependency",
    category: "Growth",
    bgColor: "bg-gradient-to-br from-cyan-600 via-cyan-700 to-slate-700",
    glowColor: "shadow-cyan-500/50",
    slug: "b2bbolt",
    cta: "Explore B2BBolt",
    stageNumber: 4,
  },
  {
    icon: Crown,
    name: "BOLTRUNWAY",
    tagline: "We Build Businesses That Run Without You.",
    description: "We install leadership, operations, and execution systems so your business scales through people and process — not founder effort.",
    badge: "Exit the Bottleneck",
    category: "Scale",
    bgColor: "bg-gradient-to-br from-fuchsia-600 via-fuchsia-700 to-slate-700",
    glowColor: "shadow-fuchsia-500/50",
    slug: "boltrunway",
    cta: "Explore BoltRunway",
    stageNumber: 5,
  },
  {
    icon: Rocket,
    name: "SCALERUNWAY",
    tagline: "We Scale Service Businesses.",
    description: "We install SOPs, systems, and automation so service businesses grow without chaos, overload, or constant firefighting.",
    badge: "Automate & Save Hours",
    category: "Scale",
    bgColor: "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700",
    glowColor: "shadow-orange-500/50",
    slug: "scalerunway",
    cta: "Explore ScaleRunway",
    stageNumber: 6,
  },
];

// Stage Progress Indicator Component
const StageProgressIndicator = () => {
  const stageFlow = [
    { label: "Launch", color: "bg-blue-500" },
    { label: "Growth", color: "bg-emerald-500" },
    { label: "Scale", color: "bg-fuchsia-500" },
  ];

  return (
    <motion.div 
      className="flex items-center justify-center gap-2 md:gap-4 mb-6"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {stageFlow.map((stage, index) => (
        <div key={stage.label} className="flex items-center">
          <motion.div 
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
            <span className="text-xs md:text-sm font-medium text-slate-600">{stage.label}</span>
          </motion.div>
          {index < stageFlow.length - 1 && (
            <ChevronRight className="w-4 h-4 text-slate-300 mx-1 md:mx-2" />
          )}
        </div>
      ))}
    </motion.div>
  );
};

const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
  const IconComponent = service.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // 3D Tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full perspective-1000"
    >
      <Link to={`/services/${service.slug}#hero`} className="group block h-full">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="relative rounded-3xl overflow-hidden h-full min-h-[500px] flex flex-col transition-all duration-500"
        >
          
          {/* Gradient Background */}
          <div className={`absolute inset-0 ${service.bgColor} transition-opacity duration-500 ${isHovered ? 'opacity-95' : 'opacity-100'}`} />
          
          {/* Animated Gradient Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/20"
            animate={isHovered ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
            transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
          />
          
          {/* Shimmer Border Effect */}
          <motion.div 
            className="absolute inset-0 rounded-3xl"
            animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" 
                 style={{ backgroundSize: "200% 100%" }} />
          </motion.div>
          
          {/* Floating Orbs with enhanced hover animation */}
          <motion.div 
            className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            animate={isHovered ? { scale: 1.5, opacity: 0.3 } : { scale: 1, opacity: 0.2 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute bottom-10 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl" />
          
          {/* Enhanced Glow Shadow */}
          <motion.div
            className="absolute inset-0 rounded-3xl shadow-2xl"
            animate={isHovered ? { 
              boxShadow: [
                '0 20px 60px rgba(0, 0, 0, 0.3)',
                '0 25px 80px rgba(0, 0, 0, 0.4)',
                '0 20px 60px rgba(0, 0, 0, 0.3)',
              ]
            } : {
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
            }}
            transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
          />
          
          {/* Content */}
          <div className="relative z-10 p-8 flex flex-col h-full" style={{ transform: "translateZ(50px)" }}>
            {/* Icon Container with Enhanced Float Animation */}
            <div className="mb-auto">
              <motion.div 
                className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg"
                animate={isHovered ? { 
                  y: [-8, -12, -8],
                  rotate: [2, -2, 2],
                  scale: [1, 1.05, 1]
                } : { 
                  y: [0, -8, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={isHovered ? { 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                } : { 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <IconComponent className="w-8 h-8 text-white" strokeWidth={1.5} />
              </motion.div>
            </div>
            
            {/* Text Content */}
            <div className="mt-6">
              {/* Brand Name with hover effect */}
              <motion.span 
                className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white uppercase tracking-wider mb-4 border border-white/20"
                animate={isHovered ? { scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.4)' } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {service.name}
              </motion.span>
              
              {/* Tagline with subtle animation */}
              <motion.h4 
                className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight"
                animate={isHovered ? { y: -2 } : { y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {service.tagline}
              </motion.h4>
              
              {/* Description */}
              <p className="text-white/85 text-base leading-relaxed mb-5">
                {service.description}
              </p>
              
              {/* Badge with Sparkle and enhanced hover */}
              <p className="mb-6">
                <motion.span 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 rounded-lg text-white/95 text-xs font-medium border border-white/10"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                  transition={{ duration: 0.2 }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {service.badge}
                </motion.span>
              </p>
              
              {/* CTA with enhanced animation */}
              <motion.div 
                className="flex items-center gap-2 text-white font-semibold text-base"
                animate={isHovered ? { x: 4 } : { x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="relative">
                  {service.cta} →
                  <motion.span 
                    className="absolute bottom-0 left-0 h-0.5 bg-white"
                    animate={isHovered ? { width: '100%' } : { width: '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
              </motion.div>
            </div>
          </div>
          
          {/* Border Glow Effect with enhanced animation */}
          <motion.div 
            className="absolute inset-0 rounded-3xl border-2"
            animate={isHovered ? { 
              borderColor: 'rgba(255, 255, 255, 0.5)'
            } : { 
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};

// Category Filter Button Component
const CategoryFilterButton = ({ 
  category, 
  isActive, 
  onClick 
}: { 
  category: string; 
  isActive: boolean; 
  onClick: () => void;
}) => {
  const stage = stages.find(s => s.id === category);
  
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
        isActive
          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25 scale-105"
          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
      }`}
      whileHover={{ scale: isActive ? 1.05 : 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {stage && (
        <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${stage.color}`} />
      )}
      {category === "All" ? "View All" : category}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-transparent"
          layoutId="activeFilter"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

const EcosystemSection = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const filteredServices = activeFilter === "All" 
    ? services 
    : services.filter(s => s.category === activeFilter);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <section id="ecosystem" data-testid="index-ecosystem" className="py-24 md:py-32 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      {/* Enhanced Grid Pattern with Animation */}
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:60px_60px]"
        animate={{ backgroundPosition: ["0px 0px", "60px 60px"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Enhanced Floating Orbs with Parallax */}
      <motion.div 
        className="absolute top-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl"
        animate={{ 
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{ duration: 12, repeat: Infinity, delay: 1 }}
      />
      <motion.div 
        className="absolute top-1/2 left-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"
        animate={{ 
          x: [0, 20, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      />
      
      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-10"
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
            Our Systems
          </motion.span>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-slate-900 mb-4">
            <motion.span 
              className="bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent bg-[size:200%]"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              Specialized Engines
            </motion.span>{" "}
            — Installed in the Right Order
          </h2>
          
          <p className="text-slate-600 max-w-3xl mx-auto text-lg mb-2">
            FounderPlane is not a list of services. It's a system of engines designed to be installed by stage — so you build, grow, and scale without chaos or rework.
          </p>
          
          <p className="text-slate-500 text-sm mb-6">
            You don't need everything. You need the right system for your current stage.
          </p>
          
          {/* Stage Progress Indicator */}
          <StageProgressIndicator />
        </motion.div>

        {/* Category Filters - Only View All, Launch, Growth, Scale */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {categories.map((category) => (
            <CategoryFilterButton
              key={category}
              category={category}
              isActive={activeFilter === category}
              onClick={() => setActiveFilter(category)}
            />
          ))}
        </motion.div>

        {/* Service Cards Carousel - NO AUTOPLAY */}
        <div className="max-w-7xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-6">
              {filteredServices.map((service, index) => (
                <CarouselItem 
                  key={`${service.name}-${index}`} 
                  className="pl-6 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <ServiceCard service={service} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 w-12 h-12 bg-white/95 backdrop-blur border-slate-200 text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-lg" />
            <CarouselNext className="hidden md:flex -right-4 lg:-right-6 w-12 h-12 bg-white/95 backdrop-blur border-slate-200 text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-lg" />
          </Carousel>

          {/* Dot Indicators */}
          {count > 0 && (
            <div className="flex justify-center gap-2.5 mt-10">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === current
                      ? "bg-primary w-10"
                      : "bg-slate-300 hover:bg-slate-400 w-3"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Find Your Stage Link */}
          <motion.div 
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <a 
              href="#stage-diagnosis"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Find Your Stage
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
