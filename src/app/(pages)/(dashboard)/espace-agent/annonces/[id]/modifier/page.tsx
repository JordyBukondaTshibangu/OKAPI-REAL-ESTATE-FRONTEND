"use client";

import { useEffect, useRef, useState } from "react";
import { KINSHASA_COMMUNES } from "@/constants/kinshasa";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useMounted } from "@/shared/hooks/useMounted";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { useT } from "@/i18n/useT";

// ─── Constants ─────────────────────────────────────────────────────────────────

const R2_BASE = "https://pub-d5cad4963b964b9ba2720a29b5780d2b.r2.dev/";

const CATEGORIES = [
  { value: "apartment",  label: "Appartement" },
  { value: "villa",      label: "Villa" },
  { value: "studio",     label: "Studio" },
  { value: "duplex",     label: "Duplex" },
  { value: "penthouse",  label: "Penthouse" },
  { value: "house",      label: "Maison" },
  { value: "land",       label: "Terrain" },
  { value: "commercial", label: "Local commercial" },
  { value: "office",     label: "Bureau" },
  { value: "warehouse",  label: "Entrepôt" },
];

const COMMUNES = KINSHASA_COMMUNES;

const CURRENCIES = ["USD", "CDF"];

const AMENITIES = [
  "Eau courante","Électricité","Groupe électrogène","Climatisation",
  "Gardiennage","Parking","Terrasse","Cuisine équipée",
  "Internet","Piscine","Garage","Sécurité 24h/24",
];

// ─── Types ─────────────────────────────────────────────────────────────────────

type FormState = {
  listingType: "rent" | "sale";
  category: string;
  durationType: "longterm" | "shortterm" | "both";
  title: string;
  subtitle: string;
  description: string;
  suburb: string;
  neighborhood: string;
  landmark: string;
  bedrooms: string;
  bathrooms: string;
  areaSqm: string;
  isFurnished: boolean;
  availableFrom: string;
  price: string;
  currency: string;
  period: "month" | "year" | "day";
  pricePerNight: string;
  minStayNights: string;
  maxStayNights: string;
  shortTermNotes: string;
  amenities: string[];
};

// Existing photo already on R2 (URL + the underlying key for the PATCH payload)
type ExistingPhoto = { url: string; key: string };
// New photo staged for upload
type NewPhoto = { file: File; preview: string };

// ─── Helpers ───────────────────────────────────────────────────────────────────

function urlToKey(url: string): string {
  // Strip ALL occurrences of the base URL prefix in case the stored value
  // was double/triple-prefixed from a previous bug.
  let result = url;
  while (result.startsWith(R2_BASE)) result = result.slice(R2_BASE.length);
  return result;
}

function deriveDurationType(
  isShortTerm?: boolean,
  isLongTerm?: boolean
): FormState["durationType"] {
  if (isShortTerm && isLongTerm) return "both";
  if (isShortTerm) return "shortterm";
  return "longterm";
}

// ─── Small components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3">
      {children}
    </p>
  );
}

function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", disabled }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition disabled:opacity-50"
    />
  );
}

function SelectInput({ value, onChange, children }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
    >
      {children}
    </select>
  );
}

function Toggle({ label, value, onChange }: {
  label: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
        value
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background hover:border-primary/40 text-foreground"
      }`}
    >
      <span className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
        value ? "border-primary-foreground bg-primary-foreground/20" : "border-current"
      }`}>
        {value && <CheckCircle2 className="w-3 h-3" />}
      </span>
      {label}
    </button>
  );
}

