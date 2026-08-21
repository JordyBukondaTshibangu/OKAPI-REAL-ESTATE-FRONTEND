"use client";

import { Button } from "@/shared/components/ui/button";
import LanguageSwitcher from "@/shared/components/ui/LanguageSwitcher";
import ThemeToggle from "@/shared/components/ui/ThemeToggle";
import { useAuthStore } from "@/store/useAuthStore";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { useMounted } from "@/shared/hooks/useMounted";
import { useAuthHydrated } from "@/shared/hooks/useAuthHydrated";
import { useT } from "@/i18n/useT";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Heart,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Star,
  User,
  X,
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
            { label: t.nav.lands, href: "/acheter/terrains" },
            { label: t.nav.penthouses, href: "/acheter/penthouses" },
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
            { label: "⭐ Passer au Pro", href: "/pro" },
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
            { label: t.footer.becomeAgent, href: "/devenir-agent" },
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
    <div className="flex items-center gap-0.5 rounded-lg border border-black/10 dark:border-white/15 bg-white dark:bg-card/5 px-1 py-0.5">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
}

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const hydrated = useAuthHydrated();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { agent: agentSession, isAuthenticated: isAgentAuth, logout: agentLogout } = useAgentSessionStore();
  const t = useT();

  const profileMenuItems = [
    { label: t.auth.profile, href: "/profil", icon: User },
    { label: t.auth.favorites, href: "/favoris", icon: Heart },
    { label: t.auth.enquiries, href: "/demandes", icon: MessageSquare },
    { label: t.auth.alerts, href: "/alertes", icon: Bell },
    { label: t.auth.reviews, href: "/avis", icon: Star },
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  function handleAgentLogout() {
    agentLogout();
    setOpen(false);
    router.push("/");
  }

  if (!mounted || !hydrated) {
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

  // ── Agent session pill (checked before user auth so it doesn't fall through) ─
  if (isAgentAuth && agentSession) {
    const initials = agentSession.name
      .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const isAgencyOwner = agentSession.agentType === "AGENCY_OWNER" && !!agentSession.agencyId;
    const portalHref = isAgencyOwner ? "/espace-agence" : "/espace-agent";
    const portalLabel = isAgencyOwner ? t.espaceAgent.agencyPortalLabel : t.espaceAgent.agentPortalLabel;
    const portalLinkLabel = isAgencyOwner ? t.espaceAgent.myAgencyPortalLink : t.espaceAgent.myAgentPortalLink;
    return (
      <div className="flex items-center gap-2">
        <UtilityCluster />
        <div className="w-px h-5 bg-white dark:bg-card/20" />
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            style={{ boxShadow: "0 0 0 2px hsl(var(--navy)), 0 0 0 4px hsl(var(--secondary))" }}
            className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center hover:opacity-90 transition-opacity select-none"
            aria-label="Menu agent"
          >
            {initials}
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-xl shadow-lg border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-border mb-1">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">{portalLabel}</p>
                <p className="text-sm font-semibold text-foreground">{agentSession.name}</p>
                <p className="text-xs text-muted-foreground truncate">{agentSession.email}</p>
              </div>
              <Link
                href={portalHref}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors duration-150"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                {portalLinkLabel}
              </Link>
              <div className="border-t border-border mt-1 pt-1">
                <button
                  onClick={handleAgentLogout}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 w-full transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Guest (no session at all) ────────────────────────────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <UtilityCluster />
        <div className="w-px h-5 bg-white dark:bg-card/20" />
        <Button variant="ghost" size="sm" asChild className="hidden xl:flex text-white/80 hover:text-white hover:bg-white/10">
          <Link href="/connexion">{t.auth.login}</Link>
        </Button>
        <Button variant="gold" size="sm" asChild className="hidden xl:flex font-semibold">
          <Link href="/inscription">{t.auth.register}</Link>
        </Button>
      </div>
    );
  }

  // ── Authenticated regular user ────────────────────────────────────────────────
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
          {user.profileImage?.startsWith("https://") ? (
            <span className="absolute inset-0 rounded-full overflow-hidden">
              <Image
                src={user.profileImage}
                alt={user.firstName ?? ""}
                fill
                className="object-cover"
                sizes="36px"
              />
            </span>
          ) : (
            (user.firstName?.[0] ?? "U").toUpperCase()
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

/* ─── Mobile Drawer ──────────────────────────────────────────────────────── */

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const navItems = useNavItems();
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { agent: agentSession, isAuthenticated: isAgentAuth, logout: agentLogout } = useAgentSessionStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  // Close on route change
  useEffect(() => { onClose(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function handleLogout() {
    logout();
    onClose();
    router.push("/");
  }

  function handleAgentLogout() {
    agentLogout();
    onClose();
    router.push("/");
  }

  const profileLinks = [
    { label: t.auth.profile, href: "/profil", icon: User },
    { label: t.auth.favorites, href: "/favoris", icon: Heart },
    { label: t.auth.enquiries, href: "/demandes", icon: MessageSquare },
    { label: t.auth.alerts, href: "/alertes", icon: Bell },
    { label: t.auth.reviews, href: "/avis", icon: Star },
  ];

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[90] w-[85vw] max-w-sm bg-background shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0 bg-navy">
          <Link href="/" onClick={onClose}>
            <Image
              src="/assets/images/company-logo.png"
              alt="Okapi Real Estate"
              width={100}
              height={46}
              className="h-12 w-auto"
            />
          </Link>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Auth strip */}
          {isAgentAuth && agentSession ? (
            <div className="flex items-center gap-3 px-5 py-4 bg-primary/5 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm select-none shrink-0">
                {agentSession.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                  {agentSession.agentType === "AGENCY_OWNER" && agentSession.agencyId ? t.espaceAgent.agencyPortalLabel : t.espaceAgent.agentPortalLabel}
                </p>
                <p className="text-sm font-semibold text-foreground truncate">{agentSession.name}</p>
              </div>
              <Link
                href={agentSession.agentType === "AGENCY_OWNER" && agentSession.agencyId ? "/espace-agence" : "/espace-agent"}
                onClick={onClose}
                className="text-xs text-primary hover:underline shrink-0"
              >
                {t.espaceAgent.agentNavPortal}
              </Link>
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3 px-5 py-4 bg-primary/5 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold text-sm select-none overflow-hidden relative shrink-0">
                {user.profileImage?.startsWith("https://") ? (
                  <Image src={user.profileImage} alt={user.firstName} fill className="object-cover" sizes="40px" />
                ) : (
                  user.firstName[0].toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 px-5 py-4 border-b border-border">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href="/connexion" onClick={onClose}>{t.auth.login}</Link>
              </Button>
              <Button variant="gold" size="sm" className="flex-1 font-semibold" asChild>
                <Link href="/inscription" onClick={onClose}>{t.auth.register}</Link>
              </Button>
            </div>
          )}

          {/* Quick account links (user only — not shown for agents) */}
          {isAuthenticated && !isAgentAuth && (
            <div className="grid grid-cols-3 gap-0 border-b border-border">
              {profileLinks.slice(0, 3).map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={`flex flex-col items-center gap-1.5 py-4 text-center text-xs font-medium transition-colors ${pathname === href ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-primary hover:bg-muted"}`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
              {profileLinks.slice(3).map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={`flex flex-col items-center gap-1.5 py-4 text-center text-xs font-medium transition-colors ${pathname === href ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-primary hover:bg-muted"}`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Agent mobile nav — shown only when agent is signed in */}
          {isAgentAuth ? (
            <>
              {[
                { label: t.espaceAgent.agentNavSearch, href: "/acheter", icon: Home },
                { label: t.espaceAgent.agentNavListings, href: "/espace-agent/annonces", icon: Home },
                { label: t.espaceAgent.agentNavBoosts, href: "/espace-agent/boosts", icon: Star },
                { label: t.espaceAgent.agentNavPortal, href: "/espace-agent", icon: User },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium border-b border-border transition-colors ${pathname.startsWith(href) ? "text-primary bg-primary/5" : "text-foreground/80 hover:text-primary hover:bg-muted"}`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-muted-foreground" />
                  {label}
                </Link>
              ))}
            </>
          ) : (
            <>
              {/* Home quick link */}
              <Link
                href="/"
                onClick={onClose}
                className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium border-b border-border transition-colors ${pathname === "/" ? "text-primary bg-primary/5" : "text-foreground/80 hover:text-primary hover:bg-muted"}`}
              >
                <Home className="w-4 h-4 shrink-0 text-muted-foreground" />
                Accueil
              </Link>

              {/* Main nav accordion */}
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const isOpen = expanded === item.label;

                return (
                  <div key={item.label} className="border-b border-border">
                    <button
                      type="button"
                      onClick={() => {
                        if (!item.columns) { router.push(item.href); onClose(); return; }
                        setExpanded(isOpen ? null : item.label);
                      }}
                      className={`w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium transition-colors ${isActive ? "text-primary bg-primary/5" : "text-foreground/80 hover:text-primary hover:bg-muted"}`}
                    >
                      <span>{item.label}</span>
                      {item.columns ? (
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>

                    {item.columns && isOpen && (
                      <div className="bg-muted/40 pb-2">
                        {item.columns.map((col, idx) => (
                          <div key={idx} className="px-5 pt-3">
                            {col.title && (
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                                {col.title}
                              </p>
                            )}
                            <ul className="space-y-0">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className={`flex items-center gap-2 py-2 text-sm transition-colors ${pathname === link.href ? "text-primary font-medium" : "text-foreground/70 hover:text-primary"}`}
                                  >
                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="flex items-center gap-1.5 mx-5 mt-3 text-xs font-semibold text-primary hover:underline"
                        >
                          Voir tout <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* List your property CTA */}
              <div className="px-5 py-4 border-b border-border">
                <Link
                  href="/vendre"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-secondary text-secondary-foreground px-5 py-3 text-sm font-semibold hover:bg-secondary/90 transition-colors"
                >
                  {t.nav.list}
                </Link>
              </div>
            </>
          )}

          {/* Logout (authenticated) */}
          {(isAuthenticated || isAgentAuth) && (
            <button
              onClick={isAgentAuth ? handleAgentLogout : handleLogout}
              className="flex items-center gap-3 w-full px-5 py-4 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors border-b border-border"
            >
              <LogOut className="w-4 h-4" />
              {t.auth.logout}
            </button>
          )}

          {/* Language + theme — inside scroll area so the chat button never covers it */}
          <div className="flex items-center justify-between px-5 py-5">
            <span className="text-xs text-muted-foreground font-medium">Langue & thème</span>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-1 py-0.5">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>

          {/* Bottom spacer so last item isn't flush against the edge */}
          <div className="h-6 shrink-0" />
        </div>
      </div>
    </>
  );
}

// ── Agent nav links (desktop) ────────────────────────────────────────────────

function AgentDesktopNav({ pathname }: { pathname: string }) {
  const { espaceAgent: p } = useT();
  const agentLinks = [
    { label: p.agentNavSearch, href: "/acheter" },
  ];
  const agentActions = [
    { label: p.agentNavListings, href: "/espace-agent/annonces" },
    { label: p.agentNavBoosts, href: "/espace-agent/boosts" },
  ];
  return (
    <nav className="hidden lg:flex items-center gap-1">
      {agentLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
            pathname.startsWith(link.href)
              ? "text-secondary border-secondary"
              : "text-white/80 border-transparent hover:text-secondary hover:border-secondary/50"
          }`}
        >
          {link.label}
        </Link>
      ))}
      <div className="w-px h-5 bg-white/20 mx-2" />
      {agentActions.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
            pathname.startsWith(link.href)
              ? "text-secondary border-secondary"
              : "text-white/80 border-transparent hover:text-secondary hover:border-secondary/50"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navItems = useNavItems();
  const pathname = usePathname();
  const { isAuthenticated: isAgentAuth } = useAgentSessionStore();
  const mounted = useMounted();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega menu when agent is signed in (no mega menu for agents)
  const showMegaMenu = !isAgentAuth && openMenu;

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
          <Link href={mounted && isAgentAuth ? "/espace-agent" : "/"} className="flex items-center shrink-0">
            <Image
              src="/assets/images/company-logo.png"
              alt="Okapi Real Estate"
              width={140}
              height={64}
              className="h-20 w-auto"
              priority
            />
          </Link>

          {/* Public nav — hidden when agent is signed in */}
          {(!mounted || !isAgentAuth) && (
            <nav className="hidden lg:flex items-center">
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
          )}

          {/* Agent nav — shown only when agent is signed in */}
          {mounted && isAgentAuth && <AgentDesktopNav pathname={pathname} />}

          <div className="flex items-center gap-2">
            <ProfileMenu />
            {/* Hamburger — mobile/tablet only */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors ml-1"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Mega Menu Dropdown — public only */}
      {showMegaMenu && (
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
                  className="grid grid-cols-1 lg:grid-cols-3 gap-10"
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
