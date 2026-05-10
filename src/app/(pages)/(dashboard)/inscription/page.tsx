"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    firstName: z.string().min(2, "Le prénom est requis"),
    lastName: z.string().min(2, "Le nom est requis"),
    email: z.string().email("Adresse e-mail invalide"),
    phone: z
      .string()
      .min(9, "Numéro de téléphone invalide")
      .regex(/^\+?[\d\s]+$/, "Numéro invalide"),
    password: z.string().min(8, "Au moins 8 caractères"),
    confirmPassword: z.string(),
    terms: z.literal(true, { error: "Vous devez accepter les conditions" }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(_data: FormData) {
    await new Promise((r) => setTimeout(r, 900));
    setDone(true);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center px-4">
        <div className="bg-card rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-dark mb-2">
            Compte créé avec succès !
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Vérifiez votre boîte e-mail pour confirmer votre adresse.
          </p>
          <Button asChild className="w-full">
            <a href="/connexion">Se connecter</a>
          </Button>
        </div>
      </div>
    );
  }

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
          <p className="text-sm text-muted-foreground mt-3">
            Créez votre compte gratuitement en quelques secondes.
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-8">
          <h1 className="text-xl font-semibold text-text-dark mb-6 text-center">
            Inscription
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">
                  Prénom
                </label>
                <Input {...register("firstName")} placeholder="Jean" />
                {errors.firstName && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">
                  Nom
                </label>
                <Input {...register("lastName")} placeholder="Makiese" />
                {errors.lastName && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-text-dark block mb-1.5">
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

            <div>
              <label className="text-sm font-medium text-text-dark block mb-1.5">
                Téléphone
              </label>
              <Input
                {...register("phone")}
                type="tel"
                placeholder="+243 999 000 111"
              />
              {errors.phone && (
                <p className="text-xs text-destructive mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-text-dark block mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPwd ? "text" : "password"}
                  placeholder="Au moins 8 caractères"
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPwd ? (
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

            <div>
              <label className="text-sm font-medium text-text-dark block mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Répétez le mot de passe"
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <input
                {...register("terms")}
                type="checkbox"
                id="terms"
                className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
              />
              <label
                htmlFor="terms"
                className="text-xs text-text-light leading-relaxed"
              >
                J&apos;accepte les{" "}
                <a
                  href="/conditions-generales"
                  className="text-primary hover:underline"
                >
                  conditions générales d&apos;utilisation
                </a>{" "}
                et la{" "}
                <a
                  href="/confidentialite"
                  className="text-primary hover:underline"
                >
                  politique de confidentialité
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-xs text-destructive -mt-2">
                {errors.terms.message}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Création du compte…" : "Créer mon compte"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Déjà un compte ?{" "}
            <a
              href="/connexion"
              className="text-primary font-medium hover:underline"
            >
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
