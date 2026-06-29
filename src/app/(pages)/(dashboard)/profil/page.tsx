"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, CheckCircle, Eye, EyeOff, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import UserSidebarLayout from "@/features/user/components/UserSidebarLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { useT } from "@/i18n/useT";
import type { Messages } from "@/i18n/types";
import {
  updateMe,
  changePassword,
  uploadAvatar,
  removeAvatar,
  deleteAccount,
} from "@/services/auth";

function makeProfileSchema(t: Messages) {
  return z.object({
    firstName: z.string().min(2, t.dashboard.valFirstNameRequired),
    lastName: z.string().min(2, t.dashboard.valLastNameRequired),
    email: z.string().email(t.dashboard.valEmailInvalid),
    phoneNumber: z.string().min(9, t.dashboard.valPhoneInvalid),
  });
}

function makePasswordSchema(t: Messages) {
  return z
    .object({
      currentPassword: z.string().min(1, t.dashboard.valRequired),
      newPassword: z.string().min(6, t.dashboard.valPasswordMinLength),
      confirmPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: t.dashboard.valPasswordMismatch,
      path: ["confirmPassword"],
    });
}

type ProfileData = z.infer<ReturnType<typeof makeProfileSchema>>;
type PasswordData = z.infer<ReturnType<typeof makePasswordSchema>>;

function avatarUrl(profileImage: string | null | undefined): string | null {
  if (!profileImage) return null;
  // Backend now returns full R2 URLs; pass through as-is
  return profileImage;
}

export default function ProfilePage() {
  const { user, token, setUser, logout } = useAuthStore();
  const router = useRouter();
  const t = useT();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm<ProfileData>({
    resolver: zodResolver(makeProfileSchema(t)),
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
  } = useForm<PasswordData>({ resolver: zodResolver(makePasswordSchema(t)) });

  async function onProfileSubmit(data: ProfileData) {
    setProfileSuccess(false);
    setProfileError(null);
    try {
      const updated = await updateMe(token!, data);
      setUser(updated);
      setProfileSuccess(true);
    } catch {
      setProfileError(t.dashboard.errProfileUpdate);
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
      setPwdError(t.dashboard.errPasswordUpdate);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setAvatarError(null);
    setAvatarLoading(true);
    try {
      const updated = await uploadAvatar(token, file);
      setUser(updated);
    } catch {
      setAvatarError(t.dashboard.errPhotoUpload);
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemoveAvatar() {
    if (!token) return;
    setAvatarError(null);
    setAvatarLoading(true);
    try {
      const updated = await removeAvatar(token);
      setUser(updated);
    } catch {
      setAvatarError(t.dashboard.errPhotoRemove);
    } finally {
      setAvatarLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (!token) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteAccount(token);
      logout();
      router.push("/");
    } catch {
      setDeleteError(t.dashboard.errAccountDelete);
      setDeleteLoading(false);
    }
  }

  const imgSrc = avatarUrl(user?.profileImage);

  return (
    <UserSidebarLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold ">{t.dashboard.profileTitle}</h1>

        {/* Avatar card */}
        <div className="bg-card rounded-2xl shadow-sm p-4 sm:p-8">
          <h2 className="text-base font-semibold mb-4 sm:mb-6">
            {t.dashboard.photoHeading}
          </h2>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="relative shrink-0">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-primary flex items-center justify-center">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={t.dashboard.photoHeading}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <span className="text-white font-bold text-2xl select-none">
                    {user?.firstName?.[0]?.toUpperCase() ?? "U"}
                  </span>
                )}
              </div>
              {avatarLoading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading}
                  className="gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  {imgSrc ? t.dashboard.changePhoto : t.dashboard.addPhoto}
                </Button>
                {imgSrc && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleRemoveAvatar}
                    disabled={avatarLoading}
                    className="gap-1.5 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                    {t.dashboard.removePhoto}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {t.dashboard.photoHint}
              </p>
              {avatarError && (
                <p className="text-xs text-destructive">{avatarError}</p>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        {/* Profile info card */}
        <div className="bg-card rounded-2xl shadow-sm p-4 sm:p-8">
          <h2 className="text-base font-semibold mb-4 sm:mb-6">
            {t.dashboard.personalInfoHeading}
          </h2>
          <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium  block mb-1.5">
                  {t.dashboard.firstName}
                </label>
                <Input {...regProfile("firstName")} />
                {profileErrors.firstName && (
                  <p className="text-xs text-destructive mt-1">
                    {profileErrors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium  block mb-1.5">
                  {t.dashboard.lastName}
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
              <label className="text-sm font-medium  block mb-1.5">
                {t.dashboard.emailLabel}
              </label>
              <Input {...regProfile("email")} type="email" />
              {profileErrors.email && (
                <p className="text-xs text-destructive mt-1">
                  {profileErrors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium  block mb-1.5">
                {t.dashboard.phoneLabel}
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
                {t.dashboard.profileUpdated}
              </div>
            )}
            {profileError && (
              <p className="text-sm text-destructive">{profileError}</p>
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={profileSubmitting}>
                {profileSubmitting ? t.dashboard.saving : t.dashboard.saveChanges}
              </Button>
            </div>
          </form>
        </div>

        {/* Password card */}
        <div className="bg-card rounded-2xl shadow-sm p-4 sm:p-8">
          <h2 className="text-base font-semibold mb-4 sm:mb-6">
            {t.dashboard.changePasswordHeading}
          </h2>
          <form onSubmit={handlePwd(onPasswordSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-medium  block mb-1.5">
                {t.dashboard.currentPassword}
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
              <label className="text-sm font-medium  block mb-1.5">
                {t.dashboard.newPassword}
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
              <label className="text-sm font-medium  block mb-1.5">
                {t.dashboard.confirmNewPassword}
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
                {t.dashboard.passwordUpdated}
              </div>
            )}
            {pwdError && (
              <p className="text-sm text-destructive">{pwdError}</p>
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={pwdSubmitting}>
                {pwdSubmitting ? t.dashboard.changingPassword : t.dashboard.changePasswordBtn}
              </Button>
            </div>
          </form>
        </div>

        {/* Danger zone */}
        <div className="bg-card rounded-2xl shadow-sm p-4 sm:p-8 border border-destructive/20">
          <h2 className="text-base font-semibold text-destructive mb-2">
            {t.dashboard.dangerZoneHeading}
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            {t.dashboard.dangerZoneBody}
          </p>

          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              className="gap-2 border-destructive/40 text-destructive hover:bg-destructive hover:text-white"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4" />
              {t.dashboard.deleteAccountBtn}
            </Button>
          ) : (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-4">
              <p className="text-sm font-medium text-destructive">
                {t.dashboard.deleteAccountConfirm}
              </p>
              {deleteError && (
                <p className="text-xs text-destructive">{deleteError}</p>
              )}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                >
                  {t.dashboard.cancel}
                </Button>
                <Button
                  size="sm"
                  className="bg-destructive hover:bg-destructive/90 text-white gap-2"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                >
                  <Trash2 className="w-4 h-4" />
                  {deleteLoading ? t.dashboard.deletingAccount : t.dashboard.confirmDeleteAccount}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </UserSidebarLayout>
  );
}
