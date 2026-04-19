import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

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
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <SmoothScroll>
              {children}
            </SmoothScroll>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "var(--bg-card)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  fontFamily: "var(--font-body)",
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