function StepBar({ step, total }: { step: number; total: number }) {
  const labels = ["Informations", "Localisation", "Prix", "Photos"];
  return (
    <div className="flex items-center gap-1 mb-6">
      {labels.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div key={n} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                done ? "bg-primary text-primary-foreground"
                  : active ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                  : "bg-muted text-muted-foreground"
              }`}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : n}
              </div>
              <span className={`text-[9px] mt-0.5 font-medium whitespace-nowrap ${active ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className={`h-0.5 w-8 mb-3 transition ${done ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 4;

export default function ModifierAnnoncePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token, agent } = useAgentSessionStore();
  const t = useT().espaceAgent;

  const hydrated = useMounted();
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Existing photos (already on R2)
  const [existingPhotos, setExistingPhotos] = useState<ExistingPhoto[]>([]);
  // New photos staged locally
  const [newPhotos, setNewPhotos] = useState<NewPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    listingType: "rent",
    category: "apartment",
    durationType: "longterm",
    title: "",
    subtitle: "",
    description: "",
    suburb: "",
    neighborhood: "",
    landmark: "",
    bedrooms: "",
    bathrooms: "",
    areaSqm: "",
    isFurnished: false,
    availableFrom: "",
    price: "",
    currency: "USD",
    period: "month",
    pricePerNight: "",
    minStayNights: "2",
    maxStayNights: "30",
    shortTermNotes: "",
    amenities: [],
  });

  // Fetch the property and pre-populate form
  useEffect(() => {
    if (!hydrated || !token || !id) return;
    if (!agent) { router.replace("/connexion-agent"); return; }

    axios
      .get(`/api/proxy/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data: p }) => {
        setForm({
          listingType: p.listingType === "sale" ? "sale" : "rent",
          category: p.category ?? "apartment",
          durationType: deriveDurationType(p.isShortTerm, p.isLongTerm),
          title: p.title ?? "",
          subtitle: p.subtitle ?? "",
          description: p.description ?? "",
          suburb: p.suburb ?? "",
          neighborhood: p.neighborhood ?? "",
          landmark: p.landmark ?? "",
          bedrooms: p.bedrooms != null ? String(p.bedrooms) : "",
          bathrooms: p.bathrooms != null ? String(p.bathrooms) : "",
          areaSqm: p.areaSqm != null ? String(p.areaSqm) : "",
          isFurnished: p.isFurnished ?? false,
          availableFrom: p.availableFrom ?? "",
          price: p.price != null ? String(p.price) : "",
          currency: p.currency ?? "USD",
          period: (p.period as FormState["period"]) ?? "month",
          pricePerNight: p.pricePerNight != null ? String(p.pricePerNight) : "",
          minStayNights: p.minStayNights != null ? String(p.minStayNights) : "2",
          maxStayNights: p.maxStayNights != null ? String(p.maxStayNights) : "30",
          shortTermNotes: p.shortTermNotes ?? "",
          amenities: Array.isArray(p.amenities) ? p.amenities : [],
        });

        // Gallery comes back as full URLs — store both url and derived key
        const gallery: string[] = Array.isArray(p.gallery) ? p.gallery : [];
        setExistingPhotos(gallery.map((url: string) => ({ url, key: urlToKey(url) })));
      })
      .catch(() => setError("Impossible de charger l'annonce."))
      .finally(() => setLoadingProperty(false));
  }, [hydrated, token, agent, id, router]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleAmenity(a: string) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  }

  // ── Photo handling ──────────────────────────────────────────────────────────

  const totalPhotos = existingPhotos.length + newPhotos.length;

  function addNewPhotos(files: FileList | null) {
    if (!files) return;
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    const oversized = Array.from(files).find((f) => f.size > MAX_SIZE);
    if (oversized) { setError(t.errImageSize); return; }
    const toAdd = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 15 - totalPhotos);
    setNewPhotos((prev) => [
      ...prev,
      ...toAdd.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
  }

  function removeExisting(index: number) {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function removeNew(index: number) {
    setNewPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function uploadNewPhotos(): Promise<string[]> {
    if (newPhotos.length === 0) return [];

    const files = newPhotos.map((p) => ({
      filename: p.file.name,
      contentType: p.file.type || "image/jpeg",
    }));

    const { data: presigned } = await axios.post(
      "/api/proxy/uploads/presign-property",
      { files },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await Promise.all(
      presigned.map(async ({ url }: { key: string; url: string }, i: number) => {
        await fetch("/api/proxy/uploads/put-r2", {
          method: "POST",
          body: newPhotos[i].file,
          headers: {
            "Content-Type": newPhotos[i].file.type || "image/jpeg",
            "X-Presigned-Url": url,
          },
        });
        setUploadProgress(Math.round(((i + 1) / presigned.length) * 100));
      })
    );

    return presigned.map(({ key }: { key: string }) => key);
  }

  // ── Validation ──────────────────────────────────────────────────────────────

  function validateStep(s: number): string | null {
    if (s === 1) {
      const title = form.title.trim();
      if (!title) return t.errTitle;
      if (title.length < 10) return t.errTitleMin;
      const desc = form.description.trim();
      if (!desc) return t.errDescription;
      if (desc.length < 20) return t.errDescMin;
    }
    if (s === 2) {
      if (!form.suburb) return t.errCommune;
      if (form.bedrooms && (Number(form.bedrooms) < 0 || Number(form.bedrooms) > 50)) return t.errBedroomsRange;
      if (form.bathrooms && (Number(form.bathrooms) < 0 || Number(form.bathrooms) > 30)) return t.errBathroomsRange;
      if (form.areaSqm && (Number(form.areaSqm) < 1 || Number(form.areaSqm) > 100_000)) return t.errAreaRange;
    }
    if (s === 3) {
      const price = Number(form.price);
      if (!form.price || isNaN(price) || price <= 0) return t.errPrice;
      const minPrice = form.currency === "CDF" ? 1_000 : 10;
      if (price < minPrice) return t.errPriceMin;
    }
    return null;
  }

  function handleNext() {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    setError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  // ── Save ────────────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!token || !agent || !id) return;
    const stepErr = validateStep(step);
    if (stepErr) { setError(stepErr); return; }
    setError(null);
    setSaving(true);

    try {
      const newKeys = await uploadNewPhotos();
      // Final gallery = kept existing keys + newly uploaded tmp/ keys
      const gallery = [...existingPhotos.map((p) => p.key), ...newKeys];

      const isRent = form.listingType === "rent";
      const hasShortTerm = form.durationType === "shortterm" || form.durationType === "both";
      const hasLongTerm = form.durationType === "longterm" || form.durationType === "both";

      const payload = {
        listingType:    form.listingType,
        category:       form.category,
        title:          form.title.trim(),
        subtitle:       form.subtitle.trim() || undefined,
        description:    form.description.trim() || undefined,
        price:          Number(form.price),
        currency:       form.currency,
        period:         isRent ? form.period : undefined,
        bedrooms:       form.bedrooms ? Number(form.bedrooms) : 0,
        bathrooms:      form.bathrooms ? Number(form.bathrooms) : 0,
        areaSqm:        form.areaSqm ? Number(form.areaSqm) : 0,
        suburb:         form.suburb,
        neighborhood:   form.neighborhood.trim() || undefined,
        landmark:       form.landmark.trim() || undefined,
        city:           "Kinshasa",
        isFurnished:    form.isFurnished,
        availableFrom:  form.availableFrom || undefined,
        isShortTerm:    hasShortTerm,
        isLongTerm:     hasLongTerm,
        pricePerNight:  hasShortTerm && form.pricePerNight ? Number(form.pricePerNight) : undefined,
        minStayNights:  hasShortTerm && form.minStayNights ? Number(form.minStayNights) : undefined,
        maxStayNights:  hasShortTerm && form.maxStayNights ? Number(form.maxStayNights) : undefined,
        shortTermNotes: hasShortTerm ? form.shortTermNotes.trim() || undefined : undefined,
        amenities:      form.amenities,
        gallery,
      };

      await axios.patch(`/api/proxy/properties/mine/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      router.push("/espace-agent/annonces");
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(", ") : msg ?? t.errPublish);
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  }

  if (!hydrated || !token) return null;

  if (loadingProperty) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── Step content ────────────────────────────────────────────────────────────

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <section>
              <SectionLabel>Type d&apos;annonce</SectionLabel>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: "rent", label: t.typeRent }, { value: "sale", label: t.typeSale }].map(({ value, label }) => (
                  <button key={value} type="button" onClick={() => set("listingType", value as "rent" | "sale")}
                    className={`py-3 rounded-xl border text-sm font-medium transition ${form.listingType === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <SectionLabel>Catégorie de bien</SectionLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map(({ value, label }) => (
                  <button key={value} type="button" onClick={() => set("category", value)}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition text-left ${form.category === value ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:border-primary/30"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </section>

            {form.listingType === "rent" && (
              <section>
                <SectionLabel>Type de location</SectionLabel>
                <div className="grid grid-cols-3 gap-2">
                  {[{ value: "longterm", label: "Long terme" }, { value: "shortterm", label: "Courte durée" }, { value: "both", label: "Les deux" }].map(({ value, label }) => (
                    <button key={value} type="button" onClick={() => set("durationType", value as FormState["durationType"])}
                      className={`py-2.5 rounded-xl border text-sm font-medium transition ${form.durationType === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionLabel>Présentation</SectionLabel>
              <div className="space-y-4">
                <Field label="Titre" required>
                  <TextInput value={form.title} onChange={(v) => set("title", v)} placeholder="Appartement 3 chambres — Gombe" />
                </Field>
                <Field label="Sous-titre" hint="Optionnel">
                  <TextInput value={form.subtitle} onChange={(v) => set("subtitle", v)} placeholder="Résidence calme, proche école" />
                </Field>
                <Field label="Description">
                  <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                    placeholder="Décrivez le bien, ses atouts, l'environnement…" rows={5}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none" />
                </Field>
              </div>
            </section>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <section>
              <SectionLabel>Localisation</SectionLabel>
              <div className="space-y-4">
                <Field label="Commune" required>
                  <SelectInput value={form.suburb} onChange={(v) => set("suburb", v)}>
                    <option value="">— Sélectionner</option>
                    {COMMUNES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </SelectInput>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Quartier / Avenue">
                    <TextInput value={form.neighborhood} onChange={(v) => set("neighborhood", v)} placeholder="Avenue Kalembe Lembe" />
                  </Field>
                  <Field label="Ville">
                    <TextInput value="Kinshasa" onChange={() => {}} disabled />
                  </Field>
                </div>
                <Field label="Point de repère" hint="Aide les visiteurs à localiser rapidement le bien">
                  <TextInput value={form.landmark} onChange={(v) => set("landmark", v)} placeholder="Près du marché central, de l'école Saint-Pierre…" />
                </Field>
              </div>
            </section>

            <section>
              <SectionLabel>Caractéristiques</SectionLabel>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Chambres">
                  <TextInput type="number" value={form.bedrooms} onChange={(v) => set("bedrooms", v)} placeholder="3" />
                </Field>
                <Field label="Salles de bain">
                  <TextInput type="number" value={form.bathrooms} onChange={(v) => set("bathrooms", v)} placeholder="2" />
                </Field>
                <Field label="Surface (m²)">
                  <TextInput type="number" value={form.areaSqm} onChange={(v) => set("areaSqm", v)} placeholder="120" />
                </Field>
              </div>
            </section>

            <section>
              <SectionLabel>Options</SectionLabel>
              <Toggle label="Meublé" value={form.isFurnished} onChange={(v) => set("isFurnished", v)} />
            </section>

            <section>
              <SectionLabel>Disponibilité</SectionLabel>
              <Field label="Disponible à partir du" hint="Laisser vide si disponible immédiatement">
                <TextInput type="date" value={form.availableFrom} onChange={(v) => set("availableFrom", v)} />
              </Field>
            </section>
          </div>
        );

      case 3: {
        const showShortTerm = form.listingType === "rent" && (form.durationType === "shortterm" || form.durationType === "both");
        return (
          <div className="space-y-6">
            <section>
              <SectionLabel>Prix</SectionLabel>
              <div className="flex gap-3">
                <div className="flex-1">
                  <TextInput type="number" value={form.price} onChange={(v) => set("price", v)} placeholder="1500" />
                </div>
                <div className="w-28">
                  <SelectInput value={form.currency} onChange={(v) => set("currency", v)}>
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </SelectInput>
                </div>
                {form.listingType === "rent" && (
                  <div className="w-32">
                    <SelectInput value={form.period} onChange={(v) => set("period", v as FormState["period"])}>
                      <option value="month">/ mois</option>
                      <option value="year">/ an</option>
                      <option value="day">/ jour</option>
                    </SelectInput>
                  </div>
                )}
              </div>
            </section>

            {showShortTerm && (
              <section>
                <SectionLabel>Courte durée</SectionLabel>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Prix / nuit">
                      <TextInput type="number" value={form.pricePerNight} onChange={(v) => set("pricePerNight", v)} placeholder="80" />
                    </Field>
                    <Field label="Séjour min (nuits)">
                      <TextInput type="number" value={form.minStayNights} onChange={(v) => set("minStayNights", v)} placeholder="2" />
                    </Field>
                    <Field label="Séjour max (nuits)">
                      <TextInput type="number" value={form.maxStayNights} onChange={(v) => set("maxStayNights", v)} placeholder="30" />
                    </Field>
                  </div>
                  <Field label="Notes courte durée" hint="Optionnel">
                    <TextInput value={form.shortTermNotes} onChange={(v) => set("shortTermNotes", v)} placeholder="Idéal pour expats, minimum 3 nuits…" />
                  </Field>
                </div>
              </section>
            )}
          </div>
        );
      }

      case 4:
        return (
          <div className="space-y-6">
            <section>
              <SectionLabel>Photos</SectionLabel>
              <p className="text-xs text-muted-foreground mb-3">
                {totalPhotos}/15 photos · La première photo est la couverture
              </p>

              {/* Upload zone */}
              {totalPhotos < 15 && (
                <div
                  className="border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-primary/50 transition mb-3"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); addNewPhotos(e.dataTransfer.files); }}
                >
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1.5" />
                  <p className="text-sm font-medium">Ajouter des photos</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, WebP</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp"
                className="hidden" onChange={(e) => addNewPhotos(e.target.files)} />

              {/* Photo grid — existing first, then new */}
              {(existingPhotos.length > 0 || newPhotos.length > 0) && (
                <div className="grid grid-cols-3 gap-2">
                  {existingPhotos.map((p, i) => (
                    <div key={`ex-${i}`} className="relative group aspect-video rounded-xl overflow-hidden bg-muted">
                      <Image src={p.url} alt={`Photo ${i + 1}`} fill className="object-cover" />
                      {i === 0 && existingPhotos.length > 0 && (
                        <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Couverture
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button type="button" onClick={() => removeExisting(i)}
                          className="bg-destructive/80 hover:bg-destructive text-white rounded p-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {newPhotos.map((p, i) => (
                    <div key={`new-${i}`} className="relative group aspect-video rounded-xl overflow-hidden bg-muted">
                      <Image src={p.preview} alt={`Nouvelle photo ${i + 1}`} fill className="object-cover" />
                      <span className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Nouveau
                      </span>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button type="button" onClick={() => removeNew(i)}
                          className="bg-destructive/80 hover:bg-destructive text-white rounded p-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <SectionLabel>Équipements</SectionLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITIES.map((a) => {
                  const selected = form.amenities.includes(a);
                  return (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      className={`text-left px-3 py-2 rounded-xl border text-sm transition ${
                        selected ? "border-primary bg-primary/10 text-primary font-medium" : "border-border bg-background hover:border-primary/30 text-foreground"
                      }`}>
                      {selected && "✓ "}{a}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        );

      default: return null;
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-muted">
      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/espace-agent/annonces"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium">Modifier l&apos;annonce</span>
        </div>

        <StepBar step={step} total={TOTAL_STEPS} />

        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h1 className="text-base font-semibold">
              {["Informations de base", "Localisation & détails", "Prix", "Photos & équipements"][step - 1]}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">Étape {step} sur {TOTAL_STEPS}</p>
          </div>

          <div className="px-6 py-6">
            {error && (
              <div className="mb-4 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                <X className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {saving && uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Téléchargement des photos…</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {renderStep()}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between gap-3">
            <div>
              {step > 1 ? (
                <Button variant="ghost" size="sm" onClick={() => { setError(null); setStep((s) => s - 1); }} disabled={saving}>
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Retour
                </Button>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/espace-agent/annonces">{t.cancelBtn}</Link>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Save on every step */}
              <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Enregistrement…</>
                ) : (
                  <><Save className="w-3.5 h-3.5 mr-1.5" /> Enregistrer</>
                )}
              </Button>

              {step < TOTAL_STEPS ? (
                <Button size="sm" onClick={handleNext} disabled={saving}>
                  Suivant <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              ) : (
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Enregistrement…</>
                  ) : (
                    "Enregistrer les modifications"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
