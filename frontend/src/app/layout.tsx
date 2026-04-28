import type { Metadata } from "next";
import { Geist, DM_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { GoogleAuthProvider } from "@/components/providers/GoogleAuthProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500", "300"], // DM_Mono only has 300, 400, 500
});

export const metadata: Metadata = {
  title: "CryptoVault",
  description: "Premium Crypto Investment Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${dmMono.variable} h-full antialiased dark`}
    >
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,500,700,400,900&display=swap" rel="stylesheet" />
        <style>{`:root { --font-cabinet-grotesk: 'Cabinet Grotesk', sans-serif; }`}</style>
      </head>
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        {/* Animated Background Mesh */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute inset-0 bg-[var(--bg-base)]"></div>
          <div className="absolute inset-0 animate-pulse-slow" style={{ background: 'var(--gradient-bg)' }}></div>
        </div>
        
        <GoogleAuthProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </GoogleAuthProvider>
        
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}
