import type { Metadata } from "next";
import { DM_Serif_Display, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = DM_Serif_Display({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  weight: ["400", "500"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | OpenPaws",
    default: "OpenPaws - Animal Welfare Compliance",
  },
  description:
    "Upload animal welfare documents, search applicable standards, and review AI-assisted potential risks with citations and human sign-off.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-body antialiased text-ink-900"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
