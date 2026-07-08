"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { loginAgent } from "@/services/agentAuth";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";

const schema = z.object({
  identifier: z
    .string()
    .min(1, "Entrez votre e-mail ou numéro de téléphone"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type FormData = z.infer<typeof schema>;

export default function AgentLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const { setSession } = useAgentSessionStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setApiError(null);
    try {
      const { access_token, agent } = await loginAgent(
        data.identifier,
        data.password,
      );
      setSession(access_token, agent);

      // Redirect based on approval state and agent type
      if (!agent.emailVerified) {
        router.push("/devenir-agent/verification");
      } else if (agent.verificationTier === "NON_VERIFIE") {
        router.push("/devenir-agent/en-attente");
      } else if (agent.agentType === "AGENCY_OWNER" && agent.agencyId) {
        router.push("/espace-agence");
      } else {
        router.push("/espace-agent");
      }
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      if (status === 401) {
        setApiError(
          "Identifiants incorrects. Vérifiez votre e-mail ou mot de passe.",
        );
      } else if (status === 403) {
        setApiError(
          "Votre compte n'est pas encore approuvé. Réessayez plus tard.",
        );
      } else {
        setApiError("Une erreur est survenue. Veuillez réessayer.");
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
              className="h-28 w-auto"
              priority
            />
          </Link>
          <p className="text-sm text-muted-foreground mt-3">
            Espace réservé aux agents immobiliers.
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-8">
          <h1 className="text-xl font-semibold mb-1 text-center">
            Connexion agent
          </h1>
          <p className="text-xs text-muted-foreground text-center mb-6">
            Connectez-vous avec votre e-mail ou numéro de téléphone.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Identifier */}
            <div>
              <label className="text-sm font-medium block mb-1.5">
                E-mail ou téléphone
              </label>
              <Input
                {...register("identifier")}
                type="text"
                placeholder="vous@exemple.cd ou +243 81 234 5678"
                autoComplete="username"
              />
              {errors.identifier && (
                <p className="text-xs text-destructive mt-1">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Mot de passe
              </label>
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
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* API error */}
            {apiError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive">{apiError}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Connexion…" : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
            <p>
              Pas encore agent ?{" "}
              <Link
                href="/devenir-agent"
                className="text-primary font-medium hover:underline"
              >
                Rejoindre Okapi
              </Link>
            </p>
            <p>
              Vous êtes un client ?{" "}
              <Link
                href="/connexion"
                className="text-primary font-medium hover:underline"
              >
                Connexion client
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
