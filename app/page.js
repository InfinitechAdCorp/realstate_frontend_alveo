"use client"; // ✅ This is now a client component

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "./pages/header";
import Footer from "./pages/footer";
import DashboardComponent from "./pages/dashboard";
import SEO from "./seo/page";

export default function HomePage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const pathname = usePathname();

  // ✅ Exclude Header/Footer from specific pages
  const isExcludedPage =
    pathname?.includes("/admin") || pathname?.includes("/pages/roomplanner");

  // ✅ Register Service Worker for PWA
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("✅ Service Worker Registered"))
        .catch((err) => console.error("❌ SW Registration Failed", err));
    }

    // ✅ Listen for PWA install event
    const beforeInstallPromptHandler = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      console.log("📢 PWA install prompt is available");
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallPromptHandler
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
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
      {/* ✅ SEO Metadata */}
      <SEO
        title="REAL ESTATE"
        description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle."
        keywords="alveo, real estate, luxury living, property, condominiums, investment"
        canonical={
          process.env.NEXT_PUBLIC_LOCAL_PORT || "https://alveoland.com"
        }
      />

      {!isExcludedPage && <Header />}
      <main className="overflow-x-hidden">
        <DashboardComponent />
      </main>
      {!isExcludedPage && <Footer />}

      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="fixed bottom-4 left-4 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          Install App
        </button>
      )}
    </>
  );
}
