"use client";

import { useState, useEffect } from "react";

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    });
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 p-4 shadow-lg flex justify-between items-center">
      <div>
        <p className="font-medium">Install Weight Tracker</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add to your home screen for easier access
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => setShowPrompt(false)}
          className="px-3 py-2 text-gray-600 dark:text-gray-400"
        >
          Not now
        </button>
        <button
          onClick={handleInstallClick}
          className="px-3 py-2 bg-primary-600 text-white rounded-md"
        >
          Install
        </button>
      </div>
    </div>
  );
}
