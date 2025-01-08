import React from 'react';
import DashboardComponent from './pages/dashboard';
import Header from "./pages/header";
import SEO from "./seo/page"
export default function HomePage() {
  return (
    <>
   <SEO
  title="REAL ESTATE"
  description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.."
  keywords="alveo, real estate, luxury living, property, condominiums, luxury homes, investment, residential properties,sale,loan,"
  canonical="http://localhost:3000"
/>
      <DashboardComponent/>
    </>
  
  );
}
