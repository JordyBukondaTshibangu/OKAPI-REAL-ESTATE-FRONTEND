import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import QueryProvider from "@/store/QueryProvider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Okapi Real Estate — Trouvez un bien à vendre à Kinshasa",
  description: "Recherchez des biens à vendre, à louer et commerciaux à travers Kinshasa et la RDC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={dmSans.variable}>
      <body suppressHydrationWarning className="bg-background text-foreground min-h-screen flex flex-col">
        <QueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
