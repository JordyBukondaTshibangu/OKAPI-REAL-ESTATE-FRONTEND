"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Registers a global Axios response interceptor once on mount.
 * If any call to an authenticated route returns 401 (expired / invalid token),
 * the session is cleared and the user is sent to the login page.
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  useEffect(() => {
    const id = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;
        const url: string = error?.config?.url ?? "";

        // Log out on 401 from any of our authenticated API routes.
        // Exclude public auth endpoints (login / register / forgot / reset)
        // so a wrong password doesn't kick the user out.
        const isPublicAuthRoute =
          url.includes("/api/auth/login") ||
          url.includes("/api/auth/register") ||
          url.includes("/api/auth/forgot") ||
          url.includes("/api/auth/reset") ||
          url.includes("/api/proxy/auth/login") ||
          url.includes("/api/proxy/auth/register");

        if (status === 401 && url.includes("/api/") && !isPublicAuthRoute) {
          logout();
          router.replace("/connexion");
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(id);
    };
  }, [logout, router]);

  return <>{children}</>;
}
