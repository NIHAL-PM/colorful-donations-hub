
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Info, ArrowDown } from 'lucide-react';
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
      if (!isInstalled) {
        setShowButton(true);
        
        if (isMobile) {
          // Show a toast notification to guide users
          toast.info("Install our app for a better experience!", {
            duration: 10000,
            action: {
              label: "Install",
              onClick: handleInstallClick
            }
          });
        }
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled, isIOS, isAndroid, isMobile]);
  
  const handleInstallClick = async () => {
    console.log('Install button clicked');
    const result = await promptInstall();
    
    console.log('Install prompt result:', result);
    
    if (result === 'not_available') {
      if (isAndroid) {
        toast.info("Install on Android:", {
          description: "Tap the menu (⋮) in your browser and select 'Add to Home screen' or 'Install app'",
          duration: 8000
        });
      } else if (isIOS) {
        toast.info("Install on iOS:", {
          description: "Tap the share button, then 'Add to Home Screen'",
          duration: 8000
        });
      } else {
        toast.info("Installation guide:", {
          description: "Use Chrome, Edge or Samsung Internet on Android, or Safari on iOS",
          duration: 8000
        });
      }
    }
  };
  
  // If app is already installed, don't show the button
  if (isInstalled || !showButton) {
    return null;
  }

  return (
    <>
      {/* Android/iOS Installation Banner */}
      {isMobile && (
        <div className="fixed top-16 inset-x-0 z-50 bg-donation-primary text-white py-3 px-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            <span className="text-sm font-medium">Install our app for a better experience!</span>
          </div>
          <Button 
            onClick={handleInstallClick}
            size="sm" 
            variant="secondary"
            className="bg-white text-donation-primary border-white hover:bg-white/90"
          >
            Install
          </Button>
        </div>
      )}
      
      {/* Floating Install Button with Animation */}
      <div className="fixed bottom-20 inset-x-0 z-50 flex justify-center px-4">
        <Button 
          onClick={handleInstallClick}
          size="lg"
          className="bg-donation-primary hover:bg-donation-primary/90 text-white font-bold px-6 py-6 rounded-full shadow-xl flex items-center gap-3 w-full max-w-xs animate-pulse"
        >
          {isIOS ? (
            <Smartphone className="h-6 w-6" />
          ) : (
            <Download className="h-6 w-6" />
          )}
          <span className="text-lg">Install App</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </Button>
      </div>
      
      {/* Bottom Action Banner */}
      {isMobile && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 p-4 flex justify-center">
          <p className="text-sm text-center text-gray-600 flex items-center">
            <ArrowDown className="h-4 w-4 mr-2 text-donation-primary animate-bounce" />
            Tap 'Install App' for faster access!
          </p>
        </div>
      )}
    </>
  );
};

export default InstallPWA;
