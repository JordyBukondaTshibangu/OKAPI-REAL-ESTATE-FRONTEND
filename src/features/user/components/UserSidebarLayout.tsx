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

  // Wait until the client has mounted (and zustand's `persist` middleware
  // has rehydrated `isAuthenticated`/`token` from localStorage) before
  // deciding to redirect. Without this guard, the store's default
  // (isAuthenticated: false) briefly renders on every refresh, bouncing
  // logged-in users to /connexion before their session is restored.
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
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
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
                  <p className="text-sm font-semibold  truncate">
                    {user ? `${user.firstName} ${user.lastName}` : t.dashboard.userFallback}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Nav */}
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
                          : "text-muted-foreground hover:bg-muted hover:"
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

          {/* Page content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
