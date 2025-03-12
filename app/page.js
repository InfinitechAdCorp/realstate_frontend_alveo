"use client";
import React, { useEffect, useState } from "react";
import DashboardComponent from "./pages/dashboard";
import SEO from "./seo/page";

export default function HomePage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // ✅ Listen for the beforeinstallprompt event
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault(); // Stop the browser from auto-showing
      setDeferredPrompt(event);
      console.log("📢 PWA install prompt is available");
    });
  }, []);

  // ✅ Show install button if PWA is installable
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show install prompt
      deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
          console.log("✅ User installed the PWA");
        } else {
          console.log("❌ User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <>
      <SEO
        title="REAL ESTATE"
        description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle."
        keywords="alveo, real estate, luxury living, property, condominiums, investment"
        canonical={
          process.env.NEXT_PUBLIC_LOCAL_PORT || "https://alveoland.com"
        }
      />
      <DashboardComponent />

      {/* ✅ Show install button only when PWA install is available */}
      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          Install App
        </button>
      )}
    </>
  );
}
