"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Heart, MessageSquare, Bell, Star, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useT } from "@/i18n/useT";
import { useMounted } from "@/shared/hooks/useMounted";

export default function UserSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, isAuthenticated } = useAuthStore();
  const t = useT();
  const mounted = useMounted();

  const navItems = [
    { label: t.auth.profile, href: "/profil", icon: User },
    { label: t.auth.favorites, href: "/favoris", icon: Heart },
    { label: t.auth.enquiries, href: "/demandes", icon: MessageSquare },
    { label: t.auth.alerts, href: "/alertes", icon: Bell },
    { label: t.auth.reviews, href: "/avis", icon: Star },
  ];

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace("/connexion");
    }
  }, [mounted, isAuthenticated, router]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-muted">

      {/* ── Tablet tab-strip (md only, hidden on mobile & desktop) ── */}
      <div className="md:block lg:hidden border-b border-border bg-card shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* User row */}
          <div className="flex items-center gap-3 py-3 border-b border-border">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm select-none overflow-hidden relative shrink-0">
              {user?.profileImage ? (
                <Image
                  src={user.profileImage!}
                  alt={user.firstName}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              ) : (
                user?.firstName?.[0]?.toUpperCase() ?? "U"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">
                {user ? `${user.firstName} ${user.lastName}` : t.dashboard.userFallback}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t.auth.logout}
            </button>
          </div>

          {/* Scrollable tab nav */}
          <nav className="flex overflow-x-auto gap-0 scrollbar-none -mb-px">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* ── Sidebar — desktop only (lg+) ── */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-card rounded-2xl shadow-sm p-6 sticky top-28">

              {/* User summary */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg select-none overflow-hidden relative shrink-0">
                  {user?.profileImage ? (
                    <Image
                      src={user.profileImage!}
                      alt={user.firstName}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    user?.firstName?.[0]?.toUpperCase() ?? "U"
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {user ? `${user.firstName} ${user.lastName}` : t.dashboard.userFallback}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>

              {/* Vertical nav */}
              <nav className="space-y-1">
                {navItems.map(({ label, href, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 w-full transition-colors"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  {t.auth.logout}
                </button>
              </div>
            </div>
          </aside>

          {/* ── Mobile compact nav (< md) ── */}
          <div className="md:hidden bg-card rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm select-none overflow-hidden relative shrink-0">
                {user?.profileImage ? (
                  <Image
                    src={user.profileImage!}
                    alt={user.firstName}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                ) : (
                  user?.firstName?.[0]?.toUpperCase() ?? "U"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">
                  {user ? `${user.firstName} ${user.lastName}` : t.dashboard.userFallback}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <nav className="flex overflow-x-auto gap-1 -mx-1 px-1 pb-1 scrollbar-none">
              {navItems.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 pt-3 border-t border-border">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 w-full transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                {t.auth.logout}
              </button>
            </div>
          </div>

          {/* Page content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
