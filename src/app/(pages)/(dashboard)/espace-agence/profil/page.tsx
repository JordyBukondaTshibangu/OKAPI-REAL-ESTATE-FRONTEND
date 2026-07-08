"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  Loader2,
  Building2,
  Star,
  MapPin,
  Globe,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
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

const LANGUAGES = ["Français", "Lingala", "Anglais", "Swahili", "Kikongo"];

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = {
  name: string;
  phone: string;
  whatsapp: string;
  website: string;
  address: string;
  tagline: string;
  description: string;
  communes: string[];
  propertyTypes: string[];
  rentalFocus: string;
  languages: string[];
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

export default function EditAgencyProfilePage() {
  const router = useRouter();
  const { token, agent: sessionAgent } = useAgentSessionStore();
  const t = useT().espaceAgence;
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    whatsapp: "",
    website: "",
    address: "",
    tagline: "",
    description: "",
    communes: [],
    propertyTypes: [],
    rentalFocus: "LONG_TERM",
    languages: [],
  });

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/connexion-agent");
      return;
    }
    if (sessionAgent?.agentType !== "AGENCY_OWNER") {
      router.replace("/espace-agent");
      return;
    }

    getMyAgentProfile(token)
      .then((p: any) => {
        const a = p?.agency ?? {};
        setForm({
          name: a.name ?? "",
          phone: a.phone ?? "",
          whatsapp: a.whatsapp ?? "",
          website: a.website ?? "",
          address: a.address ?? "",
          tagline: a.tagline ?? "",
          description: a.description ?? "",
          communes: a.communes ?? [],
          propertyTypes: a.propertyTypes ?? [],
          rentalFocus: a.rentalFocus ?? "LONG_TERM",
          languages: a.languages ?? [],
        });
      })
      .catch(() => {
        /* keep defaults */
      })
      .finally(() => setLoading(false));
  }, [hydrated, token, router, sessionAgent]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleArray(
    key: "communes" | "propertyTypes" | "languages",
    val: string,
  ) {
    setForm((f) => {
      const arr = f[key] as string[];
      return {
        ...f,
        [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
      };
    });
  }

  async function handleSave() {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      await axios.patch("/api/proxy/agents/me/agency", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push("/espace-agence");
      }, 1500);
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      setError(
        Array.isArray(msg)
          ? msg.join(", ")
          : (msg ?? "Une erreur est survenue."),
      );
    } finally {
      setSaving(false);
    }
  }

  // Agency logo initials
  const initials = form.name
    ? form.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  // Profile completeness (6 key fields)
  const completedFields = [
    !!form.name.trim(),
    !!form.phone.trim(),
    !!form.tagline.trim(),
    !!form.description.trim(),
    form.communes.length > 0,
    form.propertyTypes.length > 0,
  ].filter(Boolean).length;
  const completenessPercent = Math.round((completedFields / 6) * 100);

  const navSections = [
    { id: "basic-info", label: t.sectionBasicInfo, icon: Building2 },
    { id: "public", label: t.sectionPublic, icon: Star },
    { id: "market", label: t.sectionMarket, icon: MapPin },
  ];

  if (!hydrated || !token) return null;
  if (loading)
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="min-h-screen bg-muted">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/espace-agence"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium">{t.editAgencyTitle}</span>
        </div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-[240px_1fr] gap-5 lg:items-start">
          {/* ── LEFT SIDEBAR ── */}
          <div className="lg:sticky lg:top-6 space-y-4">
            <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
              {/* Agency logo + name — horizontal on mobile, vertical on desktop */}
              <div className="px-4 py-4 lg:px-5 lg:py-6 flex flex-row lg:flex-col items-center gap-4 lg:gap-3 border-b border-border">
                <div className="w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 rounded-xl lg:rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-base lg:text-xl border-2 border-border">
                  {initials}
                </div>
                <div className="flex-1 lg:flex-none lg:text-center min-w-0 lg:w-full">
                  <p className="text-sm font-semibold truncate">
                    {form.name || "—"}
                  </p>
                  {form.tagline && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {form.tagline}
                    </p>
                  )}
                </div>
                {form.website && (
                  <a
                    href={form.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden lg:flex items-center gap-1.5 text-xs text-primary hover:underline truncate max-w-full"
                  >
                    <Globe className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">
                      {form.website.replace(/^https?:\/\//, "")}
                    </span>
                  </a>
                )}
                {/* Mobile website icon */}
                {form.website && (
                  <a
                    href={form.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lg:hidden flex-shrink-0 w-8 h-8 rounded-full border border-border bg-muted flex items-center justify-center hover:bg-muted/80 transition"
                    title={form.website}
                  >
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                  </a>
                )}
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
                    <span>{t.editAgencyTitle}</span>
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
                    className="flex-1 text-xs"
                    asChild
                  >
                    <Link href="/espace-agence">{t.cancelBtn}</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 text-xs"
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
              <SectionHeader icon={Building2} label={t.sectionBasicInfo} />
              <div className="px-6 py-5 space-y-4">
                <Field label={t.labelName} required>
                  <TextInput
                    value={form.name}
                    onChange={(v) => set("name", v)}
                    placeholder="La Référence Living"
                  />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={t.labelPhone} required>
                    <TextInput
                      value={form.phone}
                      onChange={(v) => set("phone", v)}
                      placeholder="+243 81 234 5678"
                      type="tel"
                    />
                  </Field>
                  <Field label={t.labelWhatsapp}>
                    <TextInput
                      value={form.whatsapp}
                      onChange={(v) => set("whatsapp", v)}
                      placeholder="+243 81 234 5678"
                      type="tel"
                    />
                  </Field>
                </div>
                <Field label={t.labelWebsite}>
                  <TextInput
                    value={form.website}
                    onChange={(v) => set("website", v)}
                    placeholder="https://agence.cd"
                    type="url"
                  />
                </Field>
                <Field label={t.labelAddress}>
                  <TextInput
                    value={form.address}
                    onChange={(v) => set("address", v)}
                    placeholder="123 Avenue Kasa-Vubu, Gombe"
                  />
                </Field>
              </div>
            </div>

            {/* ── Public Profile ── */}
            <div
              id="public"
              className="bg-card rounded-2xl shadow-sm overflow-hidden scroll-mt-6"
            >
              <SectionHeader icon={Star} label={t.sectionPublic} />
              <div className="px-6 py-5 space-y-4">
                <Field label={t.labelTagline} hint={t.taglineHint}>
                  <TextInput
                    value={form.tagline}
                    onChange={(v) => set("tagline", v)}
                    placeholder="L'immobilier de confiance à Kinshasa"
                  />
                </Field>
                <Field label={t.labelDescription}>
                  <div className="relative">
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        set("description", e.target.value.slice(0, 800))
                      }
                      placeholder="Présentez votre agence, votre expérience et vos valeurs..."
                      rows={5}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                    />
                    <span className="absolute bottom-2.5 right-3 text-xs text-muted-foreground">
                      {form.description.length} / 800
                    </span>
                  </div>
                </Field>
              </div>
            </div>

            {/* ── Activity & Market ── */}
            <div
              id="market"
              className="bg-card rounded-2xl shadow-sm overflow-hidden scroll-mt-6"
            >
              <SectionHeader icon={MapPin} label={t.sectionMarket} />
              <div className="px-6 py-5 space-y-5">
                {/* Communes + Property types side by side */}
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

                {/* Rental focus + Languages side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label={t.labelRentalFocus} required>
                    <div className="flex flex-col gap-2 mt-1">
                      {[
                        { value: "LONG_TERM", label: t.focusLongTerm },
                        { value: "SHORT_TERM", label: t.focusShortTerm },
                        { value: "BOTH", label: t.focusBoth },
                      ].map(({ value, label }) => (
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

                  <Field label={t.labelLanguages}>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5 mt-1">
                      {LANGUAGES.map((l) => (
                        <label
                          key={l}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.languages.includes(l)}
                            onChange={() => toggleArray("languages", l)}
                            className="accent-primary w-4 h-4 rounded flex-shrink-0"
                          />
                          <span className="text-sm truncate">{l}</span>
                        </label>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
