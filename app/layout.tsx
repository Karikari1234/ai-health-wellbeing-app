// File: app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Karla, Merriweather } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const karla = Karla({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-karla",
  display: "swap",
  preload: false, // Disable preloading to avoid warnings
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
  preload: false, // Disable preloading to avoid warnings
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ff6b6b", // Moved here from metadata
};

export const metadata: Metadata = {
  title: "Weight Tracker",
  description: "Track your weight and progress over time",
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Weight Tracker",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${karla.variable} ${merriweather.variable} font-karla bg-appBg`}>
        {children}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
