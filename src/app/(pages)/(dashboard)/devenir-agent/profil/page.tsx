"use client";

import { useEffect, useState } from "react";
import { KINSHASA_COMMUNES } from "@/constants/kinshasa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useAgentSignupStore } from "@/store/useAgentSignupStore";
import { completeAgentProfile } from "@/services/agentAuth";

// ─── Constants ────────────────────────────────────────────────────────────────

const AGENT_TYPES = [
  { value: "COMMISSIONNAIRE", label: "Commissionnaire indépendant" },
  { value: "AGENT",           label: "Agent immobilier" },
  { value: "AGENCY_OWNER",    label: "Propriétaire d'agence" },
  { value: "OTHER",           label: "Autre" },
] as const;

const RENTAL_FOCUS = [
  { value: "LONG_TERM",  label: "Long terme" },
  { value: "SHORT_TERM", label: "Court terme" },
  { value: "BOTH",       label: "Les deux" },
] as const;

const YEARS_EXP = [
  "Moins de 1 an",
  "1 à 3 ans",
  "3 à 5 ans",
  "Plus de 5 ans",
];

const COMMUNES = KINSHASA_COMMUNES;

const PROPERTY_TYPES = [
  "Appartements", "Villas", "Studios", "Commerciaux",
  "Terrains", "Entrepôts",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AgentProfileStepPage() {
  const router = useRouter();
  const { token, agentPhone, clear } = useAgentSignupStore();

  const [agentType, setAgentType]           = useState("COMMISSIONNAIRE");
  const [whatsapp, setWhatsapp]             = useState(agentPhone ?? "");
  const [communes, setCommunes]             = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes]   = useState<string[]>([]);
  const [rentalFocus, setRentalFocus]       = useState("LONG_TERM");
  const [yearsExperienceLabel, setYearsExp] = useState("");
  const [bio, setBio]                       = useState("");
  const [error, setError]                   = useState<string | null>(null);
  const [submitting, setSubmitting]         = useState(false);

  useEffect(() => {
    if (!token) router.replace("/devenir-agent");
  }, [token, router]);

  if (!token) return null;

  function toggleItem(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) { router.replace("/devenir-agent"); return; }
    if (communes.length === 0) { setError("Sélectionnez au moins une commune d'intervention."); return; }
    if (propertyTypes.length === 0) { setError("Sélectionnez au moins un type de bien."); return; }
    if (!yearsExperienceLabel) { setError("Indiquez votre niveau d'expérience."); return; }

    setError(null);
    setSubmitting(true);
    try {
      await completeAgentProfile(token, {
        agentType,
        whatsapp: whatsapp || undefined,
        communes,
        propertyTypes,
        rentalFocus,
        yearsExperienceLabel,
        bio: bio || undefined,
      });
      clear();
      router.push("/devenir-agent/en-attente");
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/">
            <Image src="/assets/images/company-logo.png" alt="Okapi Real Estate"
              width={120} height={48} className="h-20 w-auto" priority />
          </Link>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className="inline-flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">✓</span>
                Compte créé
              </span>
              <span className="flex-1 h-px bg-border" />
              <span className="inline-flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">✓</span>
                E-mail vérifié
              </span>
              <span className="flex-1 h-px bg-border" />
              <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">3</span>
                Profil
              </span>
            </div>
            <h1 className="text-xl font-semibold">Profil professionnel</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Ces informations nous aident à valider votre compte et à vous mettre en relation avec des clients.
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type de profil */}
            <fieldset>
              <legend className="text-sm font-semibold mb-2">
                Type de profil <span className="text-destructive">*</span>
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {AGENT_TYPES.map((t) => (
                  <label key={t.value}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer text-sm transition-colors ${
                      agentType === t.value
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <input type="radio" name="agentType" value={t.value}
                      checked={agentType === t.value}
                      onChange={() => setAgentType(t.value)}
                      className="sr-only" />
                    <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${
                      agentType === t.value ? "border-primary bg-primary" : "border-muted-foreground"
                    }`} />
                    {t.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* WhatsApp */}
            <div>
              <label className="text-sm font-semibold block mb-1.5">
                Numéro WhatsApp <span className="text-destructive">*</span>
              </label>
              <Input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+243 81 234 5678"
                type="tel"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Pré-rempli avec votre numéro de téléphone — modifiable.
              </p>
            </div>

            {/* Communes */}
            <fieldset>
              <legend className="text-sm font-semibold mb-2">
                Communes d'intervention <span className="text-destructive">*</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {COMMUNES.map((c) => (
                  <button key={c} type="button"
                    onClick={() => toggleItem(communes, setCommunes, c)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      communes.includes(c)
                        ? "bg-primary text-white border-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Années d'expérience */}
            <div>
              <label className="text-sm font-semibold block mb-1.5">
                Années d'expérience <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {YEARS_EXP.map((y) => (
                  <label key={y}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-sm transition-colors ${
                      yearsExperienceLabel === y
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <input type="radio" name="yearsExp" value={y}
                      checked={yearsExperienceLabel === y}
                      onChange={() => setYearsExp(y)}
                      className="sr-only" />
                    <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                      yearsExperienceLabel === y ? "border-primary bg-primary" : "border-muted-foreground"
                    }`} />
                    {y}
                  </label>
                ))}
              </div>
            </div>

            {/* Types de biens */}
            <fieldset>
              <legend className="text-sm font-semibold mb-2">
                Types de biens gérés <span className="text-destructive">*</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((p) => (
                  <button key={p} type="button"
                    onClick={() => toggleItem(propertyTypes, setPropertyTypes, p)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      propertyTypes.includes(p)
                        ? "bg-primary text-white border-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Focus location */}
            <fieldset>
              <legend className="text-sm font-semibold mb-2">Type de location</legend>
              <div className="flex gap-3">
                {RENTAL_FOCUS.map((f) => (
                  <label key={f.value}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${
                      rentalFocus === f.value
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <input type="radio" name="rentalFocus" value={f.value}
                      checked={rentalFocus === f.value}
                      onChange={() => setRentalFocus(f.value)}
                      className="sr-only" />
                    <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                      rentalFocus === f.value ? "border-primary bg-primary" : "border-muted-foreground"
                    }`} />
                    {f.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Bio */}
            <div>
              <label className="text-sm font-semibold block mb-1.5">
                Bio courte <span className="text-muted-foreground font-normal">(optionnel)</span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder='Ex: "5 ans d&apos;expérience à Gombe et Limete, spécialisé dans les appartements haut de gamme."'
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground text-right">{bio.length} / 500</p>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Envoi en cours…" : "Terminer mon inscription →"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Vous pourrez compléter votre profil (photo, pièce d'identité) depuis votre espace agent après approbation.
          </p>
        </div>
      </div>
    </div>
  );
}
