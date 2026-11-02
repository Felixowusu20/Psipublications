import type { Metadata, Viewport } from "next";
import { Libre_Baskerville, Source_Sans_3 } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { AosProvider } from "@/components/aos-provider";
import { CookieConsentGate } from "@/components/cookie-consent-gate";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { seoBaseUrl } from "@/lib/seo/scholar";
import "./globals.css";

/** Nature-like editorial stack: Harding/Palatino → Libre Baskerville; Helvetica UI → Source Sans 3 */
const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const display = Libre_Baskerville({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(seoBaseUrl()),
  title: {
    default: "PSI Publications",
    template: "%s | PSI Publications",
  },
  description:
    "Peer-reviewed open-access journals across chemistry, biology, physics, and related sciences. Submit manuscripts, track peer review, and discover scholarly articles with NID-backed records.",
  applicationName: "PSI Publications",
  keywords: [
    "PSI Publications",
    "open access journals",
    "peer review",
    "scholarly publishing",
    "chemistry",
    "biology",
    "physics",
    "NID",
  ],
  authors: [{ name: "PSI Publications" }],
  openGraph: {
    type: "website",
    siteName: "PSI Publications",
    title: "PSI Publications",
    description:
      "Peer-reviewed open-access journals and scholarly articles across the sciences.",
    url: seoBaseUrl(),
  },
  twitter: {
    card: "summary_large_image",
    title: "PSI Publications",
    description:
      "Peer-reviewed open-access journals and scholarly articles across the sciences.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${display.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col antialiased"
        suppressHydrationWarning
      >
        <AuthProvider>
          <AosProvider>
            <SiteHeader />
            <main className="min-w-0 flex-1 overflow-x-clip">{children}</main>
            <SiteFooter />
            <CookieConsentGate />
          </AosProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
