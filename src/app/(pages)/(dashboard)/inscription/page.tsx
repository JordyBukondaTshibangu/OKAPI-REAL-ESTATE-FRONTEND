"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, X, User, Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { registerUser, getMe } from "@/services/auth";
import { registerAgent } from "@/services/agentAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { useAgentSignupStore } from "@/store/useAgentSignupStore";
import { useT } from "@/i18n/useT";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const passwordRules = z
  .string()
  .min(8)
  .max(128)
  .regex(/[A-Z]/)
  .regex(/[a-z]/)
  .regex(/[^A-Za-z0-9]/);

const phoneRule = z
  .string()
  .min(9)
  .regex(/^\+?[\d\s]+$/);

const userSchema = z
  .object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: phoneRule,
    password: passwordRules,
    confirmPassword: z.string(),
    terms: z.literal(true),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
  });

const agentSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: phoneRule,
    password: passwordRules,
    confirmPassword: z.string(),
    terms: z.literal(true),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
  });

type UserFormData = z.infer<typeof userSchema>;
type AgentFormData = z.infer<typeof agentSchema>;

// ─── Password checklist ───────────────────────────────────────────────────────

function PasswordChecklist({ value, labels }: {
  value: string;
  labels: { min8: string; upper: string; lower: string; special: string };
}) {
  const checks = [
    { label: labels.min8,    ok: value.length >= 8 },
    { label: labels.upper,   ok: /[A-Z]/.test(value) },
    { label: labels.lower,   ok: /[a-z]/.test(value) },
    { label: labels.special, ok: /[^A-Za-z0-9]/.test(value) },
  ];
  if (!value) return null;
  return (
    <ul className="mt-2 space-y-1">
      {checks.map(({ label, ok }) => (
        <li key={label} className={`flex items-center gap-1.5 text-xs ${ok ? "text-emerald-600" : "text-muted-foreground"}`}>
          {ok
            ? <Check className="w-3 h-3 shrink-0" />
            : <X className="w-3 h-3 shrink-0" />}
          {label}
        </li>
      ))}
    </ul>
  );
}

// ─── Shared password field ────────────────────────────────────────────────────

function PasswordField({
  label,
  placeholder,
  error,
  show,
  onToggle,
  ...rest
}: {
  label: string;
  placeholder: string;
  error?: string;
  show: boolean;
  onToggle: () => void;
  [k: string]: unknown;
}) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">{label}</label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="pr-11"
          {...(rest as object)}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

// ─── Terms checkbox ───────────────────────────────────────────────────────────

