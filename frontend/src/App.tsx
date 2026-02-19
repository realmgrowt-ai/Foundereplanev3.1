import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Boltguider from "./pages/services/Boltguider";
import D2CBolt from "./pages/services/D2CBolt";
import BrandToFly from "./pages/services/BrandToFly";
import ScaleRunway from "./pages/services/ScaleRunway";
import B2BBolt from "./pages/services/B2BBolt";
import BoltRunway from "./pages/services/BoltRunway";
import Admin from "./pages/Admin";

import SplashScreen from "./components/SplashScreen";
import PageTransition from "./components/PageTransition";
import IntercomChat from "./components/IntercomChat";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/services/boltguider"
          element={
            <PageTransition>
              <Boltguider />
            </PageTransition>
          }
        />
        <Route
          path="/services/d2cbolt"
          element={
            <PageTransition>
              <D2CBolt />
            </PageTransition>
          }
        />
        <Route
          path="/services/brandtofly"
          element={
            <PageTransition>
              <BrandToFly />
            </PageTransition>
          }
        />
        <Route
          path="/services/scalerunway"
          element={
            <PageTransition>
              <ScaleRunway />
            </PageTransition>
          }
        />
        <Route
          path="/services/b2bbolt"
          element={
            <PageTransition>
              <B2BBolt />
            </PageTransition>
          }
        />
        <Route
          path="/services/boltrunway"
          element={
            <PageTransition>
              <BoltRunway />
            </PageTransition>
          }
        />
        <Route
          path="/admin"
          element={<Admin />}
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if splash was shown recently (within last 24 hours)
    const lastSplash = localStorage.getItem("splashTimestamp");
    if (lastSplash && Date.now() - parseInt(lastSplash) < 24 * 60 * 60 * 1000) {
      setShowSplash(false);
      setIsLoaded(true);
    }
  }, []);

  const handleSplashComplete = () => {
    localStorage.setItem("splashTimestamp", Date.now().toString());
    setShowSplash(false);
    setIsLoaded(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatePresence mode="wait">
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        </AnimatePresence>
        {isLoaded && (
          <BrowserRouter>
            <AnimatedRoutes />
            <IntercomChat />
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
