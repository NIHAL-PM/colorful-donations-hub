
import React, { useEffect, useState } from 'react';

interface PwaStatus {
  isStandalone: boolean;
  displayMode: string;
  isInstallable: boolean;
  hasServiceWorker: boolean;
  serviceWorkerState: string;
  pwaInstallEvent: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  userAgent: string;
}

const PWADebugger = () => {
  const [status, setStatus] = useState<PwaStatus>({
    isStandalone: false,
    displayMode: 'browser',
    isInstallable: false,
    hasServiceWorker: false,
    serviceWorkerState: 'unknown',
    pwaInstallEvent: false,
    isAndroid: false,
    isIOS: false,
    userAgent: '',
  });
  
  useEffect(() => {
    const checkPwaStatus = async () => {
      // Get user agent
      const userAgent = navigator.userAgent;
      
      // Check platform
      const isAndroid = /Android/i.test(userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      
      // Check display mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
      
      let displayMode = 'browser';
      if (isStandalone) displayMode = 'standalone';
      if (window.matchMedia('(display-mode: fullscreen)').matches) displayMode = 'fullscreen';
      if (window.matchMedia('(display-mode: minimal-ui)').matches) displayMode = 'minimal-ui';
      
      // Check service worker
      const hasServiceWorker = 'serviceWorker' in navigator;
      let serviceWorkerState = 'not-supported';
      
      if (hasServiceWorker && navigator.serviceWorker.controller) {
        serviceWorkerState = 'controlling';
      } else if (hasServiceWorker) {
        serviceWorkerState = 'supported-not-controlling';
      }
      
      setStatus({
        isStandalone,
        displayMode,
        isInstallable: false, // Will be updated by event listener
        hasServiceWorker,
        serviceWorkerState,
        pwaInstallEvent: false, // Will be updated by event listener
        isAndroid,
        isIOS,
        userAgent,
      });
    };
    
    checkPwaStatus();
    
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = () => {
      setStatus(prev => ({ ...prev, pwaInstallEvent: true, isInstallable: true }));
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  // Force register service worker
  const forceRegisterSW = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service worker registered:', reg);
        alert('Service worker registered successfully!');
      } catch (err) {
        console.error('Service worker registration failed:', err);
        alert('Service worker registration failed: ' + (err as Error).message);
      }
    } else {
      alert('Service workers not supported in this browser');
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-md mx-auto my-4">
      <h2 className="text-xl font-bold mb-4">PWA Debugger</h2>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Running as PWA:</span>
          <span className={status.isStandalone ? "text-green-600 font-bold" : "text-red-600"}>
            {status.isStandalone ? "Yes" : "No"}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Display Mode:</span>
          <span>{status.displayMode}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Installable:</span>
          <span className={status.isInstallable ? "text-green-600 font-bold" : "text-gray-600"}>
            {status.isInstallable ? "Yes" : "No"}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Service Worker:</span>
          <span className={status.serviceWorkerState === 'controlling' ? "text-green-600 font-bold" : "text-yellow-600"}>
            {status.serviceWorkerState}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Install Event:</span>
          <span className={status.pwaInstallEvent ? "text-green-600 font-bold" : "text-red-600"}>
            {status.pwaInstallEvent ? "Triggered" : "Not Triggered"}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Platform:</span>
          <span>
            {status.isAndroid ? "Android" : status.isIOS ? "iOS" : "Other"}
          </span>
        </div>
        
        <div className="mt-4">
          <p className="text-xs text-gray-500 break-words mb-2">User Agent: {status.userAgent}</p>
        </div>
        
        <div className="mt-4">
          <button 
            onClick={forceRegisterSW}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Force Register Service Worker
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWADebugger;
