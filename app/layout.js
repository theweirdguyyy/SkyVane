import { Cormorant_Garamond, DM_Mono, Figtree } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata = {
  title: "Skyvane — Elegant Weather Dashboard",
  description: "Dynamic global weather forecast with live metrics, multi-device layouts, and floating aesthetics.",
  keywords: "weather, skyvane, forecast, real-time, glassmorphism, weather dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${dmMono.variable} ${figtree.variable}`}>
        {children}
      </body>
    </html>
  );
}
