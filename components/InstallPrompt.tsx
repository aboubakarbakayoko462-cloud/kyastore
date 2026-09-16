"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "kyastore_install_dismissed";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }
    function handleAppInstalled() {
      setVisible(false);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-40 bg-navy text-white rounded-lg shadow-xl p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-md bg-brand flex items-center justify-center font-heading font-bold text-sm shrink-0">
        K
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">Installer KyaStore</p>
        <p className="text-xs text-[#9497A3] mt-0.5">Accès rapide depuis ton écran d'accueil</p>
      </div>
      <button
        onClick={handleInstall}
        className="bg-brand hover:bg-brand-dark text-white text-xs font-semibold px-3 py-2 rounded-md shrink-0"
      >
        Installer
      </button>
      <button
        onClick={handleDismiss}
        aria-label="Fermer"
        className="text-[#9497A3] hover:text-white shrink-0 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
