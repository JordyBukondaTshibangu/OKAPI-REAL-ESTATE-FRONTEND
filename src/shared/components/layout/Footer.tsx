"use client";

import Image from "next/image";
import Link from "next/link";

type IconProps = { className?: string };

function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
    </svg>
  );
}

function TwitterIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function AppleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function PlayIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a1 1 0 0 1-.61-.92V2.733a1 1 0 0 1 .609-.92zM14.5 12.707l2.598 2.598-10.51 5.991 7.912-8.589zM14.5 11.293l-7.91-8.589 10.51 5.991-2.6 2.598zm6.302 4.04l-3.146-1.793L18.95 12l-1.295-1.54 3.146-1.793a1 1 0 0 1 0 1.66z" />
    </svg>
  );
}

type LinkColumn = {
  title: string;
  links: string[];
};

const regions: LinkColumn[] = [
  {
    title: "Biens à vendre — Quartiers Centre",
    links: [
      "Gombe",
      "Lingwala",
      "Kinshasa",
      "Kintambo",
      "Barumbu",
      "Bandalungwa",
      "Lemba",
      "Limete",
    ],
  },
  {
    title: "Biens à vendre — Quartiers Ouest",
    links: [
      "Ngaliema",
      "Mont-Ngafula",
      "Selembao",
      "Bumbu",
      "Makala",
      "Kalamu",
      "Kasa-Vubu",
    ],
  },
  {
    title: "Biens à vendre — Quartiers Est",
    links: [
      "Masina",
      "N'Djili",
      "Kimbanseke",
      "N'Sele",
      "Maluku",
      "Kisenso",
      "Matete",
      "Ngiri-Ngiri",
    ],
  },
  {
    title: "Reste de la RDC",
    links: [
      "Lubumbashi",
      "Goma",
      "Bukavu",
      "Kisangani",
      "Mbuji-Mayi",
      "Kananga",
      "Kolwezi",
      "Matadi",
      "Boma",
      "Mbandaka",
    ],
  },
];

const companyLinks = [
  { label: "À propos", href: "/a-propos" },
  { label: "Nous contacter", href: "/contact" },
  { label: "Commentaires", href: "/contact" },
  { label: "Plan du site", href: "#" },
];
const legalLinks = [
  { label: "Conditions générales", href: "/conditions-generales" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
  { label: "Politique des cookies", href: "/cookies" },
  { label: "Mentions légales", href: "/conditions-generales" },
];
const partnerLinks = [
  { label: "Rejoindre notre équipe", href: "/carrieres" },
  { label: "Espace agents", href: "#" },
  { label: "Produits pour agences", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Top gold accent line */}
      <div
        className="h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent"
        aria-hidden="true"
      />
      {/* Top — Property by region */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {regions.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4 leading-snug text-secondary tracking-wide">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-white/80 hover:text-secondary hover:underline transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/15" />

      {/* Bottom — brand, links, downloads */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Brand + socials row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <a href="/" className="flex items-center">
              <Image
                src="/assets/images/company-logo.png"
                alt="Okapi Real Estate"
                width={140}
                height={56}
                className="h-24 w-auto"
              />
            </a>
            <p className="text-xs text-white/60 mt-2 tracking-wide">
              Enraciné au Congo, bâtir votre avenir
            </p>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" aria-label="Instagram" className="text-white/85 hover:text-secondary transition-colors">
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Facebook" className="text-white/85 hover:text-secondary transition-colors">
              <FacebookIcon className="w-5 h-5" />
            </a>
            <a href="#" aria-label="X (Twitter)" className="text-white/85 hover:text-secondary transition-colors">
              <TwitterIcon className="w-5 h-5" />
            </a>
            <a href="#" aria-label="YouTube" className="text-white/85 hover:text-secondary transition-colors">
              <YoutubeIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-white/15 mb-10" />

        {/* Link columns + app downloads */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <ul className="space-y-3">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-sm text-white/85 hover:text-secondary transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <ul className="space-y-3">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-sm text-white/85 hover:text-secondary transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <ul className="space-y-3">
            {partnerLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-sm text-white/85 hover:text-secondary transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div>
            <p className="text-sm font-semibold mb-3">Télécharger l&apos;application</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-black hover:bg-black/80 transition-colors text-white rounded-md px-3 py-2"
              >
                <AppleIcon className="w-5 h-5" />
                <div className="leading-tight">
                  <p className="text-[9px] opacity-80">Télécharger sur</p>
                  <p className="text-xs font-semibold -mt-0.5">App Store</p>
                </div>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-black hover:bg-black/80 transition-colors text-white rounded-md px-3 py-2"
              >
                <PlayIcon className="w-5 h-5" />
                <div className="leading-tight">
                  <p className="text-[9px] opacity-80">DISPONIBLE SUR</p>
                  <p className="text-xs font-semibold -mt-0.5">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-xs text-white/70 mt-10">
          Copyright © {new Date().getFullYear()} Okapi Real Estate
        </p>
      </div>
    </footer>
  );
}
