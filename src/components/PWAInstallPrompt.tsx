
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { useIsMobile } from '@/hooks/use-mobile';

const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, promptInstall } = usePWAInstall();
  const isMobile = useIsMobile();
  
  // Don't show if not on mobile or already installed
  if (!isMobile || isInstalled || !isInstallable) {
    return null;
  }
  
  const handleInstall = () => {
    console.log('Install button clicked from install prompt card');
    promptInstall();
  };
  
  return (
    <Card className="border-2 border-donation-primary/50 shadow-lg">
      <CardHeader className="bg-donation-primary/10 pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          {isIOS ? <Smartphone className="h-5 w-5" /> : <Download className="h-5 w-5" />}
          Install Our App
        </CardTitle>
        <CardDescription>
          Get a better experience by installing the app on your device
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm">
          {isIOS 
            ? "Install this app on your iPhone for faster access and improved experience. You can use it even when offline!"
            : "Add HappyDonation to your home screen to donate quickly and track your contributions anytime, anywhere!"}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-donation-primary hover:bg-donation-primary/90"
          onClick={handleInstall}
        >
          {isIOS ? "Add to Home Screen" : "Install Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PWAInstallPrompt;
