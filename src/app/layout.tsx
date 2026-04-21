import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AlertProvider } from "@/contexts/AlertContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "4K Movie Kesri Surat — Professional Photography & Videography",
    template: "%s | 4K Movie Kesri Surat",
  },
  description:
    "Premium 4K photography and videography studio based in Surat, Gujarat. Specializing in weddings, corporate events, portraits, and product shoots. Book your session today.",
  keywords: [
    "photography surat",
    "wedding photographer surat",
    "videography surat",
    "4k movie kesri",
    "professional photographer gujarat",
    "corporate event photography surat",
    "portrait photography surat",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "4K Movie Kesri Surat",
    title: "4K Movie Kesri Surat — Professional Photography & Videography",
    description: "Premium 4K photography and videography studio based in Surat, Gujarat.",
  },
  twitter: {
    card: "summary_large_image",
    title: "4K Movie Kesri Surat",
    description: "Premium 4K photography and videography studio based in Surat, Gujarat.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,100..900;1,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <Toaster 
            position="top-right" 
            theme="dark" 
            expand={false} 
            richColors 
            closeButton
            toastOptions={{
              style: {
                background: "rgba(18, 15, 23, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                color: "white"
              }
            }}
          />
          <AlertProvider>
            <AuthProvider>
              <SmoothScroll>
                {children}
              </SmoothScroll>
            </AuthProvider>
          </AlertProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
