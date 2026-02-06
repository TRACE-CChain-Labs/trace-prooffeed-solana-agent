import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TRACE ProofFeed — Verifiable Agent Reasoning",
  description:
    "Commit → Reveal → Verify on Solana Devnet. Turn agent reasoning into tamper-evident artifacts anyone can verify.",
  icons: {
    icon: [
      { url: "/icon/logo.png", type: "image/png", sizes: "512x512" },
      { url: "/icon/logo.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/icon/logo.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#06070c] text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
