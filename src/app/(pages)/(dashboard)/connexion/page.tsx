"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Home, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginUser, getMe } from "@/services/auth";
import { loginAgent } from "@/services/agentAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { cn } from "@/shared/utils/utils";
import { useToast } from "@/shared/context/ToastContext";
import { useT } from "@/i18n/useT";

// ─── Google Icon ────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// ─── Tab types ───────────────────────────────────────────────────────────────

type Tab = "client" | "agent";

// ─── User login form ─────────────────────────────────────────────────────────

function UserLoginForm() {
  const t = useT().connexion;
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { logout: clearAgentSession } = useAgentSessionStore();
  const { showToast } = useToast();

  const schema = z.object({
    email: z.string().email(t.errInvalidCredentials),
    password: z.string().min(6, t.errInvalidCredentials),
  });
  type UserForm = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserForm>({ resolver: zodResolver(schema) });

  async function onSubmit(data: UserForm) {
    setApiError(null);
    try {
      const { access_token } = await loginUser(data.email, data.password);
      const user = await getMe(access_token);
      clearAgentSession();
      setAuth(access_token, user);
      showToast(t.welcomeBack.replace("{{name}}", user.firstName), "success");
      router.push("/");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const msg = status === 401 ? t.errInvalidCredentials : t.errGeneric;
      setApiError(msg);
      showToast(msg, "error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="text-sm font-medium block mb-1.5">{t.emailLabel}</label>
        <Input
          {...register("email")}
          type="email"
          placeholder={t.emailPlaceholder}
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium">{t.passwordLabel}</label>
          <Link href="/mot-de-passe-oublie" className="text-xs text-primary hover:underline">
            {t.forgotPassword}
          </Link>
        </div>
        <div className="relative">
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
        )}
      </div>

      {apiError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
          <p className="text-sm text-destructive">{apiError}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t.signingIn : t.signInBtn}
      </Button>

      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs text-muted-foreground">
          <span className="bg-card px-3">{t.orContinueWith}</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        type="button"
        onClick={() => {
          const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
          window.location.href = `${backendUrl}/auth/google`;
        }}
      >
        <GoogleIcon />
        {t.continueWithGoogle}
      </Button>

      <p className="text-center text-sm text-muted-foreground pt-1">
        {t.noAccountYet}{" "}
        <Link href="/inscription" className="text-primary font-medium hover:underline">
          {t.signUpFree}
        </Link>
      </p>
    </form>
  );
}

// ─── Agent login form ─────────────────────────────────────────────────────────

function AgentLoginForm() {
  const t = useT().connexion;
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const { setSession } = useAgentSessionStore();
  const { logout: clearUserSession } = useAuthStore();
  const { showToast } = useToast();

  const schema = z.object({
    identifier: z.string().min(1, t.identifierLabel),
    password: z.string().min(6, t.errInvalidAgentCredentials),
  });
  type AgentForm = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AgentForm>({ resolver: zodResolver(schema) });

  async function onSubmit(data: AgentForm) {
    setApiError(null);
    try {
      const { access_token, agent } = await loginAgent(data.identifier, data.password);
      clearUserSession();
      setSession(access_token, agent);
      showToast(t.welcomeBack.replace("{{name}}", agent.name), "success");

      if (agent.agentType === "AGENCY_OWNER" && agent.agencyId) {
        router.push("/espace-agence");
      } else {
        router.push("/espace-agent");
      }
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const msg =
        status === 401
          ? t.errInvalidAgentCredentials
          : status === 403
            ? t.errNotApproved
            : t.errGeneric;
      setApiError(msg);
      showToast(msg, "error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="text-sm font-medium block mb-1.5">{t.identifierLabel}</label>
        <Input
          {...register("identifier")}
          type="text"
          placeholder={t.identifierPlaceholder}
          autoComplete="username"
        />
        {errors.identifier && (
          <p className="text-xs text-destructive mt-1">{errors.identifier.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium">{t.passwordLabel}</label>
          <Link href="/mot-de-passe-oublie" className="text-xs text-primary hover:underline">
            {t.forgotPassword}
          </Link>
        </div>
        <div className="relative">
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
        )}
      </div>

      {apiError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
          <p className="text-sm text-destructive">{apiError}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t.signingIn : t.signInBtn}
      </Button>

      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs text-muted-foreground">
          <span className="bg-card px-3">{t.orContinueWith}</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        type="button"
        onClick={() => {
          const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
          window.location.href = `${backendUrl}/auth/agent/google`;
        }}
      >
        <GoogleIcon />
        {t.continueWithGoogle}
      </Button>

      <p className="text-center text-sm text-muted-foreground pt-1">
        {t.notAnAgentYet}{" "}
        <Link href="/devenir-agent" className="text-primary font-medium hover:underline">
          {t.joinOkapi}
        </Link>
      </p>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function LoginPageInner() {
  const t = useT().connexion;
  const searchParams = useSearchParams();
  const initialTab: Tab = searchParams.get("tab") === "agent" ? "agent" : "client";
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <Image
              src="/assets/images/company-logo.png"
              alt="Okapi Real Estate"
              width={120}
              height={48}
              className="h-28 w-auto"
              priority
            />
          </Link>
          <p className="text-sm text-muted-foreground mt-3">
            {tab === "agent" ? t.subtitleAgent : t.subtitleClient}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg overflow-hidden">
          {/* Tab switcher */}
          <div className="grid grid-cols-2 border-b border-border">
            <button
              onClick={() => setTab("client")}
              className={cn(
                "flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors",
                tab === "client"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <Home className="w-4 h-4" />
              {t.tabClient}
            </button>
            <button
              onClick={() => setTab("agent")}
              className={cn(
                "flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors",
                tab === "agent"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <UserCheck className="w-4 h-4" />
              {t.tabAgent}
            </button>
          </div>

          {/* Form area */}
          <div className="p-8">
            <h1 className="text-xl font-semibold mb-6 text-center">
              {tab === "agent" ? t.titleAgent : t.titleClient}
            </h1>
            {tab === "client" ? <UserLoginForm /> : <AgentLoginForm />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
