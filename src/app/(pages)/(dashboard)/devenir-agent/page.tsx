"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerAgent } from "@/services/agentAuth";
import { useAgentSignupStore } from "@/store/useAgentSignupStore";
import { useT } from "@/i18n/useT";

type FormData = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

export default function AgentRegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const { setSignup } = useAgentSignupStore();
  const t = useT();
  const s = t.agentSignup;

  // Build schema from translated error messages so validation errors follow locale
  const schema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(2, s.errNameRequired),
          email: z.string().email(s.errEmailInvalid),
          phoneNumber: z
            .string()
            .min(8, s.errPhoneInvalid)
            .regex(/^\+?[\d\s\-()]+$/, s.errPhoneFormat),
          password: z.string().min(6, s.errPasswordMin),
          confirmPassword: z.string(),
        })
        .refine((d) => d.password === d.confirmPassword, {
          message: s.errPasswordMismatch,
          path: ["confirmPassword"],
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [s],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setApiError(null);
    try {
      const result = await registerAgent({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });
      setSignup(result.access_token, result.agent.name, result.agent.email, data.phoneNumber);
      router.push("/devenir-agent/verification");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number; data?: { message?: string } } })?.response?.status;
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      if (status === 409) {
        setApiError(
          typeof msg === "string" && msg.includes("Email")
            ? s.errEmailTaken
            : s.errPhoneTaken,
        );
      } else {
        setApiError(s.errGeneric);
      }
    }
  }

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
              className="h-24 w-auto"
              priority
            />
          </Link>
          <p className="text-sm text-muted-foreground mt-3 text-center">
            {s.registerTagline}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-8">
          <h1 className="text-xl font-semibold mb-1 text-center">{s.registerTitle}</h1>
          <p className="text-xs text-muted-foreground text-center mb-6">{s.registerSubtitle}</p>

          {apiError && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium block mb-1.5">{s.labelFullName}</label>
              <Input
                {...register("name")}
                placeholder="Jean Kalala"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium block mb-1.5">{s.labelEmail}</label>
              <Input
                {...register("email")}
                type="email"
                placeholder="jean@agence.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium block mb-1.5">{s.labelPhone}</label>
              <Input
                {...register("phoneNumber")}
                type="tel"
                placeholder="+243 81 234 5678"
                className={errors.phoneNumber ? "border-destructive" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-destructive mt-1">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium block mb-1.5">{s.labelPassword}</label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-sm font-medium block mb-1.5">{s.labelConfirmPassword}</label>
              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? s.creatingAccountBtn : s.createAccountBtn}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            {s.alreadyHaveAccount}{" "}
            <Link href="/connexion" className="text-primary font-medium hover:underline">
              {s.signIn}
            </Link>
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          {s.isBuyerOrTenant}{" "}
          <Link href="/inscription" className="text-primary hover:underline">
            {s.createUserAccount}
          </Link>
        </p>
      </div>
    </div>
  );
}
