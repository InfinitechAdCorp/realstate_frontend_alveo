"use client";

import DashboardComponent from "./pages/dashboard";
import SEO from "./seo/page";

export default function HomePage() {
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

      <main className="overflow-x-hidden">
        <DashboardComponent />
      </main>
    </>
  );
}
