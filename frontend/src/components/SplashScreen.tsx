import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import founderplaneLogo from "@/assets/founderplane-logo-new.png";

interface SplashScreenProps {
  onComplete: () => void;
}

// Generate random particles - reduced for performance
const particles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 2,
}));

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#1a365d] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2.5 }}
      onAnimationComplete={(definition) => {
        if (definition === "exit") {
          onComplete();
        }
      }}
    >
      {/* Floating star particles - optimized with will-change */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white will-change-transform"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
            y: [0, -30, -60],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Floating planes */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-primary/20"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Plane className="w-12 h-12" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/4 text-primary/10"
        animate={{
          y: [0, 20, 0],
          x: [0, -15, 0],
          rotate: [0, -15, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Plane className="w-16 h-16 rotate-45" />
      </motion.div>

      <div className="relative z-10 text-center">
        {/* Logo animation */}
        <motion.div
          className="mb-6 relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          {/* Animated glow rings */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 80, height: 80 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            style={{ width: 80, height: 80 }}
          />
          
          {/* Logo with pulse animation */}
          <motion.img
            src={founderplaneLogo}
            alt="FounderPlane"
            width={80}
            height={80}
            loading="eager"
            decoding="async"
            className="w-20 h-20 mx-auto relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            animate={{
              scale: [1, 1.05, 1],
              filter: [
                "drop-shadow(0 0 15px rgba(59,130,246,0.5))",
                "drop-shadow(0 0 25px rgba(59,130,246,0.8))",
                "drop-shadow(0 0 15px rgba(59,130,246,0.5))",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Brand name with staggered letters */}
        <motion.div
          className="flex items-center justify-center gap-0 text-3xl md:text-4xl font-bold font-display"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05, delayChildren: 0.5 } },
          }}
        >
        {"FounderPlane".split("").map((letter, index) => (
            <motion.span
              key={index}
              className="text-white"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3 }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.div
          className="mt-6 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <span className="text-white/80 font-medium text-sm md:text-base tracking-wide">
            Clarity first. → Systems next. → Growth after.
          </span>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          className="mt-8 w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 1.5, ease: "easeInOut" }}
            onAnimationComplete={onComplete}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
