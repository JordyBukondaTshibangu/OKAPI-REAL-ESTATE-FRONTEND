"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerUser, getMe } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";

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
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
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
      setAuth(access_token, user);
      router.push("/profil");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        setApiError("Cette adresse e-mail est déjà utilisée.");
      } else {
        setApiError("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
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
                <Link
                  href="/conditions-generales"
                  className="text-primary hover:underline"
                >
                  conditions générales d&apos;utilisation
                </Link>{" "}
                et la{" "}
                <Link
                  href="/confidentialite"
                  className="text-primary hover:underline"
                >
                  politique de confidentialité
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-xs text-destructive -mt-2">
                {errors.terms.message}
              </p>
            )}

            {apiError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive">{apiError}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Création du compte…" : "Créer mon compte"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Déjà un compte ?{" "}
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
