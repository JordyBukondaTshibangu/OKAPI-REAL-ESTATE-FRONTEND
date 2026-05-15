"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import UserSidebarLayout from "@/features/user/components/UserSidebarLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { updateMe, changePassword } from "@/services/auth";

const profileSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Adresse e-mail invalide"),
  phoneNumber: z.string().min(9, "Numéro invalide"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Requis"),
    newPassword: z.string().min(6, "Au moins 6 caractères"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, token, setUser } = useAuthStore();
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phoneNumber: user?.phoneNumber ?? "",
    },
  });

  const {
    register: regPwd,
    handleSubmit: handlePwd,
    reset: resetPwd,
    formState: { errors: pwdErrors, isSubmitting: pwdSubmitting },
  } = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  async function onProfileSubmit(data: ProfileData) {
    setProfileSuccess(false);
    setProfileError(null);
    try {
      const updated = await updateMe(token!, data);
      setUser(updated);
      setProfileSuccess(true);
    } catch {
      setProfileError("Impossible de mettre à jour le profil.");
    }
  }

  async function onPasswordSubmit(data: PasswordData) {
    setPwdSuccess(false);
    setPwdError(null);
    try {
      await changePassword(token!, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPwdSuccess(true);
      resetPwd();
    } catch {
      setPwdError("Mot de passe actuel incorrect ou erreur serveur.");
    }
  }

  return (
    <UserSidebarLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-text-dark">Mon Profil</h1>

        {/* Profile info card */}
        <div className="bg-card rounded-2xl shadow-sm p-8">
          <h2 className="text-base font-semibold text-text-dark mb-6">
            Informations personnelles
          </h2>

          <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">
                  Prénom
                </label>
                <Input {...regProfile("firstName")} />
                {profileErrors.firstName && (
                  <p className="text-xs text-destructive mt-1">
                    {profileErrors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">
                  Nom
                </label>
                <Input {...regProfile("lastName")} />
                {profileErrors.lastName && (
                  <p className="text-xs text-destructive mt-1">
                    {profileErrors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-text-dark block mb-1.5">
                Adresse e-mail
              </label>
              <Input {...regProfile("email")} type="email" />
              {profileErrors.email && (
                <p className="text-xs text-destructive mt-1">
                  {profileErrors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-text-dark block mb-1.5">
                Téléphone
              </label>
              <Input {...regProfile("phoneNumber")} type="tel" />
              {profileErrors.phoneNumber && (
                <p className="text-xs text-destructive mt-1">
                  {profileErrors.phoneNumber.message}
                </p>
              )}
            </div>

            {profileSuccess && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                Profil mis à jour avec succès.
              </div>
            )}
            {profileError && (
              <p className="text-sm text-destructive">{profileError}</p>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={profileSubmitting}>
                {profileSubmitting ? "Enregistrement…" : "Enregistrer les modifications"}
              </Button>
            </div>
          </form>
        </div>

        {/* Password card */}
        <div className="bg-card rounded-2xl shadow-sm p-8">
          <h2 className="text-base font-semibold text-text-dark mb-6">
            Changer le mot de passe
          </h2>

          <form onSubmit={handlePwd(onPasswordSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-text-dark block mb-1.5">
                Mot de passe actuel
              </label>
              <div className="relative">
                <Input
                  {...regPwd("currentPassword")}
                  type={showCurrent ? "text" : "password"}
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  tabIndex={-1}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pwdErrors.currentPassword && (
                <p className="text-xs text-destructive mt-1">
                  {pwdErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-text-dark block mb-1.5">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Input
                  {...regPwd("newPassword")}
                  type={showNew ? "text" : "password"}
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pwdErrors.newPassword && (
                <p className="text-xs text-destructive mt-1">
                  {pwdErrors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-text-dark block mb-1.5">
                Confirmer le nouveau mot de passe
              </label>
              <div className="relative">
                <Input
                  {...regPwd("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pwdErrors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">
                  {pwdErrors.confirmPassword.message}
                </p>
              )}
            </div>

            {pwdSuccess && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                Mot de passe modifié avec succès.
              </div>
            )}
            {pwdError && (
              <p className="text-sm text-destructive">{pwdError}</p>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={pwdSubmitting}>
                {pwdSubmitting ? "Modification…" : "Modifier le mot de passe"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </UserSidebarLayout>
  );
}
