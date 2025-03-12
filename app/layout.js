"use client"; // Client-side component

import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./pages/header";
import Footer from "./pages/footer";
import Head from "next/head";

// App Constants
const APP_NAME = "Alveo Land";
const APP_DEFAULT_TITLE = "Alveo Land - Premium Real Estate";
const APP_TITLE_TEMPLATE = "%s | Alveo Land";
const APP_DESCRIPTION =
  "Explore premium condominiums and properties by Alveo Land.";

// Load fonts
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
  const pathname = usePathname();
  const isExcludedPage =
    pathname?.includes("/admin") || pathname?.includes("/pages/roomplanner");

  return (
    <html lang="en">
      <Head>
        {/* ✅ PWA & Metadata */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="application-name" content={APP_NAME} />
        <meta name="description" content={APP_DESCRIPTION} />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icon512_rounded.png"
        />

        {/* ✅ OpenGraph (SEO) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={APP_NAME} />
        <meta property="og:title" content={APP_DEFAULT_TITLE} />
        <meta property="og:description" content={APP_DESCRIPTION} />
        <meta property="og:image" content="/icon512_rounded.png" />

        {/* ✅ Twitter Meta */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={APP_DEFAULT_TITLE} />
        <meta name="twitter:description" content={APP_DESCRIPTION} />
        <meta name="twitter:image" content="/icon512_rounded.png" />
      </Head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {!isExcludedPage && <Header />}
        <main>{children}</main>
        {!isExcludedPage && <Footer />}
      </body>
    </html>
  );
};

export default RootLayout;
