"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Heart, MessageSquare, Bell, Star, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const navItems = [
  { label: "Mon Profil", href: "/profil", icon: User },
  { label: "Favoris", href: "/favoris", icon: Heart },
  { label: "Demandes", href: "/demandes", icon: MessageSquare },
  { label: "Alertes", href: "/alertes", icon: Bell },
  { label: "Avis & Notes", href: "/avis", icon: Star },
];

export default function UserSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/connexion");
    }
  }, [isAuthenticated, router]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (!isAuthenticated) return null;

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
                      src={`/api/proxy/${user.profileImage}`}
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
                    {user ? `${user.firstName} ${user.lastName}` : "Utilisateur"}
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
                  Se déconnecter
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
