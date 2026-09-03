"use client";

import { useState, useEffect } from "react";
import { X, Download, Sparkles, Smartphone, Zap } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIos(isIosDevice);

    // Check if user dismissed before
    const dismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (dismissed === 'true') {
      return;
    }

    // For iOS - show custom prompt after a delay
    if (isIosDevice) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return;
    }

    // For Android/Chrome - listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a small delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If the event already fired before we added listener, check if we can still show it
    // Some browsers might have already fired the event
    // We'll also check if we should show a fallback prompt after a delay
    const fallbackTimer = setTimeout(() => {
      // If the prompt hasn't shown after 5 seconds, and we're not on iOS
      if (!showPrompt && !isIosDevice) {
        // Check if the browser supports PWA installation
        // We can show a button that triggers the install via the deferred prompt
        // But since we don't have the event, we'll wait for user action
        console.log('Waiting for user interaction to show install prompt');
      }
    }, 5000);

    // Check if app was installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      localStorage.setItem('pwa_prompt_dismissed', 'true');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowPrompt(false);
        localStorage.setItem('pwa_prompt_dismissed', 'true');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    } else {
      // For iOS - show instructions
      alert('📱 To install on iOS:\n\n1. Tap the Share button (square with arrow)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-[9999] animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-100/50 overflow-hidden">
        {/* Blue header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Install App</h3>
              <p className="text-blue-100 text-xs">Get the best experience</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Install RCCG Bible Study Scheduler
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {isIos 
                  ? 'Add to your Home Screen for the best experience.'
                  : 'Access your schedule offline, faster loading, and app-like experience.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>{isIos ? 'Add to Home Screen' : 'Works offline'}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span>Faster loading</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span>No browser tabs</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-200 transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isIos ? 'Add to Home Screen' : 'Install App'}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}