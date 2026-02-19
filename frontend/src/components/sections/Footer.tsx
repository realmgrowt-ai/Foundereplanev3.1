import { MessageCircle, ArrowUp, ArrowRight, Linkedin, Youtube, Instagram, Mail, MapPin, Plane } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import founderplaneLogo from "@/assets/founderplane-logo-new.png";

const services = [
  { name: "BoltGuider", href: "/services/boltguider", category: "Launch" },
  { name: "BrandToFly", href: "/services/brandtofly", category: "Brand" },
  { name: "D2CBolt", href: "/services/d2cbolt", category: "Growth" },
  { name: "B2BBolt", href: "/services/b2bbolt", category: "Growth" },
  { name: "ScaleRunway", href: "/services/scalerunway", category: "Scale" },
  { name: "BoltRunway", href: "/services/boltrunway", category: "Scale" },
];

const socials = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden">
      {/* CTA Section - Ready To Take Off */}
      <div className="relative py-20 overflow-hidden">
        {/* Animated gradient background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80"
          animate={{ 
            background: [
              "linear-gradient(135deg, hsl(221 73% 49%) 0%, hsl(221 73% 45%) 50%, hsl(221 73% 40%) 100%)",
              "linear-gradient(135deg, hsl(221 73% 45%) 0%, hsl(221 73% 49%) 50%, hsl(221 73% 45%) 100%)",
              "linear-gradient(135deg, hsl(221 73% 49%) 0%, hsl(221 73% 45%) 50%, hsl(221 73% 40%) 100%)",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_100%/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_100%/0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Decorative blur orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        
        {/* Floating plane icon */}
        <motion.div 
          className="absolute top-10 right-[15%] pointer-events-none hidden md:block"
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Plane className="w-12 h-12 text-white/20" />
        </motion.div>
        <motion.div 
          className="absolute bottom-16 left-[10%] pointer-events-none hidden md:block"
          animate={{ 
            y: [0, 10, 0],
            x: [0, -8, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Plane className="w-8 h-8 text-white/15 rotate-[-30deg]" />
        </motion.div>
        
        <motion.div 
          className="container px-4 text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">
            Ready To Take Off?
          </h3>
          <p className="text-white/90 mb-8 max-w-xl mx-auto text-lg">
            The system is ready. The team is ready. Let's build your future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 rounded-full text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white/10 gap-2 px-8 py-6 rounded-full text-lg" 
              onClick={() => (window as { Intercom?: (...args: unknown[]) => void }).Intercom?.('show')}
            >
              <MessageCircle className="w-5 h-5" />
              Chat With Us
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Gradient divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Main Footer Content */}
      <div className="bg-slate-900 py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-50" />
        <div className="container px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column - Who We Are */}
            <div className="lg:col-span-2">
              <motion.div 
                className="flex items-center gap-3 mb-6 group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <img 
                  src={founderplaneLogo} 
                  alt="FounderPlane Logo" 
                  className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                />
                <div>
                  <span className="text-xl font-bold font-display text-white">FounderPlane</span>
                  <p className="text-sm text-slate-400">Strategy. Systems. Scale.</p>
                </div>
              </motion.div>
              <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
                The business-building ecosystem for founders who want clarity first, systems next, and growth that lasts.
              </p>
              
              {/* Social Links - Hidden for now
              <div>
                <p className="text-sm font-medium text-white mb-4">Follow us</p>
                <div className="flex items-center gap-3">
                  {socials.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
              */}
            </div>

            {/* Services Column - Our Systems */}
            <div>
              <h4 className="text-white font-semibold mb-6">Our Systems</h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.name}>
                    <Link 
                      to={service.href}
                      className="text-slate-400 hover:text-primary transition-colors duration-300 text-sm relative inline-block group"
                    >
                      {service.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column - Command Center */}
            <div>
              <h4 className="text-white font-semibold mb-6">Partner Support</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-400">WhatsApp Us</p>
                    <button 
                      onClick={() => (window as { Intercom?: (...args: unknown[]) => void }).Intercom?.('show')} 
                      className="text-white hover:text-primary transition-colors relative inline-block group"
                    >
                      Chat Now
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                    </button>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-400">Email Support</p>
                    <a 
                      href="mailto:hello@founderplane.com" 
                      className="text-white hover:text-primary transition-colors relative inline-block group"
                    >
                      hello@founderplane.com
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-400">HQ</p>
                    <span className="text-white">Bangalore, India</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950 py-6 relative z-10">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-500">
              © Copyright {new Date().getFullYear()} FounderPlane
            </span>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              {["Privacy Policy", "Terms of Service", "Refund Policy"].map((link) => (
                <a 
                  key={link}
                  href="#" 
                  className="text-slate-500 hover:text-primary transition-colors duration-300 relative inline-block group"
                >
                  {link}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            <motion.button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="Back to top"
              whileHover={{ scale: 1.1 }}
              animate={{ 
                boxShadow: ["0 0 0 0 rgba(33, 87, 217, 0)", "0 0 0 8px rgba(33, 87, 217, 0.1)", "0 0 0 0 rgba(33, 87, 217, 0)"]
              }}
              transition={{ 
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
