import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | OpenPaws",
    default: "OpenPaws - Animal Welfare Compliance Intelligence",
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
    <html lang="en">
      <body className="bg-app-bg font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
