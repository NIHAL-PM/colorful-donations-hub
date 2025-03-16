
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Donate from "./pages/Donate";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { DonationsProvider } from "./hooks/useDonations";
import { LeaderboardProvider } from "./hooks/useLeaderboard";
import InstallPWA from "./components/InstallPWA";
import { useEffect } from "react";

// Declare the global window property for the registerServiceWorker function
declare global {
  interface Window {
    registerServiceWorker?: () => Promise<ServiceWorkerRegistration | null>;
  }
}

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Force PWA-related logs to help with debugging
    console.log("App mounted - PWA install check");
    
    // Check if running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is running in standalone/installed mode');
    } else {
      console.log('App is running in browser mode - can be installed');
    }
    
    // Try to force service worker registration if necessary
    if ('serviceWorker' in navigator && window.registerServiceWorker) {
      console.log("Attempting to force service worker registration");
      window.registerServiceWorker();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <DonationsProvider>
            <LeaderboardProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/donate" element={<Donate />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<Admin />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <InstallPWA />
              </BrowserRouter>
            </LeaderboardProvider>
          </DonationsProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
