import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import QueryProvider from "@/store/QueryProvider";
import AuthProvider from "@/store/AuthProvider";
import ThemeProvider from "@/shared/components/layout/ThemeProvider";
import ChatWidget from "@/shared/components/ui/ChatWidget";
import { ToastProvider } from "@/shared/context/ToastContext";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const SITE_URL = "https://okapi-real-estate.com";
const OG_IMAGE = `${SITE_URL}/assets/images/og-default.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Okapi Real Estate — Immobilier à Kinshasa, RDC",
    template: "%s — Okapi Real Estate",
  },
  description:
    "Trouvez des appartements, villas, maisons et locaux commerciaux à vendre ou à louer à Kinshasa et en RDC. Annonces vérifiées, agents certifiés.",
  keywords: [
    "immobilier Kinshasa",
    "appartement à louer Kinshasa",
    "villa à vendre Kinshasa",
    "maison à louer RDC",
    "agence immobilière Kinshasa",
    "bien immobilier Congo",
    "location appartement Kinshasa",
    "achat immobilier Kinshasa",
  ],
  authors: [{ name: "Okapi Real Estate", url: SITE_URL }],
  creator: "Okapi Real Estate",
  publisher: "Okapi Real Estate",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "fr_CD",
    url: SITE_URL,
    siteName: "Okapi Real Estate",
    title: "Okapi Real Estate — Immobilier à Kinshasa, RDC",
    description:
      "Trouvez des appartements, villas, maisons et locaux commerciaux à vendre ou à louer à Kinshasa et en RDC.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Okapi Real Estate — Immobilier à Kinshasa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Okapi Real Estate — Immobilier à Kinshasa, RDC",
    description:
      "Trouvez des appartements, villas, maisons et locaux commerciaux à vendre ou à louer à Kinshasa.",
    images: [OG_IMAGE],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Okapi Real Estate",
  url: "https://okapi-real-estate.com",
  logo: "https://okapi-real-estate.com/assets/icon.png",
  description: "Plateforme immobilière de référence à Kinshasa, RDC. Achat, vente et location de biens immobiliers vérifiés.",
  areaServed: { "@type": "City", name: "Kinshasa", containedInPlace: { "@type": "Country", name: "République Démocratique du Congo" } },
  contactPoint: { "@type": "ContactPoint", contactType: "customer service", availableLanguage: ["French", "Lingala"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={dmSans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-background text-foreground min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              <ToastProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <ChatWidget />
              </ToastProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
