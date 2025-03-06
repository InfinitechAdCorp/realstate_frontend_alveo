"use client"; // Mark this component as a client-side component

import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./pages/header";
import Footer from "./pages/footer"; // Import Footer
import Head from "next/head";

// Load the fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const RootLayout = ({ children }) => {
  const pathname = usePathname(); // Get current path

  // Check if the current page is one where we don't want the footer
  const excludeFooter = pathname?.includes("/admin"); // Example condition to exclude footer on certain routes

  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen`}
      >
        {children}
        {!excludeFooter && <Header />}
        {!excludeFooter && <Footer />}
      </body>
    </html>
  );
};

export default RootLayout;
