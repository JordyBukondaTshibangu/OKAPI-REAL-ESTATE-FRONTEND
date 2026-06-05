"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useT } from "@/i18n/useT";

type IconProps = { className?: string };

function InstagramIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

function GoldDivider() {
  return (
    <div
      className="h-[1.5px] bg-gradient-to-r from-transparent via-secondary/60 to-transparent"
      aria-hidden="true"
    />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold text-secondary tracking-wide mb-6">
      {children}
    </p>
  );
}

function HighlightedDescription({ text, highlight }: { text: string; highlight: string }) {
  const parts = text.split(highlight);
  if (parts.length < 2) return <>{text}</>;
  return (
    <>
      {parts[0]}
      <strong className="text-secondary font-semibold not-italic">{highlight}</strong>
      {parts.slice(1).join(highlight)}
    </>
  );
}

const regionSuburbs = {
  center: ["Gombe", "Lingwala", "Kinshasa", "Kintambo", "Barumbu", "Bandalungwa", "Lemba", "Limete"],
  west:   ["Ngaliema", "Mont-Ngafula", "Selembao", "Bumbu", "Makala", "Kalamu", "Kasa-Vubu"],
  east:   ["Masina", "N'Djili", "Kimbanseke", "N'Sele", "Maluku", "Kisenso", "Matete", "Ngiri-Ngiri"],
  rdc:    ["Lubumbashi", "Goma", "Bukavu", "Kisangani", "Mbuji-Mayi", "Kananga", "Kolwezi", "Matadi", "Boma", "Mbandaka"],
};

const rdcCol1 = regionSuburbs.rdc.slice(0, 5);
const rdcCol2 = regionSuburbs.rdc.slice(5);

export default function Footer() {
  const t = useT();

  const companyLinks = [
    { label: t.footer.about, href: "/a-propos" },
    { label: t.footer.contact, href: "/contact" },
    { label: t.footer.blog, href: "/blog" },
    { label: t.footer.sitemap, href: "/plan-du-site" },
  ];
  const legalLinks = [
    { label: t.footer.terms, href: "/conditions-generales" },
    { label: t.footer.privacy, href: "/confidentialite" },
    { label: t.footer.cookies, href: "/cookies" },
    { label: t.footer.legalMentions, href: "/conditions-generales" },
  ];
  const partnerLinks = [
    { label: t.footer.joinTeam, href: "/carrieres" },
    { label: t.footer.agentSpace, href: "/agents" },
    { label: t.footer.agencyProducts, href: "/agences" },
  ];

  const kinshasaRegions = [
    { title: t.footer.col_regions_center, param: "suburb" as const, links: regionSuburbs.center },
    { title: t.footer.col_regions_west,   param: "suburb" as const, links: regionSuburbs.west   },
    { title: t.footer.col_regions_east,   param: "suburb" as const, links: regionSuburbs.east   },
  ];

  const linkClass = "text-sm text-white/70 hover:text-secondary transition-colors duration-200";

  return (
    <footer className="bg-navy text-white">
      <div className="h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" aria-hidden="true" />

      {/* Top — Property by region */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <SectionLabel>{t.footer.exploreByArea}</SectionLabel>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Three Kinshasa region columns */}
          {kinshasaRegions.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4 text-secondary tracking-wide whitespace-nowrap">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href={`/acheter?${col.param}=${encodeURIComponent(link)}`}
                      className={linkClass}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* RDC — single header, two explicit sub-columns */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-secondary tracking-wide whitespace-nowrap">
              {t.footer.col_regions_rdc}
            </h4>
            <div className="grid grid-cols-2 gap-x-3">
              <ul className="space-y-2">
                {rdcCol1.map((link) => (
                  <li key={link}>
                    <Link
                      href={`/acheter?city=${encodeURIComponent(link)}`}
                      className={linkClass}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {rdcCol2.map((link) => (
                  <li key={link}>
                    <Link
                      href={`/acheter?city=${encodeURIComponent(link)}`}
                      className={linkClass}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <GoldDivider />

      {/* Middle — Brand + description + socials */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start gap-10">
          {/* Logo + tagline */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/images/company-logo.png"
                alt="Okapi Real Estate"
                width={160}
                height={64}
                className="h-28 w-auto"
              />
            </Link>
            <p className="text-sm text-white/55 mt-2 tracking-wide">{t.footer.tagline}</p>
          </div>

          {/* Brand description + CTA */}
          <div className="flex-1 md:px-12 md:border-x md:border-white/10">
            <p className="text-[15px] text-white/65 leading-relaxed max-w-sm">
              <HighlightedDescription
                text={t.footer.description}
                highlight={t.footer.descriptionHighlight}
              />
            </p>
            <Link
              href="/vendre"
              className="group inline-flex items-center gap-2 mt-5 text-secondary text-sm font-semibold"
            >
              {t.footer.listCta}
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1.5" />
            </Link>
          </div>

          {/* Socials */}
          <div className="shrink-0">
            <SectionLabel>{t.footer.followUs}</SectionLabel>
            <div className="flex items-center gap-4">
              {[
                { label: "Instagram", Icon: InstagramIcon },
                { label: "Facebook", Icon: FacebookIcon },
                { label: "X (Twitter)", Icon: TwitterIcon },
                { label: "YouTube", Icon: YoutubeIcon },
              ].map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="text-white/60 hover:text-secondary transition-colors duration-200"
                >
                  <Icon className="w-[22px] h-[22px]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="my-10">
          <GoldDivider />
        </div>

        {/* Link columns + app downloads */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <ul className="space-y-3">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>{link.label}</Link>
              </li>
            ))}
          </ul>

          <ul className="space-y-3">
            {legalLinks.map((link, i) => (
              <li key={i}>
                <Link href={link.href} className={linkClass}>{link.label}</Link>
              </li>
            ))}
          </ul>

          <ul className="space-y-3">
            {partnerLinks.map((link, i) => (
              <li key={i}>
                <Link href={link.href} className={linkClass}>{link.label}</Link>
              </li>
            ))}
          </ul>

          {/* App downloads */}
          <div>
            <SectionLabel>{t.footer.downloadApp}</SectionLabel>
            <div className="flex flex-wrap gap-3">
              {[
                { Icon: AppleIcon, top: t.footer.downloadOnAppStore, name: "App Store" },
                { Icon: PlayIcon,  top: t.footer.availableOnPlay,    name: "Google Play" },
              ].map(({ Icon, top, name }) => (
                <a
                  key={name}
                  href="#"
                  className="inline-flex items-center gap-2.5 bg-white dark:bg-card/8 hover:bg-white dark:bg-card/12 border border-white/20 hover:border-secondary/40 hover:shadow-[0_0_12px_hsl(var(--secondary)/0.15)] transition-all duration-200 text-white rounded-lg px-3.5 py-2.5"
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <div className="leading-tight">
                    <p className="text-[9px] text-white/60 uppercase tracking-wide">{top}</p>
                    <p className="text-xs font-semibold">{name}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex items-center gap-3 mt-10 pt-6 border-t border-white/10">
          <Image
            src="/assets/images/company-logo.png"
            alt=""
            width={56}
            height={22}
            className="h-[18px] w-auto opacity-40"
            aria-hidden="true"
          />
          <p className="text-xs text-white/45">
            {t.footer.copyright.replace("{year}", String(new Date().getFullYear()))}
          </p>
        </div>
      </div>
    </footer>
  );
}
