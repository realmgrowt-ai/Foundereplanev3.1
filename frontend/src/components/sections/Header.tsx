import { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import founderplaneLogo from "@/assets/founderplane-logo-new.png";

const navLinks = [
  { 
    label: "Services", 
    href: "#ecosystem",
    submenu: [
      { label: "BoltGuider", href: "/services/boltguider", category: "Launch" },
      { label: "BrandToFly", href: "/services/brandtofly", category: "Brand" },
      { label: "D2CBolt", href: "/services/d2cbolt", category: "Growth" },
      { label: "B2BBolt", href: "/services/b2bbolt", category: "Growth" },
      { label: "ScaleRunway", href: "/services/scalerunway", category: "Scale" },
      { label: "BoltRunway", href: "/services/boltrunway", category: "Scale" },
    ]
  },
  { label: "About Us", href: "#features" },
  { label: "FAQ", href: "#faq" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsInViewRef = useRef<Map<string, number>>(new Map());

  // Intersection Observer for smooth scroll-spy
  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.href.substring(1));
    
    // Create observer with threshold array for granular detection
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          
          if (entry.isIntersecting) {
            // Store the intersection ratio for each section
            sectionsInViewRef.current.set(sectionId, entry.intersectionRatio);
          } else {
            sectionsInViewRef.current.delete(sectionId);
          }
        });

        // Find the section with highest visibility that's closest to top
        if (sectionsInViewRef.current.size > 0) {
          const visibleSections = Array.from(sectionsInViewRef.current.entries());
          
          // Sort by DOM order (which section appears first in navLinks)
          visibleSections.sort((a, b) => {
            const indexA = sectionIds.indexOf(a[0]);
            const indexB = sectionIds.indexOf(b[0]);
            return indexA - indexB;
          });

          // Pick the first visible section with decent visibility
          const bestSection = visibleSections.find(([_, ratio]) => ratio > 0.1)?.[0] 
            || visibleSections[0]?.[0];
          
          if (bestSection) {
            setActiveSection(bestSection);
          }
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px", // Trigger when section is in the upper portion of viewport
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
      }
    );

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Header visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up or near top
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);

      // Clear active section when at very top
      if (currentScrollY < 100) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border/20"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2.5 group transition-opacity hover:opacity-80"
            >
              <img
                src={founderplaneLogo}
                alt="FounderPlane"
                width={36}
                height={36}
                loading="eager"
                decoding="async"
                className="h-8 w-8 md:h-9 md:w-9"
              />
              <span className="text-base md:text-lg font-semibold text-foreground">
                FounderPlane
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeSection === link.href.substring(1)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {activeSection === link.href.substring(1) && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:block">
              <Button
                onClick={() => (window as { Intercom?: (...args: unknown[]) => void }).Intercom?.('show')}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 text-sm font-medium"
              >
                Book a Call
                <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden relative z-50 p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5 text-foreground" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5 text-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden bg-background"
          >
            {/* Menu Content */}
            <div className="flex flex-col pt-24 px-6">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className={`text-left px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                      activeSection === link.href.substring(1)
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:bg-secondary/50"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </nav>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    (window as { Intercom?: (...args: unknown[]) => void }).Intercom?.('show');
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-base font-medium rounded-xl"
                >
                  Book a Call
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
