
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
  const [installAvailable, setInstallAvailable] = useState(false);
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
      setInstallAvailable(true); // iOS can always "install" via Add to Home Screen
    }
    
    // On Android devices, always show the install button initially
    // The actual install capability will be determined by the beforeinstallprompt event
    if (/Android/.test(navigator.userAgent) && isMobile) {
      console.log('Android device detected, showing install button');
      setInstallAvailable(true);
    }
    
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event so it can be triggered later
      console.log('👋 Before install prompt event fired', e);
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setInstallAvailable(true);
    };
    
    const handleAppInstalled = () => {
      console.log('🎉 App was installed');
      setIsAppInstalled(true);
      setDeferredPrompt(null);
      setInstallAvailable(false);
      toast.success("App successfully installed!");
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
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
          description: "Make sure you're using Chrome, Edge, or Samsung Internet on Android. If you don't see an install prompt, your browser might not support PWA installation.",
          duration: 5000
        });
        
        // Try to manually register service worker again
        if ('serviceWorker' in navigator && window.registerServiceWorker) {
          try {
            await window.registerServiceWorker();
            toast.info("Service worker registered. Please reload the page and try again.");
          } catch (error) {
            console.error('Failed to register service worker:', error);
          }
        }
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
  
  // If app is already installed, don't show the button
  if (isAppInstalled) {
    return null;
  }
  
  // Always show the button on mobile, even if deferredPrompt isn't available yet
  if (!isMobile) {
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
