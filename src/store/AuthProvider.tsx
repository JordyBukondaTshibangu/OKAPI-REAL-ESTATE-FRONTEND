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

        // Only act on 401s from our authenticated user routes
        if (status === 401 && url.includes("/api/user")) {
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
