import localFont from "next/font/local";
import "./globals.css";
import ClientLayout from "./ClientLayout"; // ✅ Import Client Layout

const APP_NAME = "Alveo Land";
const APP_DEFAULT_TITLE = "Alveo Land - Premium Real Estate";
const APP_TITLE_TEMPLATE = "%s | Alveo Land";
const APP_DESCRIPTION =
  "Explore premium condominiums and properties by Alveo Land.";

// ✅ Load fonts correctly
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

// ✅ Metadata with PWA
export const metadata = {
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  themeColor: "#8936FF",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon512_rounded.png",
    apple: "/icon512_rounded.png",
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    images: ["/icon512_rounded.png"],
  },
  twitter: {
    card: "summary",
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    images: ["/icon512_rounded.png"],
  },
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientLayout>{children}</ClientLayout>{" "}
        {/* ✅ ClientLayout handles Header/Footer */}
      </body>
    </html>
  );
};

export default RootLayout;
