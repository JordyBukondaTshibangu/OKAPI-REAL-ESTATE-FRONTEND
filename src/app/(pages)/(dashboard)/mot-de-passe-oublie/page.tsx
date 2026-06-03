"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { forgotPassword } from "@/services/auth";

const schema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setApiError(null);
    try {
      await forgotPassword(data.email);
      setSent(true);
    } catch {
      setApiError("Une erreur est survenue. Vérifiez l'adresse e-mail et réessayez.");
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center px-4">
        <div className="bg-card rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-not-dark mb-2">
            E-mail envoyé !
          </h2>
          <p className="text-sm text-muted-foreground mb-1">
            Si un compte existe pour{" "}
            <span className="font-medium text-not-dark">{getValues("email")}</span>,
            vous recevrez un lien de réinitialisation dans quelques instants.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Vérifiez également votre dossier spam.
          </p>
          <Button asChild className="w-full">
            <Link href="/connexion">Retour à la connexion</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
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
            Réinitialisez votre mot de passe en quelques secondes.
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-8">
          <h1 className="text-xl font-semibold text-not-dark mb-2 text-center">
            Mot de passe oublié
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-not-dark block mb-1.5">
                Adresse e-mail
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder="vous@exemple.cd"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {apiError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive">{apiError}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Envoi…" : "Envoyer le lien de réinitialisation"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Vous vous souvenez ?{" "}
            <Link
              href="/connexion"
              className="text-primary font-medium hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
