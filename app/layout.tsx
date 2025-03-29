// File: app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Karla, Merriweather } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const karla = Karla({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-karla",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Weight Tracker",
  description: "Track your weight and progress over time",
  manifest: "/manifest.json",
  themeColor: "#dc143c",
  other: {
    "mobile-web-app-capable": "yes", // Updated from apple-mobile-web-app-capable
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
      <body className={`${karla.variable} ${merriweather.variable} font-karla`}>
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