function TermsField({
  error,
  termsText,
  termsLink,
  termsAnd,
  privacyLink,
  ...rest
}: {
  error?: string;
  termsText: string;
  termsLink: string;
  termsAnd: string;
  privacyLink: string;
  [k: string]: unknown;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="terms"
          className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
          {...(rest as object)}
        />
        <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
          {termsText}{" "}
          <Link href="/conditions-generales" className="text-primary hover:underline">
            {termsLink}
          </Link>{" "}
          {termsAnd}{" "}
          <Link href="/confidentialite" className="text-primary hover:underline">
            {privacyLink}
          </Link>
        </label>
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

// ─── User form ────────────────────────────────────────────────────────────────

function UserForm({ onSuccess }: { onSuccess: () => void }) {
  const t = useT();
  const tr = t.inscription;
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const { logout: clearAgentSession } = useAgentSessionStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
  });

  const passwordValue = useWatch({ control, name: "password", defaultValue: "" });

  async function onSubmit(data: UserFormData) {
    setApiError(null);
    try {
      const { access_token } = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phone,
        password: data.password,
      });
      const user = await getMe(access_token);
      clearAgentSession();
      setAuth(access_token, user);
      onSuccess();
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setApiError(status === 409 ? tr.errEmailTaken : tr.errGeneric);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">{tr.firstNameLabel}</label>
          <Input {...register("firstName")} placeholder={tr.firstNamePlaceholder} />
          {errors.firstName && (
            <p className="text-xs text-destructive mt-1">{tr.errFirstNameRequired}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">{tr.lastNameLabel}</label>
          <Input {...register("lastName")} placeholder={tr.lastNamePlaceholder} />
          {errors.lastName && (
            <p className="text-xs text-destructive mt-1">{tr.errLastNameRequired}</p>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">{tr.emailLabel}</label>
        <Input {...register("email")} type="email" placeholder={tr.emailPlaceholder} autoComplete="email" />
        {errors.email && <p className="text-xs text-destructive mt-1">{tr.errEmailInvalid}</p>}
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">{tr.phoneLabel}</label>
        <Input {...register("phone")} type="tel" placeholder={tr.phonePlaceholder} />
        {errors.phone && <p className="text-xs text-destructive mt-1">{tr.errPhoneInvalid}</p>}
      </div>

      <div>
        <PasswordField
          label={tr.passwordLabel}
          placeholder={tr.passwordPlaceholder}
          show={showPwd}
          onToggle={() => setShowPwd((v) => !v)}
          error={undefined}
          {...register("password")}
        />
        <PasswordChecklist
          value={passwordValue}
          labels={{ min8: tr.pwdMin8, upper: tr.pwdUppercase, lower: tr.pwdLowercase, special: tr.pwdSpecial }}
        />
      </div>

      <PasswordField
        label={tr.confirmPasswordLabel}
        placeholder={tr.confirmPasswordPlaceholder}
        show={showConfirm}
        onToggle={() => setShowConfirm((v) => !v)}
        error={errors.confirmPassword ? tr.errPasswordMismatch : undefined}
        {...register("confirmPassword")}
      />

      <TermsField
        error={errors.terms ? tr.errTermsRequired : undefined}
        termsText={tr.termsAccept}
        termsLink={tr.termsLink}
        termsAnd={tr.termsAnd}
        privacyLink={tr.privacyLink}
        {...register("terms")}
      />

      {apiError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
          <p className="text-sm text-destructive">{apiError}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
        {isSubmitting ? tr.creatingAccountBtn : tr.createAccountBtn}
      </Button>
    </form>
  );
}

// ─── Agent form ───────────────────────────────────────────────────────────────

function AgentForm({ onSuccess }: { onSuccess: (path: string) => void }) {
  const t = useT();
  const tr = t.inscription;
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { setSignup } = useAgentSignupStore();
  const { logout: clearUserSession } = useAuthStore();
  const { setSession: setAgentSession } = useAgentSessionStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    mode: "onChange",
  });

  const passwordValue = useWatch({ control, name: "password", defaultValue: "" });

  async function onSubmit(data: AgentFormData) {
    setApiError(null);
    try {
      const result = await registerAgent({
        name: data.name,
        email: data.email,
        phoneNumber: data.phone,
        password: data.password,
      });
      // Log out the current user session and log in immediately as the new agent.
      clearUserSession();
      setAgentSession(result.access_token, {
        id: result.agent.id,
        name: result.agent.name,
        email: result.agent.email,
        verificationTier: result.agent.verificationTier,
        emailVerified: result.agent.emailVerified,
        agentType: result.agent.agentType ?? null,
        agencyId: result.agent.agencyId ?? null,
      });
      // Also keep the signup store populated so the onboarding steps work.
      setSignup(result.access_token, result.agent.name, result.agent.email, data.phone);
      onSuccess("/devenir-agent/verification");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setApiError(status === 409 ? tr.errEmailTaken : tr.errGeneric);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>{tr.agentBannerTitle}</strong> — {tr.agentBannerBody}
        </p>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">{tr.agentNameLabel}</label>
        <Input {...register("name")} placeholder={tr.agentNamePlaceholder} />
        {errors.name && <p className="text-xs text-destructive mt-1">{tr.errNameRequired}</p>}
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">{tr.emailLabel}</label>
        <Input {...register("email")} type="email" placeholder={tr.emailPlaceholder} autoComplete="email" />
        {errors.email && <p className="text-xs text-destructive mt-1">{tr.errEmailInvalid}</p>}
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">{tr.agentPhoneLabel}</label>
        <Input {...register("phone")} type="tel" placeholder={tr.phonePlaceholder} />
        {errors.phone && <p className="text-xs text-destructive mt-1">{tr.errPhoneInvalid}</p>}
      </div>

      <div>
        <PasswordField
          label={tr.passwordLabel}
          placeholder={tr.passwordPlaceholder}
          show={showPwd}
          onToggle={() => setShowPwd((v) => !v)}
          error={undefined}
          {...register("password")}
        />
        <PasswordChecklist
          value={passwordValue}
          labels={{ min8: tr.pwdMin8, upper: tr.pwdUppercase, lower: tr.pwdLowercase, special: tr.pwdSpecial }}
        />
      </div>

      <PasswordField
        label={tr.confirmPasswordLabel}
        placeholder={tr.confirmPasswordPlaceholder}
        show={showConfirm}
        onToggle={() => setShowConfirm((v) => !v)}
        error={errors.confirmPassword ? tr.errPasswordMismatch : undefined}
        {...register("confirmPassword")}
      />

      <TermsField
        error={errors.terms ? tr.errTermsRequired : undefined}
        termsText={tr.termsAccept}
        termsLink={tr.termsLink}
        termsAnd={tr.termsAnd}
        privacyLink={tr.privacyLink}
        {...register("terms")}
      />

      {apiError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
          <p className="text-sm text-destructive">{apiError}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
        {isSubmitting ? tr.creatingAccountBtn : tr.createProfessionalBtn}
      </Button>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterPageInner />
    </Suspense>
  );
}

type AccountType = "user" | "agent";

function RegisterPageInner() {
  const t = useT();
  const tr = t.inscription;
  const searchParams = useSearchParams();
  const [accountType, setAccountType] = useState<AccountType>(
    searchParams.get("type") === "agent" ? "agent" : "user",
  );
  const router = useRouter();

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
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
          <p className="text-sm text-muted-foreground mt-3">{tr.subtitle}</p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-8">
          <h1 className="text-xl font-semibold mb-5 text-center">{tr.title}</h1>

          {/* Account type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setAccountType("user")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                accountType === "user"
                  ? "bg-card shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4" />
              {tr.tabUser}
            </button>
            <button
              type="button"
              onClick={() => setAccountType("agent")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                accountType === "agent"
                  ? "bg-card shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              {tr.tabAgent}
            </button>
          </div>

          {/* Form — keyed so it resets when switching type */}
          {accountType === "user" ? (
            <UserForm key="user" onSuccess={() => router.push("/acheter")} />
          ) : (
            <AgentForm key="agent" onSuccess={(path) => router.push(path)} />
          )}

          {/* Bottom links */}
          <div className="mt-6 space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              {tr.alreadyHaveAccount}{" "}
              <Link
                href={accountType === "agent" ? "/connexion-agent" : "/connexion"}
                className="text-primary font-medium hover:underline"
              >
                {tr.signInLink}
              </Link>
            </p>
            {accountType === "user" && (
              <p className="text-xs text-muted-foreground">
                {tr.areYouAgent}{" "}
                <button
                  type="button"
                  onClick={() => setAccountType("agent")}
                  className="text-primary font-medium hover:underline"
                >
                  {tr.createProfessionalLink}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
