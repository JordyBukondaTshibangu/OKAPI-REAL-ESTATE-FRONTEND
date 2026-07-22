"use client";

import { useEffect, useState } from "react";
import { KINSHASA_COMMUNES } from "@/constants/kinshasa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useMounted } from "@/shared/hooks/useMounted";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { getMyAgentProfile } from "@/services/agentAuth";
import { useT } from "@/i18n/useT";
const CATEGORIES = ["Appartement","Villa","Studio","Duplex","Penthouse","Maison","Terrain","Local commercial","Bureau","Entrepôt"];
const COMMUNES = KINSHASA_COMMUNES;
const CURRENCIES = ["USD", "CDF"];

type FormState = {
  listingType: string; category: string; title: string; subtitle: string;
  price: string; currency: string; period: string;
  bedrooms: string; bathrooms: string; areaSqm: string;
  suburb: string; neighborhood: string; city: string; description: string;
  agentId: string; // which team agent to assign
};

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium">{label}{required && <span className="text-destructive ml-0.5">*</span>}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
  );
}

function SelectInput({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition">
      {children}
    </select>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3 pt-2">{children}</p>;
}

export default function NouvelleAnnonceAgencePage() {
  const router = useRouter();
  const { token, agent: sessionAgent } = useAgentSessionStore();
  const t = useT().espaceAgence;

  const LISTING_TYPES = [{ value: "sale", label: t.typeSale }, { value: "rent", label: t.typeRent }];
  const PERIODS = [{ value: "month", label: t.periodMonth }, { value: "year", label: t.periodYear }, { value: "day", label: t.periodDay }];
  const hydrated = useMounted();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teamAgents, setTeamAgents] = useState<{ id: string; name: string }[]>([]);

  const [form, setForm] = useState<FormState>({
    listingType: "rent", category: "Appartement",
    title: "", subtitle: "", price: "", currency: "USD", period: "month",
    bedrooms: "", bathrooms: "", areaSqm: "",
    suburb: "", neighborhood: "", city: "Kinshasa",
    description: "", agentId: "",
  });

  useEffect(() => {
    if (!hydrated) return;
    if (!token || !sessionAgent?.agencyId) { router.replace("/connexion-agent"); return; }

    // Pre-fill agentId with self if AGENCY_OWNER is also an agent
    setForm((f) => ({ ...f, agentId: sessionAgent.id ?? "" }));

    // Fetch team agents for the "assign to" dropdown
    getMyAgentProfile(token)
      .then((p: any) => {
        // profile.agency not needed here; fetch agents by agencyId
        return axios.get(`/api/proxy/agents?agencyId=${sessionAgent.agencyId}&limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((r) => {
        const data = r.data?.data ?? r.data ?? [];
        setTeamAgents(data.map((a: any) => ({ id: a.id, name: a.name })));
        // Default to current agent
        if (data.length > 0 && !form.agentId) {
          setForm((f) => ({ ...f, agentId: data[0].id }));
        }
      })
      .catch(() => {/* no team agents loaded */});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, token, sessionAgent]);

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    if (!token || !sessionAgent?.agencyId) return;
    setError(null);
    if (!form.title.trim()) { setError(t.errTitle); return; }
    if (!form.price || isNaN(Number(form.price))) { setError(t.errPrice); return; }
    if (!form.suburb) { setError(t.errCommune); return; }

    setSaving(true);
    try {
      const payload = {
        listingType:  form.listingType,
        category:     form.category,
        title:        form.title.trim(),
        subtitle:     form.subtitle.trim() || form.category,
        price:        Number(form.price),
        currency:     form.currency,
        period:       form.listingType === "rent" ? form.period : undefined,
        bedrooms:     form.bedrooms  ? Number(form.bedrooms)  : 0,
        bathrooms:    form.bathrooms ? Number(form.bathrooms) : 0,
        areaSqm:      form.areaSqm   ? Number(form.areaSqm)  : 0,
        suburb:       form.suburb,
        neighborhood: form.neighborhood || undefined,
        city:         form.city,
        description:  form.description || undefined,
        agencyId:     sessionAgent.agencyId,
        agentId:      form.agentId || sessionAgent.id,
        amenities:    [],
        gallery:      [],
      };

      // Use the agent-scoped endpoint
      await axios.post("/api/proxy/properties/mine", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      router.push("/espace-agence/annonces");
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(", ") : msg ?? t.errPublish);
    } finally {
      setSaving(false);
    }
  }

  if (!hydrated || !token) return null;

  return (
    <div className="min-h-screen bg-muted">
      <main className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex items-center gap-3 mb-6">
          <Link href="/espace-agence/annonces" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium">{t.newListing}</span>
        </div>

        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h1 className="text-lg font-semibold">{t.nouvelleTitle}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{t.nouvelleSubtitle}</p>
          </div>

          <div className="px-6 py-6 space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-xl px-4 py-3">{error}</div>
            )}

            {/* Type & Catégorie */}
            <section>
              <SectionLabel>{t.sectionType}</SectionLabel>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {LISTING_TYPES.map(({ value, label }) => (
                  <button key={value} type="button" onClick={() => set("listingType", value)}
                    className={`py-3 rounded-xl border text-sm font-medium transition ${form.listingType === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40"}`}>
                    {label}
                  </button>
                ))}
              </div>
              <Field label={t.labelCommune} required>
                <SelectInput value={form.category} onChange={(v) => set("category", v)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </SelectInput>
              </Field>
            </section>

            {/* Agent assigné */}
            {teamAgents.length > 1 && (
              <section>
                <SectionLabel>{t.assignedAgent}</SectionLabel>
                <Field label={t.assignTo}>
                  <SelectInput value={form.agentId} onChange={(v) => set("agentId", v)}>
                    {teamAgents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </SelectInput>
                </Field>
              </section>
            )}

            {/* Présentation */}
            <section>
              <SectionLabel>{t.sectionPresentation}</SectionLabel>
              <div className="space-y-4">
                <Field label={t.labelTitle} required>
                  <TextInput value={form.title} onChange={(v) => set("title", v)} placeholder={t.titlePlaceholder} />
                </Field>
                <Field label={t.labelSubtitle}>
                  <TextInput value={form.subtitle} onChange={(v) => set("subtitle", v)} placeholder={t.subtitlePlaceholder} />
                </Field>
                <Field label={t.labelDescription}>
                  <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder={t.descPlaceholder} rows={4}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none" />
                </Field>
              </div>
            </section>

            {/* Prix */}
            <section>
              <SectionLabel>{t.sectionPrice}</SectionLabel>
              <div className="flex gap-3">
                <div className="flex-1"><TextInput type="number" value={form.price} onChange={(v) => set("price", v)} placeholder="1500" /></div>
                <div className="w-28"><SelectInput value={form.currency} onChange={(v) => set("currency", v)}>{CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}</SelectInput></div>
                {form.listingType === "rent" && (
                  <div className="w-32"><SelectInput value={form.period} onChange={(v) => set("period", v)}>{PERIODS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}</SelectInput></div>
                )}
              </div>
            </section>

            {/* Caractéristiques */}
            <section>
              <SectionLabel>{t.sectionFeatures}</SectionLabel>
              <div className="grid grid-cols-3 gap-3">
                <Field label={t.labelBedrooms}><TextInput type="number" value={form.bedrooms} onChange={(v) => set("bedrooms", v)} placeholder="3" /></Field>
                <Field label={t.labelBathrooms}><TextInput type="number" value={form.bathrooms} onChange={(v) => set("bathrooms", v)} placeholder="2" /></Field>
                <Field label={t.labelArea}><TextInput type="number" value={form.areaSqm} onChange={(v) => set("areaSqm", v)} placeholder="120" /></Field>
              </div>
            </section>

            {/* Localisation */}
            <section>
              <SectionLabel>{t.sectionLocation}</SectionLabel>
              <div className="space-y-4">
                <Field label={t.labelCommune} required>
                  <SelectInput value={form.suburb} onChange={(v) => set("suburb", v)}>
                    <option value="">{t.communePlaceholder}</option>
                    {COMMUNES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </SelectInput>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label={t.labelNeighborhood}><TextInput value={form.neighborhood} onChange={(v) => set("neighborhood", v)} placeholder={t.neighborhoodPlaceholder} /></Field>
                  <Field label={t.labelCity} required><TextInput value={form.city} onChange={(v) => set("city", v)} placeholder="Kinshasa" /></Field>
                </div>
              </div>
            </section>
          </div>

          <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{t.photosNote}</p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" asChild><Link href="/espace-agence/annonces">{t.cancelBtn}</Link></Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving}>
                {saving ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />{t.publishing}</> : t.publishBtn}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
