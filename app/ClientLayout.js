"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "./pages/header";
import Footer from "./pages/footer";

const ClientLayout = ({ children }) => {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin"); // ✅ Exclude `/admin` pages from header/footer
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // ✅ Register Service Worker & Listen for Install Prompt
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("✅ Service Worker Registered"))
        .catch((err) => console.error("❌ SW Registration Failed", err));
    }

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
      {!isAdminPage && <Header />}
      <main>{children}</main>
      {!isAdminPage && <Footer />}

      {/* ✅ Install PWA Button (Visible on All Pages, Including Admin) */}
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
};

export default ClientLayout;
