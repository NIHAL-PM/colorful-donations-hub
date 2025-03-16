
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

// Define the BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        // Check for iOS standalone mode
        (window.navigator as any).standalone === true) {
      setIsAppInstalled(true);
      return;
    }
    
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event so it can be triggered later
      console.log('👋 Before install prompt event fired');
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    
    const handleAppInstalled = () => {
      console.log('🎉 App was installed');
      setIsAppInstalled(true);
      setDeferredPrompt(null);
      toast.success("App successfully installed!");
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);
  
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.info("Installation not available. Try opening in your mobile browser.", {
        description: "Make sure you're using Chrome, Edge, or Samsung Internet on Android, or Safari on iOS."
      });
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    console.log('🚀 Install prompt shown');
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`👨‍💻 User choice: ${outcome}`);
    
    if (outcome === 'accepted') {
      toast.success("Thank you for installing our app!");
      setDeferredPrompt(null);
    } else {
      toast.info("App installation was canceled");
    }
  };
  
  // Only show on mobile and when install is available (not already installed)
  if (!isMobile || isAppInstalled) {
    return null;
  }
  
  // Only show when we have a valid install prompt
  if (!deferredPrompt) {
    return null;
  }
  
  return (
    <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4">
      <Button 
        onClick={handleInstallClick}
        size="lg"
        className="bg-donation-primary text-white px-4 py-2 rounded-full shadow-lg animate-pulse-soft flex items-center gap-2 w-full max-w-xs"
      >
        <Download className="h-5 w-5" />
        <span>Install App</span>
      </Button>
    </div>
  );
};

export default InstallPWA;
