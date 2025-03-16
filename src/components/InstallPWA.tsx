
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Smartphone } from 'lucide-react';
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
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    console.log('InstallPWA component mounted');
    
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        // Check for iOS standalone mode
        (window.navigator as any).standalone === true) {
      console.log('App is already installed in standalone mode');
      setIsAppInstalled(true);
      return;
    }
    
    // Check if the device is iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    console.log('Device detection:', { isIOS, isMobile, userAgent: navigator.userAgent });
    
    if (isIOS && isMobile) {
      console.log('iOS device detected');
      setShowIOSInstructions(true);
    }
    
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event so it can be triggered later
      console.log('👋 Before install prompt event fired', e);
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
    
    // Force show the button for testing on Android
    if (isMobile && /Android/.test(navigator.userAgent)) {
      console.log('Android device detected, ensuring install button visibility');
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isMobile]);
  
  const handleInstallClick = async () => {
    console.log('Install button clicked, deferredPrompt:', deferredPrompt);
    
    if (!deferredPrompt) {
      // Check if the device is iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      
      if (isIOS) {
        toast.info("To install on iOS:", {
          description: "Tap the share button, then 'Add to Home Screen'",
          duration: 5000
        });
      } else if (/Android/.test(navigator.userAgent)) {
        toast.info("Installation info:", {
          description: "On Android, look for 'Add to Home Screen' or 'Install' in your browser menu or tap the prompt when it appears.",
          duration: 5000
        });
      } else {
        toast.info("Installation not available", {
          description: "Make sure you're using Chrome, Edge, or Samsung Internet on Android, or Safari on iOS.",
          duration: 5000
        });
      }
      return;
    }
    
    // Show the install prompt
    try {
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
    } catch (error) {
      console.error('Error during installation:', error);
      toast.error("There was a problem with the installation");
    }
  };
  
  // If app is already installed or not on mobile, don't show the button
  if (!isMobile || isAppInstalled) {
    return null;
  }
  
  return (
    <div className="fixed bottom-16 inset-x-0 z-50 flex justify-center px-4">
      <Button 
        onClick={handleInstallClick}
        size="lg"
        className="bg-donation-primary text-white font-bold px-6 py-3 rounded-full shadow-xl animate-bounce flex items-center gap-2 w-full max-w-xs"
      >
        {showIOSInstructions ? (
          <Smartphone className="h-5 w-5" />
        ) : (
          <Download className="h-5 w-5" />
        )}
        <span>{showIOSInstructions ? "Add to Home Screen" : "Install App"}</span>
      </Button>
    </div>
  );
};

export default InstallPWA;
