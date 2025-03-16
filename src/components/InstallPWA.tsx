
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Info } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { usePWAInstall } from '@/hooks/use-pwa-install';

const InstallPWA = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, promptInstall } = usePWAInstall();
  const [showButton, setShowButton] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // For debugging - log installation state
    console.log('PWA Install Status:', { 
      isInstallable, 
      isInstalled, 
      isIOS, 
      isAndroid, 
      isMobile,
      userAgent: navigator.userAgent
    });
    
    // Always show the button on mobile devices, unless already installed
    if (isMobile && !isInstalled) {
      setShowButton(true);
    }
    
    // After page load, wait a few seconds and check again if we should show install prompt
    const timer = setTimeout(() => {
      if (isMobile && !isInstalled) {
        setShowButton(true);
        
        // On Android, we might want to show a toast notification to guide users
        if (isAndroid) {
          toast.info("Install our app for a better experience!", {
            duration: 10000,
            action: {
              label: "Install",
              onClick: handleInstallClick
            }
          });
        }
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled, isIOS, isAndroid, isMobile]);
  
  const handleInstallClick = async () => {
    console.log('Install button clicked');
    const result = await promptInstall();
    
    console.log('Install prompt result:', result);
    
    if (result === 'not_available') {
      // If we're on Android and installation prompt is not available,
      // show detailed instructions
      if (isAndroid) {
        toast.info("Installation requirements for Android", {
          description: "Make sure you're using Chrome, Firefox, Edge or Samsung Internet. Visit the site a few times over several days for the install prompt to appear.",
          duration: 10000
        });
        
        // Attempt to register service worker again
        if ('serviceWorker' in navigator && window.registerServiceWorker) {
          try {
            const reg = await window.registerServiceWorker();
            console.log('Service worker registration attempt:', reg);
            toast.info("Preparing installation...", {
              description: "Please refresh the page and try again in a few moments.",
              duration: 5000
            });
          } catch (error) {
            console.error('Failed to register service worker:', error);
          }
        }
      }
    }
  };
  
  // If app is already installed, don't show the button
  if (isInstalled || !showButton) {
    return null;
  }
  
  // Determine the button text based on the platform
  const buttonText = isIOS ? "Add to Home Screen" : "Install App";
  const buttonIcon = isIOS ? <Smartphone className="h-5 w-5" /> : <Download className="h-5 w-5" />;
  
  return (
    <>
      {/* Floating Install Button */}
      <div className="fixed bottom-16 inset-x-0 z-50 flex justify-center px-4">
        <Button 
          onClick={handleInstallClick}
          size="lg"
          className="bg-donation-primary hover:bg-donation-primary/90 text-white font-bold px-6 py-4 rounded-full shadow-xl animate-bounce flex items-center gap-2 w-full max-w-xs"
        >
          {buttonIcon}
          <span>{buttonText}</span>
        </Button>
      </div>
      
      {/* Top Banner for Android Devices */}
      {isAndroid && (
        <div className="fixed top-16 inset-x-0 z-50 bg-donation-primary/90 text-white py-2 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span className="text-sm">Install our app for a better experience!</span>
          </div>
          <Button 
            onClick={handleInstallClick}
            size="sm" 
            variant="outline"
            className="bg-white text-donation-primary border-white hover:bg-white/90 text-xs"
          >
            Install
          </Button>
        </div>
      )}
    </>
  );
};

export default InstallPWA;
