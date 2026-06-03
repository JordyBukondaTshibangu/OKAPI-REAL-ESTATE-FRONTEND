"use client";

import { Button } from "@/shared/components/ui/button";
import LanguageSwitcher from "@/shared/components/ui/LanguageSwitcher";
import ThemeToggle from "@/shared/components/ui/ThemeToggle";
import { useAuthStore } from "@/store/useAuthStore";
import { useT } from "@/i18n/useT";
import {
  Bell,
  ChevronDown,
  Heart,
  LogOut,
  MessageSquare,
  Star,
  User,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

function useNavItems(): NavItem[] {
  const t = useT();
  return [
    {
      label: t.nav.buy,
      href: "/acheter",
      columns: [
        {
          title: t.nav.col_residential_buy,
          links: [
            { label: t.nav.apartments, href: "/acheter/appartements" },
            { label: t.nav.villas, href: "/acheter/villas" },
            { label: t.nav.townhouses, href: "/acheter/maisons-ville" },
          ],
        },
        {
          title: t.nav.col_tips_buy,
          links: [
            { label: t.nav.buyerGuide, href: "/conseils/guide-acheteur" },
            { label: t.nav.neighborhoods, href: "/conseils/quartiers" },
            { label: t.nav.communities, href: "/conseils/communautes" },
            { label: t.nav.toursResidences, href: "/conseils/tours-residences" },
            { label: t.nav.schoolsUniversities, href: "/conseils/ecoles-universites" },
          ],
        },
        {
          title: t.nav.col_services,
          links: [
            { label: t.nav.buyResidential, href: "/acheter/villas" },
            { label: t.nav.buyCommercial, href: "/commercial/magasins" },
            { label: t.nav.findAgent, href: "/agents" },
            { label: t.nav.findAgency, href: "/agences" },
          ],
        },
      ],
    },
    {
      label: t.nav.rent,
      href: "/louer",
      columns: [
        {
          title: t.nav.col_residential_rent,
          links: [
            { label: t.nav.apartments, href: "/louer/appartements" },
            { label: t.nav.studios, href: "/louer/studios" },
            { label: t.nav.villas, href: "/louer/villas" },
            { label: t.nav.townhouses, href: "/louer/maisons-ville" },
          ],
        },
        {
          title: t.nav.col_tips_rent,
          links: [
            { label: t.nav.renterGuide, href: "/conseils/guide-locataire" },
            { label: t.nav.neighborhoods, href: "/conseils/quartiers" },
            { label: t.nav.communities, href: "/conseils/communautes" },
            { label: t.nav.toursResidences, href: "/conseils/tours-residences" },
            { label: t.nav.schoolsUniversities, href: "/conseils/ecoles-universites" },
          ],
        },
        {
          title: t.nav.col_services,
          links: [
            { label: t.nav.rentResidential, href: "/louer/villas" },
            { label: t.nav.rentCommercial, href: "/commercial/magasins" },
            { label: t.nav.findAgent, href: "/agents" },
            { label: t.nav.findAgency, href: "/agences" },
          ],
        },
      ],
    },
    {
      label: t.nav.sell,
      href: "/vendre",
      columns: [
        {
          title: t.nav.col_selling,
          links: [
            { label: t.nav.findAgent, href: "/agents" },
            { label: t.nav.agentProducts, href: "/agences" },
          ],
        },
        {
          title: t.nav.col_list,
          links: [
            { label: t.nav.sellYourProperty, href: "/vendre" },
          ],
        },
        {
          title: t.nav.col_useful,
          links: [
            { label: t.nav.freeEstimation, href: "/vendre/estimation" },
            { label: t.nav.sellerGuide, href: "/conseils/guide-vendeur" },
          ],
        },
      ],
    },
    {
      label: t.nav.agents,
      href: "/agents",
      columns: [
        {
          title: t.nav.col_find,
          links: [
            { label: t.nav.findAgent, href: "/agents" },
            { label: t.nav.findAgency, href: "/agences" },
          ],
        },
      ],
    },
    {
      label: t.nav.commercial,
      href: "/commercial",
      columns: [
        {
          title: t.nav.col_buy_commercial,
          links: [
            { label: t.nav.offices, href: "/commercial/bureaux" },
            { label: t.nav.stores, href: "/commercial/magasins" },
            { label: t.nav.warehouses, href: "/commercial/entrepots" },
            { label: t.nav.lands, href: "/commercial/terrains" },
          ],
        },
        {
          title: t.nav.col_rent_commercial,
          links: [
            { label: t.nav.offices, href: "/commercial/location/bureaux" },
            { label: t.nav.stores, href: "/commercial/location/magasins" },
            { label: t.nav.warehouses, href: "/commercial/location/entrepots" },
          ],
        },
        {
          title: t.nav.col_services,
          links: [
            { label: t.nav.findCommercialAgent, href: "/agents" },
            { label: t.nav.findAgency, href: "/agences" },
            { label: t.nav.commercialNews, href: "/commercial/actualites" },
          ],
        },
      ],
    },
  ];
}

function UtilityCluster() {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-white/15 bg-white dark:bg-card/5 px-1 py-0.5">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
}

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const t = useT();

  const profileMenuItems = [
    { label: t.auth.profile, href: "/profil", icon: User },
    { label: t.auth.favorites, href: "/favoris", icon: Heart },
    { label: t.auth.enquiries, href: "/demandes", icon: MessageSquare },
    { label: t.auth.alerts, href: "/alertes", icon: Bell },
    { label: t.auth.reviews, href: "/avis", icon: Star },
  ];

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
      <div className="flex items-center gap-2">
        <UtilityCluster />
        <div className="w-px h-5 bg-white dark:bg-card/20" />
        <Button variant="gold" size="sm" asChild className="hidden xl:flex font-semibold">
          <Link href="/inscription">{t.auth.register}</Link>
        </Button>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <UtilityCluster />
        <div className="w-px h-5 bg-white dark:bg-card/20" />
        <Button
          variant="outline"
          size="sm"
          className="border-white/40 text-white hover:bg-white dark:bg-card/10 hover:text-white"
          asChild
        >
          <Link href="/connexion" className="min-w-fit">{t.auth.login}</Link>
        </Button>
        <Button variant="gold" size="sm" asChild className="hidden xl:flex font-semibold">
          <Link href="/inscription">{t.auth.register}</Link>
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
      <UtilityCluster />
      <div className="w-px h-5 bg-white dark:bg-card/20" />

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{ boxShadow: "0 0 0 2px hsl(var(--navy)), 0 0 0 4px hsl(var(--secondary))" }}
          className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground font-semibold text-sm flex items-center justify-center hover:opacity-90 transition-opacity select-none relative"
          aria-label="Menu profil"
        >
          {user.profileImage ? (
            <span className="absolute inset-0 rounded-full overflow-hidden">
              <Image
                src={`/api/proxy/${user.profileImage}`}
                alt={user.firstName}
                fill
                className="object-cover"
                sizes="36px"
              />
            </span>
          ) : (
            user.firstName[0].toUpperCase()
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-xl shadow-lg border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-3 border-b border-border mb-1">
              <p className="text-sm font-semibold text-foreground">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>

            {profileMenuItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors duration-150"
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                {label}
              </Link>
            ))}

            <div className="border-t border-border mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 w-full transition-colors duration-150"
              >
                <LogOut className="w-4 h-4" />
                {t.auth.logout}
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
  const [scrolled, setScrolled] = useState(false);
  const navItems = useNavItems();
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 text-white border-b transition-all duration-300 ${
        scrolled
          ? "bg-navy/82 backdrop-blur-xl border-white/20 shadow-lg"
          : "bg-navy border-white/10"
      }`}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="max-w-6xl mx-auto px-6 h-28 flex items-center justify-between">
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

          <nav className="hidden md:flex items-center">
            {navItems.map((item) => {
              const isMenuOpen = openMenu === item.label;
              const isCurrentPage = pathname.startsWith(item.href);
              const isHighlighted = isMenuOpen || isCurrentPage;
              return (
                <div
                  key={item.label}
                  className="group"
                  onMouseEnter={() => setOpenMenu(item.label)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                      isHighlighted
                        ? "text-secondary border-secondary"
                        : "text-white/80 border-transparent hover:text-secondary hover:border-secondary/50"
                    }`}
                  >
                    {item.label}
                    {item.columns && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                          isHighlighted ? "rotate-180" : "group-hover:rotate-180"
                        }`}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
            <NavListButton navItems={navItems} setOpenMenu={setOpenMenu} />
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
                        <h3 className="text-sm font-semibold text-foreground mb-4">
                          {column.title}
                        </h3>
                      )}
                      {!column.title && <div className="hidden md:block h-9" />}
                      <ul className="space-y-3">
                        {column.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              className="text-sm text-primary hover:text-secondary hover:underline font-medium transition-colors duration-150"
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

function NavListButton({
  navItems,
  setOpenMenu,
}: {
  navItems: NavItem[];
  setOpenMenu: (v: string | null) => void;
}) {
  const t = useT();
  const sellItem = navItems.find((n) => n.href === "/vendre");
  return (
    <Link
      href="/vendre"
      onMouseEnter={() => setOpenMenu(sellItem?.label ?? null)}
      className="hidden xl:inline-flex ml-3 items-center rounded-full bg-secondary text-secondary-foreground px-5 h-9 text-sm font-semibold hover:bg-secondary/90 transition-colors duration-200"
    >
      {t.nav.list}
    </Link>
  );
}
