"use client";

import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Bell,
  ChevronDown,
  Heart,
  LogOut,
  MessageSquare,
  Star,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
            href: "/louer/villas",
          },
          {
            label: "Louer un bien commercial",
            href: "/commercial/",
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
        title: "Vous vendez ?",
        links: [
          { label: "Trouver un agent immobilier", href: "/agents" },
          { label: "Produits agences", href: "/agences" },
        ],
      },
      {
        title: "Lister ",
        links: [
          { label: "Vendre votre bien", href: "/vendre" },
        ],
      },
      {
        title: "Liens utiles",
        links: [
          { label: "Estimation gratuite", href: "/vendre/estimation" },
          { label: "Guide du vendeur", href: "/conseils/guide-vendeur" },
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

const profileMenuItems = [
  { label: "Mon Profil", href: "/profil", icon: User },
  { label: "Favoris", href: "/favoris", icon: Heart },
  { label: "Demandes", href: "/demandes", icon: MessageSquare },
  { label: "Alertes", href: "/alertes", icon: Bell },
  { label: "Avis & Notes", href: "/avis", icon: Star },
];

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="border-white/40 text-white hover:bg-white/10 hover:text-white"
          asChild
        >
          <Link href="/carrieres">Rejoindre l&apos;équipe</Link>
        </Button>
        <Button variant="gold" size="sm" asChild>
          <Link href="/inscription">S&apos;inscrire</Link>
        </Button>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-3">

        <Button
          variant="outline"
          size="sm"
          className="border-white/40 text-white hover:bg-white/10 hover:text-white"
          asChild
        >
          <Link href="/connexion" className="min-w-fit ">Se connecter</Link>
        </Button>
        <Button variant="gold" size="sm" asChild>
          <Link href="/inscription">S&apos;inscrire</Link>
        </Button>
      </div>
    );
  }

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        className="border-white/40 text-white hover:bg-white/10 hover:text-white"
        asChild
      >
        <Link href="/carrieres">Rejoindre l&apos;équipe</Link>
      </Button>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground font-semibold text-sm flex items-center justify-center hover:opacity-90 transition-opacity select-none ring-2 ring-secondary/40"
          aria-label="Menu profil"
        >
          {user.firstName[0].toUpperCase()}
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-xl shadow-lg border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-3 border-b border-border mb-1">
              <p className="text-sm font-semibold text-text-dark">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>

            {profileMenuItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-dark hover:bg-muted transition-colors"
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                {label}
              </Link>
            ))}

            <div className="border-t border-border mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 w-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
                  <Link
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
                  </Link>
                </div>
              );
            })}
            <Link
              href="/vendre"
              onMouseEnter={() => setOpenMenu(null)}
              className="ml-2 inline-flex items-center rounded-full border border-white/40 px-4 h-9 text-sm font-medium text-white hover:bg-white hover:text-navy transition-colors"
            >
              Lister 
            </Link>
          </nav>
          <ProfileMenu />
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
                            <Link
                              href={link.href}
                              className="text-sm text-primary hover:underline font-medium"
                            >
                              {link.label}
                            </Link>
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
