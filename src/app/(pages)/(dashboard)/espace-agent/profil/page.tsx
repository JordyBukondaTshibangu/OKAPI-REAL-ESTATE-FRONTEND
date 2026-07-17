"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  Camera,
  Loader2,
  User,
  Briefcase,
  MapPin,
  FileText,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useMounted } from "@/shared/hooks/useMounted";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { getMyAgentProfile } from "@/services/agentAuth";
import { useT } from "@/i18n/useT";

// ─── Constants ────────────────────────────────────────────────────────────────

const COMMUNES = [
  "Gombe",
  "Limete",
  "Ngaliema",
  "Kalamu",
  "Ndjili",
  "Kintambo",
  "Barumbu",
  "Kinshasa (toute)",
  "Lemba",
  "Matete",
  "Selembao",
  "Makala",
  "Bumbu",
  "Masina",
  "N'Sele",
];

const PROPERTY_TYPES = [
  "Appartements",
  "Villas",
  "Studios",
  "Commerciaux",
  "Terrains",
  "Entrepôts",
  "Bureaux",
  "Maisons",
];

const EXPERIENCE_OPTIONS = [
  { value: "< 1 an", label: "< 1 an" },
  { value: "1 à 3 ans", label: "1 à 3 ans" },
  { value: "3 à 5 ans", label: "3 à 5 ans" },
  { value: "> 5 ans", label: "> 5 ans" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = {
  name: string;
  phoneNumber: string;
  whatsappNumber: string;
  agentType: string;
  communes: string[];
  propertyTypes: string[];
  rentalFocus: string;
  yearsExperienceLabel: string;
  bio: string;
};

// ─── Small components ─────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="px-4 py-4 border-b border-border flex items-center gap-2">
      <Icon className="w-4 h-4 text-primary" />
      <h2 className="text-sm font-semibold">{label}</h2>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditProfilePage() {
  const router = useRouter();
  const { token, setAgent, agent: sessionAgent } = useAgentSessionStore();
  const t = useT().espaceAgent;
  const hydrated = useMounted();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [initials, setInitials] = useState("??");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const AGENT_TYPES = [
    { value: "COMMISSIONNAIRE", label: t.typeIndependent },
    { value: "AGENT", label: t.typeAgent },
    { value: "AGENCY_OWNER", label: t.typeAgencyOwner },
    { value: "OTHER", label: t.typeOther },
  ];

  const RENTAL_FOCUS = [
    { value: "LONG_TERM", label: t.focusLongTerm },
    { value: "SHORT_TERM", label: t.focusShortTerm },
    { value: "BOTH", label: t.focusBoth },
  ];

  const [form, setForm] = useState<FormState>({
    name: "",
    phoneNumber: "",
    whatsappNumber: "",
    agentType: "COMMISSIONNAIRE",
    communes: [],
    propertyTypes: [],
    rentalFocus: "LONG_TERM",
    yearsExperienceLabel: "",
    bio: "",
  });

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/connexion-agent");
      return;
    }
    getMyAgentProfile(token)
      .then((p: any) => {
        const raw = p.photo || p.photoUrl || "";
        setAvatarSrc(
          raw.startsWith("https://") && raw.length > 30 ? raw : null,
        );
        const ini = (p.name ?? "")
          .split(" ")
          .map((w: string) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        setInitials(ini || "??");
        setForm({
          name: p.name ?? "",
          phoneNumber: p.phoneNumber ?? "",
          whatsappNumber: p.whatsappNumber ?? "",
          agentType: p.agentType ?? "COMMISSIONNAIRE",
          communes: p.communes ?? [],
          propertyTypes: p.propertyTypes ?? [],
          rentalFocus: p.rentalFocus ?? "LONG_TERM",
          yearsExperienceLabel: p.yearsExperienceLabel ?? "",
          bio: p.bio ?? "",
        });
      })
      .catch(() => {
        if (sessionAgent) {
          const ini = (sessionAgent.name ?? "")
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          setInitials(ini || "??");
          setForm((f) => ({
            ...f,
            name: sessionAgent.name ?? "",
            agentType: sessionAgent.agentType ?? "COMMISSIONNAIRE",
          }));
        }
      })
      .finally(() => setLoading(false));
  }, [hydrated, token, router, sessionAgent]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleArray(key: "communes" | "propertyTypes", val: string) {
    setForm((f) => {
      const arr = f[key];
      return {
        ...f,
        [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
      };
    });
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploadingPhoto(true);
    setError(null);
    try {
      // 1. Get presigned upload URL
      const { data: { url, key } } = await axios.post(
        "/api/proxy/uploads/presign-agent-avatar",
        { filename: file.name, contentType: file.type },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // 2. Upload directly to R2
      await axios.put(url, file, { headers: { "Content-Type": file.type } });
      // 3. Save the key to the agent profile
      await axios.patch(
        "/api/proxy/agents/me/photo",
        { key },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // 4. Show preview immediately (CDN URL loads on next profile fetch)
      setAvatarSrc(URL.createObjectURL(file));
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Impossible de mettre à jour la photo."));
    } finally {
      setUploadingPhoto(false);
      // Reset so the same file can be re-selected if needed
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSave() {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      await axios.patch("/api/proxy/agents/me", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (sessionAgent) {
        setAgent({
          ...sessionAgent,
          name: form.name,
          agentType: form.agentType,
        });
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push("/espace-agent");
      }, 1500);
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(", ") : (msg ?? t.errSave));
    } finally {
      setSaving(false);
    }
  }

  // Profile completeness (5 key fields)
  const completedFields = [
    !!form.name.trim(),
    !!form.phoneNumber.trim(),
    form.communes.length > 0,
    form.propertyTypes.length > 0,
    !!form.bio.trim(),
  ].filter(Boolean).length;
  const completenessPercent = Math.round((completedFields / 5) * 100);

  const navSections = [
    { id: "basic-info", label: t.sectionBasicInfo, icon: User },
    { id: "agent-type", label: t.labelAgentType, icon: Briefcase },
    { id: "market", label: t.sectionMarket, icon: MapPin },
    { id: "public", label: t.sectionPublic, icon: FileText },
  ];

  if (!hydrated || !token) return null;
  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/espace-agent"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium">{t.editProfileTitle}</span>
        </div>

        {/* 2-column layout: sidebar + sections */}
        <div className="flex flex-col lg:grid lg:grid-cols-[240px_1fr] gap-5 lg:items-start">
          {/* ── LEFT SIDEBAR ── */}
          <div className="lg:sticky lg:top-6 space-y-4">
            <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
              {/* Avatar + name — horizontal on mobile, vertical on desktop */}
              <div className="px-4 py-4 lg:px-5 lg:py-6 flex flex-row lg:flex-col items-center gap-4 lg:gap-3 border-b border-border">
                <div className="relative w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0">
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt="Photo"
                      fill
                      className="rounded-full object-cover border-2 border-border"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-base lg:text-lg border-2 border-border">
                      {initials}
                    </div>
                  )}
                </div>
                <div className="flex-1 lg:flex-none lg:text-center min-w-0 lg:w-full">
                  <p className="text-sm font-semibold truncate">
                    {form.name || "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {AGENT_TYPES.find((a) => a.value === form.agentType)
                      ?.label ?? ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="hidden lg:flex items-center gap-1.5 text-xs text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                >
                  {uploadingPhoto
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : <Camera className="w-3 h-3" />}
                  {t.changePhoto}
                </button>
                {/* Mobile change photo: icon only */}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="lg:hidden flex-shrink-0 w-8 h-8 rounded-full border border-border bg-muted flex items-center justify-center hover:bg-muted/80 transition disabled:opacity-50"
                  title={t.changePhoto}
                >
                  {uploadingPhoto
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                    : <Camera className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>

              {/* Section navigation — desktop only */}
              <nav className="hidden lg:block px-3 py-3">
                {navSections.map(({ id, label, icon: Icon }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{label}</span>
                  </a>
                ))}
              </nav>

              {/* Progress + actions */}
              <div className="px-4 lg:px-5 py-4 border-t border-border space-y-3">
                {/* Progress bar — desktop only */}
                <div className="hidden lg:block">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>{t.profileCompleteness}</span>
                    <span className="font-medium text-foreground">
                      {completenessPercent}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${completenessPercent}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs whitespace-nowrap"
                    asChild
                  >
                    <Link href="/espace-agent">{t.cancelBtn}</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 text-xs whitespace-nowrap"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      t.saveBtn
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: form sections ── */}
          <div className="space-y-4 min-w-0">
            {/* Banners */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3">
                {t.profileUpdated}
              </div>
            )}

            {/* ── Basic Information ── */}
            <div
              id="basic-info"
              className="bg-card rounded-2xl shadow-sm overflow-hidden scroll-mt-6"
            >
              <SectionHeader icon={User} label={t.sectionBasicInfo} />
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={t.labelName} required>
                    <TextInput
                      value={form.name}
                      onChange={(v) => set("name", v)}
                      placeholder="Kinsley Koman"
                    />
                  </Field>
                  <Field label={t.labelPhone} required>
                    <TextInput
                      value={form.phoneNumber}
                      onChange={(v) => set("phoneNumber", v)}
                      placeholder="+243 81 234 5678"
                      type="tel"
                    />
                  </Field>
                </div>
                <Field label={t.labelWhatsapp} hint={t.whatsappHint}>
                  <TextInput
                    value={form.whatsappNumber}
                    onChange={(v) => set("whatsappNumber", v)}
                    placeholder="+243 81 234 5678"
                    type="tel"
                  />
                </Field>
              </div>
            </div>

            {/* ── Agent Type ── */}
            <div
              id="agent-type"
              className="bg-card rounded-2xl shadow-sm overflow-hidden scroll-mt-6"
            >
              <SectionHeader icon={Briefcase} label={t.labelAgentType} />
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AGENT_TYPES.map(({ value, label }) => (
                    <label
                      key={value}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition ${
                        form.agentType === value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="agentType"
                        value={value}
                        checked={form.agentType === value}
                        onChange={() => set("agentType", value)}
                        className="accent-primary w-4 h-4"
                      />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Activity & Market ── */}
            <div
              id="market"
              className="bg-card rounded-2xl shadow-sm overflow-hidden scroll-mt-6"
            >
              <SectionHeader icon={MapPin} label={t.sectionMarket} />
              <div className="px-6 py-5 space-y-5">
                {/* Communes + Property types side by side on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label={t.labelCommunes} required>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5 mt-1">
                      {COMMUNES.map((c) => (
                        <label
                          key={c}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.communes.includes(c)}
                            onChange={() => toggleArray("communes", c)}
                            className="accent-primary w-4 h-4 rounded flex-shrink-0"
                          />
                          <span className="text-sm truncate">{c}</span>
                        </label>
                      ))}
                    </div>
                  </Field>

                  <Field label={t.labelPropertyTypes} required>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5 mt-1">
                      {PROPERTY_TYPES.map((p) => (
                        <label
                          key={p}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.propertyTypes.includes(p)}
                            onChange={() => toggleArray("propertyTypes", p)}
                            className="accent-primary w-4 h-4 rounded flex-shrink-0"
                          />
                          <span className="text-sm truncate">{p}</span>
                        </label>
                      ))}
                    </div>
                  </Field>
                </div>

                {/* Rental focus + Experience side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label={t.labelRentalFocus} required>
                    <div className="flex flex-col gap-2 mt-1">
                      {RENTAL_FOCUS.map(({ value, label }) => (
                        <label
                          key={value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="rentalFocus"
                            value={value}
                            checked={form.rentalFocus === value}
                            onChange={() => set("rentalFocus", value)}
                            className="accent-primary w-4 h-4"
                          />
                          <span className="text-sm">{label}</span>
                        </label>
                      ))}
                    </div>
                  </Field>

                  <Field label={t.labelExperience}>
                    <select
                      value={form.yearsExperienceLabel}
                      onChange={(e) =>
                        set("yearsExperienceLabel", e.target.value)
                      }
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition mt-1"
                    >
                      <option value="">—</option>
                      {EXPERIENCE_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            </div>

            {/* ── Public Profile ── */}
            <div
              id="public"
              className="bg-card rounded-2xl shadow-sm overflow-hidden scroll-mt-6"
            >
              <SectionHeader icon={FileText} label={t.sectionPublic} />
              <div className="px-6 py-5">
                <Field label={t.labelBio}>
                  <div className="relative mt-1">
                    <textarea
                      value={form.bio}
                      onChange={(e) => set("bio", e.target.value.slice(0, 500))}
                      placeholder={t.bioPlaceholder}
                      rows={5}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                    />
                    <span className="absolute bottom-2.5 right-3 text-xs text-muted-foreground">
                      {form.bio.length} / 500
                    </span>
                  </div>
                </Field>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
