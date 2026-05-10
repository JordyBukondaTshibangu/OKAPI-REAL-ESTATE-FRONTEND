"use client";

import { Button } from "@/shared/components/ui/button";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type MenuColumn = {
  title: string;
  links: { label: string; href: string }[];
};

type NavItem = {
  label: string;
  href: string;
  columns?: MenuColumn[];
};

const navItems: NavItem[] = [
  {
    label: "Acheter",
    href: "/acheter",
    columns: [
      {
        title: "Biens résidentiels à vendre",
        links: [
          { label: "Appartements", href: "/acheter/appartements" },
          { label: "Villas", href: "/acheter/villas" },
          { label: "Maisons de ville", href: "/acheter/maisons-ville" },
          { label: "Terrains", href: "/acheter/terrains" },
        ],
      },
      {
        title: "Conseils d'achat",
        links: [
          { label: "Guide de l'acheteur", href: "/conseils/guide-acheteur" },
          { label: "Infos quartiers", href: "/conseils/quartiers" },
          { label: "Guides communautaires", href: "/conseils/communautes" },
          {
            label: "Guides tours & résidences",
            href: "/conseils/tours-residences",
          },
          {
            label: "Guides écoles & universités",
            href: "/conseils/ecoles-universites",
          },
        ],
      },
      {
        title: "Services",
        links: [
          {
            label: "Acheter un bien résidentiel",
            href: "/commercial",
          },
          {
            label: "Acheter un bien commercial",
            href: "/commercial",
          },
          {
            label: "Trouver un agent immobilier",
            href: "/agents",
          },
          {
            label: "Trouver une agence",
            href: "/agences",
          },
        ],
      },
    ],
  },

  {
    label: "Louer",
    href: "/louer",
    columns: [
      {
        title: "Biens résidentiels à louer",
        links: [
          { label: "Appartements", href: "/louer/appartements" },
          { label: "Studios", href: "/louer/studios" },
          { label: "Villas", href: "/louer/villas" },
          { label: "Maisons de ville", href: "/louer/maisons-ville" },
        ],
      },
      {
        title: "Conseils location",
        links: [
          { label: "Guide du locataire", href: "/conseils/guide-locataire" },
          { label: "Infos quartiers", href: "/conseils/quartiers" },
          { label: "Guides communautaires", href: "/conseils/communautes" },
          {
            label: "Guides tours & résidences",
            href: "/conseils/tours-residences",
          },
          {
            label: "Guides écoles & universités",
            href: "/conseils/ecoles-universites",
          },
        ],
      },
      {
        title: "Services",
        links: [
          {
            label: "Louer un bien résidentiel",
            href: "/commercial",
          },
          {
            label: "Louer un bien commercial",
            href: "/commercial/location",
          },
          {
            label: "Trouver un agent immobilier",
            href: "/agents",
          },
          {
            label: "Trouver une agence",
            href: "/agences",
          },
        ],
      },
    ],
  },

  {
    label: "Vendre",
    href: "/vendre",
    columns: [
      {
        title: "Vendre votre bien",
        links: [
          { label: "Vendre une maison", href: "/vendre/maison" },
          { label: "Vendre un appartement", href: "/vendre/appartement" },
          { label: "Estimation gratuite", href: "/vendre/estimation" },
        ],
      },
      {
        title: "Guides vendeur",
        links: [
          { label: "Guide du vendeur", href: "/conseils/guide-vendeur" },
          { label: "Préparer la vente", href: "/conseils/preparer-vente" },
          { label: "Prix des biens vendus", href: "/vendre/prix-vendus" },
        ],
      },
      {
        title: "Services",
        links: [
          { label: "Trouver un agent", href: "/agents" },
          { label: "Trouver une agence", href: "/agences" },
        ],
      },
    ],
  },

  {
    label: "Agents & Agences",
    href: "/agents",
    columns: [
      {
        title: "Trouver",
        links: [
          { label: "Trouver un agent immobilier", href: "/agents" },
          { label: "Trouver une agence", href: "/agences" },
        ],
      },
    ],
  },

  {
    label: "Commercial",
    href: "/commercial",
    columns: [
      {
        title: "Acheter commercial",
        links: [
          { label: "Bureaux", href: "/commercial/bureaux" },
          { label: "Magasins", href: "/commercial/magasins" },
          { label: "Entrepôts", href: "/commercial/entrepots" },
          { label: "Terrains", href: "/commercial/terrains" },
        ],
      },
      {
        title: "Louer commercial",
        links: [
          { label: "Bureaux", href: "/commercial/location/bureaux" },
          { label: "Magasins", href: "/commercial/location/magasins" },
          { label: "Entrepôts", href: "/commercial/location/entrepots" },
        ],
      },
      {
        title: "Services",
        links: [
          { label: "Trouver un agent commercial", href: "/agents" },
          { label: "Trouver une agence", href: "/agences" },
          { label: "Actualités commerciales", href: "/commercial/actualites" },
        ],
      },
    ],
  },
];

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header
      className="bg-navy text-white border-b border-white/10 sticky top-0 z-50"
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="w-full flex items-center justify-between gap-8">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/assets/images/company-logo.png"
              alt="Okapi Real Estate"
              width={140}
              height={64}
              className="h-20 w-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = openMenu === item.label;
              return (
                <div
                  key={item.label}
                  onMouseEnter={() => setOpenMenu(item.label)}
                >
                  <a
                    href={item.href}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                      isActive
                        ? "text-secondary border-secondary"
                        : "text-white/85 border-transparent hover:text-secondary"
                    }`}
                  >
                    {item.label}
                    {item.columns && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </a>
                </div>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white/40 text-white hover:bg-white/10 hover:text-white "
              asChild
            >
              <a href="/carrieres">Rejoindre l&apos;équipe</a>
            </Button>

            <Button variant="gold" size="sm" asChild>
              <a href="/inscription">S&apos;inscrire</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      {openMenu && (
        <div
          className="absolute left-0 right-0 top-full bg-background border-b border-border shadow-lg animate-in fade-in slide-in-from-top-2 duration-150"
          onMouseEnter={() => setOpenMenu(openMenu)}
        >
          <div className="max-w-6xl mx-auto px-6 py-10">
            {navItems
              .filter((item) => item.label === openMenu && item.columns)
              .map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-1 md:grid-cols-3 gap-10"
                >
                  {item.columns!.map((column, idx) => (
                    <div key={idx}>
                      {column.title && (
                        <h3 className="text-sm font-semibold text-text-dark mb-4">
                          {column.title}
                        </h3>
                      )}
                      {!column.title && <div className="hidden md:block h-9" />}
                      <ul className="space-y-3">
                        {column.links.map((link) => (
                          <li key={link.label}>
                            <a
                              href={link.href}
                              className="text-sm text-primary hover:underline font-medium"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
