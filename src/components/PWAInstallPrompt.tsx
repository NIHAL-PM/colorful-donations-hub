
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { useIsMobile } from '@/hooks/use-mobile';

const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, promptInstall } = usePWAInstall();
  const isMobile = useIsMobile();
  
  // Don't show if already installed
  if (isInstalled) {
    return null;
  }
  
  const handleInstall = () => {
    console.log('Install button clicked from PWAInstallPrompt card');
    promptInstall();
  };
  
  return (
    <Card className="border-2 border-donation-primary shadow-lg">
      <CardHeader className="bg-donation-primary text-white">
        <CardTitle className="text-xl flex items-center gap-2">
          {isIOS ? <Smartphone className="h-5 w-5" /> : <Download className="h-5 w-5" />}
          Install Our App
        </CardTitle>
        <CardDescription className="text-white/90">
          Get a better experience by installing on your device
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-center mb-3">
          <ArrowDown className="h-10 w-10 text-donation-primary animate-bounce" />
        </div>
        <p className="text-center font-medium">
          {isIOS 
            ? "Add HappyDonation to your Home Screen for faster access and offline donations!"
            : "Install HappyDonation for a better experience and offline access!"}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-donation-primary hover:bg-donation-primary/90 text-lg py-6 shadow-lg"
          onClick={handleInstall}
        >
          {isIOS ? "Add to Home Screen" : "Install Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PWAInstallPrompt;
