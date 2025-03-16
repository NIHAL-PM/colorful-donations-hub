
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallHook {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'not_available'>;
}

export function usePWAInstall(): PWAInstallHook {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  
  useEffect(() => {
    // Check if app is already installed
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
      
      if (isStandalone) {
        console.log('💾 App is installed and running in standalone mode');
        setIsInstalled(true);
        return true;
      }
      return false;
    };
    
    // Don't proceed if already installed
    if (checkInstallStatus()) return;
    
    // Check device platform
    const userAgent = navigator.userAgent;
    const iosDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const androidDevice = /Android/i.test(userAgent);
    
    setIsIOS(iosDevice);
    setIsAndroid(androidDevice);
    
    console.log('📱 Device detection in hook:', { iosDevice, androidDevice, userAgent });
    
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event so it can be triggered later
      console.log('💾 Before install prompt event captured in hook');
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    
    const handleAppInstalled = () => {
      console.log('🎉 App was installed - event detected in hook');
      setIsInstalled(true);
      setDeferredPrompt(null);
    };
    
    // Check if display mode changes (e.g. when installed)
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        console.log('Display mode changed to standalone - app was installed');
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', handleDisplayModeChange);
    
    // Try to force register service worker if not already controlling the page
    if ('serviceWorker' in navigator && !navigator.serviceWorker.controller && window.registerServiceWorker) {
      console.log('Attempting to force service worker registration from hook');
      window.registerServiceWorker();
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);
  
  const promptInstall = async (): Promise<'accepted' | 'dismissed' | 'not_available'> => {
    console.log('Attempting to prompt install, deferredPrompt:', !!deferredPrompt);
    
    if (!deferredPrompt) {
      if (isIOS) {
        toast.info("To install on iOS:", {
          description: "Tap the share button, then 'Add to Home Screen'",
          duration: 5000
        });
      } else if (isAndroid) {
        toast.info("Installation info:", {
          description: "Make sure you're using Chrome, Edge, or Samsung Internet on Android.",
          duration: 5000
        });
        
        // Try to manually register service worker again on Android
        if ('serviceWorker' in navigator && window.registerServiceWorker) {
          try {
            await window.registerServiceWorker();
            console.log('Service worker registered during install attempt');
          } catch (error) {
            console.error('Failed to register service worker during install attempt:', error);
          }
        }
      }
      return 'not_available';
    }
    
    try {
      // Show the install prompt
      deferredPrompt.prompt();
      console.log('Install prompt shown to user');
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User install choice: ${outcome}`);
      
      // Clear the saved prompt since it can't be used again
      setDeferredPrompt(null);
      
      if (outcome === 'accepted') {
        toast.success("Thank you for installing our app!");
      }
      
      return outcome;
    } catch (error) {
      console.error('Error during installation prompt:', error);
      toast.error("There was a problem with the installation");
      return 'not_available';
    }
  };
  
  return {
    isInstallable: !!deferredPrompt || isIOS, // iOS can always "install" via Add to Home Screen
    isInstalled,
    isIOS,
    isAndroid,
    promptInstall
  };
}
