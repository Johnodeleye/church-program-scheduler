"use client";

import { useState, useEffect } from "react";
import { X, Download, Sparkles, Smartphone, Zap } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIos(isIosDevice);

    const dismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (dismissed === 'true') {
      return;
    }

    if (isIosDevice) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      localStorage.setItem('pwa_prompt_dismissed', 'true');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        setShowPrompt(false);
        localStorage.setItem('pwa_prompt_dismissed', 'true');
      }
      setDeferredPrompt(null);
    } else {
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
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-[9999] animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">Install App</h3>
              <p className="text-white/80 text-xs">Get the best experience</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white transition-all hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Install RCCG Bible Study Scheduler
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {isIos 
                  ? 'Add to your Home Screen for the best experience.'
                  : 'Access your schedule offline, faster loading, and app-like experience.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 flex-wrap">
            <span className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded-lg">
              <Sparkles className="w-3 h-3 text-purple-500" />
              {isIos ? 'Add to Home Screen' : 'Works offline'}
            </span>
            <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-lg">
              <Zap className="w-3 h-3 text-blue-500" />
              Faster loading
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleInstall}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isIos ? 'Add to Home Screen' : 'Install App'}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}