"use client";

import { useEffect, useRef, useState } from "react";
import { KINSHASA_COMMUNES } from "@/constants/kinshasa";
import { useRouter } from "next/navigation";
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
  SendHorizontal,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useMounted } from "@/shared/hooks/useMounted";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { useT } from "@/i18n/useT";

// ─── Constants ─────────────────────────────────────────────────────────────────

const AMENITY_VALUES = [
  "Eau courante","Électricité","Groupe électrogène","Climatisation",
  "Gardiennage","Parking","Terrasse","Cuisine équipée",
  "Internet","Piscine","Garage","Sécurité 24h/24",
] as const;

const COMMUNES = KINSHASA_COMMUNES;

const CURRENCIES = ["USD", "CDF"];

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

type StagedPhoto = { file: File; preview: string };

// ─── Small components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3">
      {children}
    </p>
  );
}

function Field({
  label, required, hint, children,
}: {
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

function TextInput({
  value, onChange, placeholder, type = "text", disabled,
}: {
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

function SelectInput({
  value, onChange, children, disabled,
}: {
  value: string; onChange: (v: string) => void;
  children: React.ReactNode; disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition disabled:opacity-50"
    >
      {children}
    </select>
  );
}

function Toggle({
  label, value, onChange,
}: {
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
      <span
        className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
          value ? "border-primary-foreground bg-primary-foreground/20" : "border-current"
        }`}
      >
        {value && <CheckCircle2 className="w-3 h-3" />}
      </span>
      {label}
    </button>
  );
}

// ─── Step indicator ─────────────────────────────────────────────────────────────

function StepBar({
  step, labels,
}: {
  step: number; labels: string[];
}) {
  return (
    <div className="flex items-center gap-1 mb-6">
      {labels.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div key={n} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
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

const TOTAL_STEPS = 5;

export default function NouvelleAnnoncePage() {
  const router = useRouter();
  const { token, agent } = useAgentSessionStore();
  const t = useT().espaceAgent;

  // Build translated category and amenity lists inside the component
  const CATEGORIES = [
    { value: "apartment",  label: t.catApartment },
    { value: "villa",      label: t.catVilla },
    { value: "studio",     label: t.catStudio },
    { value: "duplex",     label: t.catDuplex },
    { value: "penthouse",  label: t.catPenthouse },
    { value: "house",      label: t.catHouse },
    { value: "land",       label: t.catLand },
    { value: "commercial", label: t.catCommercial },
    { value: "office",     label: t.catOffice },
    { value: "warehouse",  label: t.catWarehouse },
  ];

  const AMENITY_LABELS = [
    t.amenWater, t.amenElec, t.amenGenerator, t.amenAC,
    t.amenGuard, t.amenParking, t.amenTerrace, t.amenKitchen,
    t.amenInternet, t.amenPool, t.amenGarage, t.amenSecurity,
  ];

  const STEP_LABELS = [t.stepInfoLabel, t.stepLocationLabel, t.stepPriceLabel, t.stepPhotosLabel, t.stepReviewLabel];
  const CARD_HEADERS = [t.cardStep1, t.cardStep2, t.cardStep3, t.cardStep4, t.cardStep5];

  const hydrated = useMounted();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [photos, setPhotos] = useState<StagedPhoto[]>([]);
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

  useEffect(() => {
    if (hydrated && !token) router.replace("/connexion-agent");
  }, [hydrated, token, router]);

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

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    const oversized = Array.from(files).find((f) => f.size > MAX_SIZE);
    if (oversized) { setError(t.errImageSize); return; }
    const toAdd = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 15 - photos.length);
    setPhotos((prev) => [
      ...prev,
      ...toAdd.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  function movePhoto(from: number, to: number) {
    if (to < 0 || to >= photos.length) return;
    setPhotos((prev) => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  }

  async function uploadPhotos(): Promise<string[]> {
    if (photos.length === 0) return [];

    const files = photos.map((p) => ({
      filename: p.file.name,
      contentType: p.file.type || "image/jpeg",
    }));

    const { data: presigned } = await axios.post(
      "/api/proxy/uploads/presign-property",
      { files },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await Promise.all(
      presigned.map(async (
        { url }: { key: string; url: string },
        i: number
      ) => {
        await fetch("/api/proxy/uploads/put-r2", {
          method: "POST",
          body: photos[i].file,
          headers: {
            "Content-Type": photos[i].file.type || "image/jpeg",
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

  /** Full pre-submit check across all steps. */
  function validateForSubmit(): string | null {
    for (let s = 1; s <= 3; s++) {
      const err = validateStep(s);
      if (err) return err;
    }
    return null;
  }

  function handleNext() {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    // Require ≥3 photos before advancing to the review step
    if (step === 4 && photos.length < 3) { setError(t.errMinPhotos); return; }
    setError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  // ── Build payload ───────────────────────────────────────────────────────────

  function buildPayload(gallery: string[]) {
    const isRent = form.listingType === "rent";
    const hasShortTerm = form.durationType === "shortterm" || form.durationType === "both";
    const hasLongTerm = form.durationType === "longterm" || form.durationType === "both";
    return {
      listingType:    form.listingType,
      category:       form.category,
      title:          form.title.trim(),
      subtitle:       form.subtitle.trim() || CATEGORIES.find((c) => c.value === form.category)?.label || form.category,
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
  }

  // ── Submit handlers ─────────────────────────────────────────────────────────

  async function handleSaveDraft() {
    if (!token || !agent) return;
    const stepErr = validateStep(step);
    if (stepErr) { setError(stepErr); return; }
    setError(null);
    setSavingDraft(true);
    try {
      const gallery = await uploadPhotos();
      await axios.post("/api/proxy/properties/mine", buildPayload(gallery), {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/espace-agent/annonces");
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(", ") : msg ?? t.errPublish);
    } finally {
      setSavingDraft(false);
      setUploadProgress(0);
    }
  }

  async function handleSubmit() {
    if (!token || !agent) return;
    if (photos.length < 3) {
      setError(t.errMinPhotos);
      return;
    }
    const stepErr = validateForSubmit();
    if (stepErr) { setError(stepErr); return; }
    setError(null);
    setSubmitting(true);
    try {
      const gallery = await uploadPhotos();
      const { data } = await axios.post("/api/proxy/properties/mine", buildPayload(gallery), {
        headers: { Authorization: `Bearer ${token}` },
      });
      await axios.post(
        `/api/proxy/properties/mine/${data.id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push("/espace-agent/annonces");
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(", ") : msg ?? t.errPublish);
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  }

  if (!hydrated || !token) return null;

  const busy = savingDraft || submitting;
  const missingPhotos = Math.max(0, 3 - photos.length);

  // ── Step content ────────────────────────────────────────────────────────────

  function renderStep() {
    switch (step) {
      // ─────────── STEP 1 ─────────────────────────────────────────────────────
      case 1:
        return (
          <div className="space-y-6">
            <section>
              <SectionLabel>{t.sectionType}</SectionLabel>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: "rent", label: t.typeRent },
                  { value: "sale", label: t.typeSale },
                ] as const).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set("listingType", value)}
                    className={`py-3 rounded-xl border text-sm font-medium transition ${
                      form.listingType === value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <SectionLabel>{t.sectionCategory}</SectionLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set("category", value)}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition text-left ${
                      form.category === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background hover:border-primary/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            {form.listingType === "rent" && (
              <section>
                <SectionLabel>{t.sectionDurationType}</SectionLabel>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: "longterm",  label: t.durationLong },
                    { value: "shortterm", label: t.durationShort },
                    { value: "both",      label: t.durationBoth },
                  ] as const).map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => set("durationType", value)}
                      className={`py-2.5 rounded-xl border text-sm font-medium transition ${
                        form.durationType === value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionLabel>{t.sectionPresentation}</SectionLabel>
              <div className="space-y-4">
                <Field label={t.labelTitle} required>
                  <TextInput
                    value={form.title}
                    onChange={(v) => set("title", v)}
                    placeholder={t.titlePlaceholder}
                  />
                </Field>
                <Field label={t.labelSubtitle} hint={t.subtitleHint}>
                  <TextInput
                    value={form.subtitle}
                    onChange={(v) => set("subtitle", v)}
                    placeholder={t.subtitlePlaceholder}
                  />
                </Field>
                <Field label={t.labelDescription}>
                  <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder={t.descPlaceholder}
                    rows={5}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                  />
                </Field>
              </div>
            </section>
          </div>
        );

      // ─────────── STEP 2 ─────────────────────────────────────────────────────
      case 2:
        return (
          <div className="space-y-6">
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
                  <Field label={t.labelNeighborhood}>
                    <TextInput
                      value={form.neighborhood}
                      onChange={(v) => set("neighborhood", v)}
                      placeholder={t.neighborhoodPlaceholder}
                    />
                  </Field>
                  <Field label={t.labelCity}>
                    <TextInput value="Kinshasa" onChange={() => {}} disabled />
                  </Field>
                </div>
                <Field label={t.labelLandmark} hint={t.landmarkHint}>
                  <TextInput
                    value={form.landmark}
                    onChange={(v) => set("landmark", v)}
                    placeholder={t.landmarkPlaceholder}
                  />
                </Field>
              </div>
            </section>

            <section>
              <SectionLabel>{t.sectionFeatures}</SectionLabel>
              <div className="grid grid-cols-3 gap-3">
                <Field label={t.labelBedrooms}>
                  <TextInput type="number" value={form.bedrooms} onChange={(v) => set("bedrooms", v)} placeholder="3" />
                </Field>
                <Field label={t.labelBathrooms}>
                  <TextInput type="number" value={form.bathrooms} onChange={(v) => set("bathrooms", v)} placeholder="2" />
                </Field>
                <Field label={t.labelArea}>
                  <TextInput type="number" value={form.areaSqm} onChange={(v) => set("areaSqm", v)} placeholder="120" />
                </Field>
              </div>
            </section>

            <section>
              <SectionLabel>{t.sectionOptions}</SectionLabel>
              <div className="flex flex-wrap gap-2">
                <Toggle
                  label={t.labelFurnished}
                  value={form.isFurnished}
                  onChange={(v) => set("isFurnished", v)}
                />
              </div>
            </section>

            <section>
              <SectionLabel>{t.sectionAvailability}</SectionLabel>
              <Field label={t.labelAvailableFrom} hint={t.availableFromHint}>
                <TextInput
                  type="date"
                  value={form.availableFrom}
                  onChange={(v) => set("availableFrom", v)}
                />
              </Field>
            </section>
          </div>
        );

      // ─────────── STEP 3 ─────────────────────────────────────────────────────
      case 3: {
        const showShortTerm =
          form.listingType === "rent" &&
          (form.durationType === "shortterm" || form.durationType === "both");

        return (
          <div className="space-y-6">
            <section>
              <SectionLabel>{t.sectionPrice}</SectionLabel>
              <div className="flex gap-3">
                <div className="flex-1">
                  <TextInput
                    type="number"
                    value={form.price}
                    onChange={(v) => set("price", v)}
                    placeholder="1500"
                  />
                </div>
                <div className="w-28">
                  <SelectInput value={form.currency} onChange={(v) => set("currency", v)}>
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </SelectInput>
                </div>
                {form.listingType === "rent" && (
                  <div className="w-32">
                    <SelectInput value={form.period} onChange={(v) => set("period", v as FormState["period"])}>
                      <option value="month">{t.periodMonth}</option>
                      <option value="year">{t.periodYear}</option>
                      <option value="day">{t.periodDay}</option>
                    </SelectInput>
                  </div>
                )}
              </div>
            </section>

            {showShortTerm && (
              <section>
                <SectionLabel>{t.sectionShortTerm}</SectionLabel>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <Field label={t.labelPricePerNight}>
                      <TextInput
                        type="number"
                        value={form.pricePerNight}
                        onChange={(v) => set("pricePerNight", v)}
                        placeholder="80"
                      />
                    </Field>
                    <Field label={t.labelMinStay}>
                      <TextInput
                        type="number"
                        value={form.minStayNights}
                        onChange={(v) => set("minStayNights", v)}
                        placeholder="2"
                      />
                    </Field>
                    <Field label={t.labelMaxStay}>
                      <TextInput
                        type="number"
                        value={form.maxStayNights}
                        onChange={(v) => set("maxStayNights", v)}
                        placeholder="30"
                      />
                    </Field>
                  </div>
                  <Field label={t.labelShortTermNotes} hint={t.shortTermNotesHint}>
                    <TextInput
                      value={form.shortTermNotes}
                      onChange={(v) => set("shortTermNotes", v)}
                      placeholder={t.shortTermNotesPlaceholder}
                    />
                  </Field>
                </div>
              </section>
            )}
          </div>
        );
      }

      // ─────────── STEP 4 ─────────────────────────────────────────────────────
      case 4:
        return (
          <div className="space-y-6">
            <section>
              <SectionLabel>{t.sectionPhotosLabel} *</SectionLabel>
              <p className="text-xs text-muted-foreground mb-3">{t.photosInstruction}</p>

              <div
                className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  addPhotos(e.dataTransfer.files);
                }}
              >
                <Upload className="w-7 h-7 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">{t.photosDropzone}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {photos.length}/15 · JPG, PNG, WebP
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => addPhotos(e.target.files)}
              />

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {photos.map((p, i) => (
                    <div key={i} className="relative group aspect-video rounded-xl overflow-hidden bg-muted">
                      <Image src={p.preview} alt={`Photo ${i + 1}`} fill className="object-cover" />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {t.coverLabel}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5">
                        {i > 0 && (
                          <button type="button" onClick={() => movePhoto(i, i - 1)}
                            className="bg-white/20 hover:bg-white/30 text-white text-xs rounded px-1.5 py-0.5">←</button>
                        )}
                        <button type="button" onClick={() => removePhoto(i)}
                          className="bg-destructive/80 hover:bg-destructive text-white rounded p-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                        {i < photos.length - 1 && (
                          <button type="button" onClick={() => movePhoto(i, i + 1)}
                            className="bg-white/20 hover:bg-white/30 text-white text-xs rounded px-1.5 py-0.5">→</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {missingPhotos > 0 && (
                <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                  ⚠️ {t.errMinPhotos}
                </p>
              )}
            </section>

            <section>
              <SectionLabel>{t.sectionAmenities}</SectionLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITY_VALUES.map((value, idx) => {
                  const selected = form.amenities.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleAmenity(value)}
                      className={`text-left px-3 py-2 rounded-xl border text-sm transition ${
                        selected
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border bg-background hover:border-primary/30 text-foreground"
                      }`}
                    >
                      {selected && "✓ "}{AMENITY_LABELS[idx]}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        );

      // ─────────── STEP 5: Review & Confirm ───────────────────────────────────
      case 5: {
        const isRent = form.listingType === "rent";
        const hasShortTerm = form.durationType === "shortterm" || form.durationType === "both";
        const categoryLabel = CATEGORIES.find((c) => c.value === form.category)?.label ?? form.category;
        const durationLabel: Record<string, string> = {
          longterm: t.durationLong, shortterm: t.durationShort, both: t.durationBoth,
        };
        const periodLabel: Record<string, string> = {
          month: t.periodMonth, year: t.periodYear, day: t.periodDay,
        };

        function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
          return (
            <div>
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">{title}</p>
              <div className="rounded-xl border border-border bg-muted/30 divide-y divide-border">{children}</div>
            </div>
          );
        }
        function ReviewRow({ label, value }: { label: string; value: string | number }) {
          return (
            <div className="flex items-center justify-between px-3.5 py-2.5 text-sm gap-4">
              <span className="text-muted-foreground shrink-0">{label}</span>
              <span className="font-medium text-right truncate">{String(value) || t.reviewNone}</span>
            </div>
          );
        }

        return (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">{t.reviewBody}</p>

            <ReviewSection title={t.sectionType}>
              <ReviewRow label={t.reviewListingType} value={isRent ? t.typeRent : t.typeSale} />
              <ReviewRow label={t.sectionCategory} value={categoryLabel} />
              {isRent && <ReviewRow label={t.sectionDurationType} value={durationLabel[form.durationType] ?? form.durationType} />}
            </ReviewSection>

            <ReviewSection title={t.sectionPresentation}>
              <ReviewRow label={t.labelTitle} value={form.title || t.reviewNone} />
              <ReviewRow label={t.labelSubtitle} value={form.subtitle || t.reviewNone} />
              <ReviewRow
                label={t.labelDescription}
                value={form.description ? form.description.slice(0, 90) + (form.description.length > 90 ? "…" : "") : t.reviewNone}
              />
            </ReviewSection>

            <ReviewSection title={t.sectionLocation}>
              <ReviewRow label={t.labelCommune} value={form.suburb || t.reviewNone} />
              <ReviewRow label={t.labelNeighborhood} value={form.neighborhood || t.reviewNone} />
              <ReviewRow label={t.labelLandmark} value={form.landmark || t.reviewNone} />
            </ReviewSection>

            <ReviewSection title={t.sectionFeatures}>
              <ReviewRow label={t.labelBedrooms} value={form.bedrooms || t.reviewNone} />
              <ReviewRow label={t.labelBathrooms} value={form.bathrooms || t.reviewNone} />
              <ReviewRow label={t.labelArea} value={form.areaSqm ? `${form.areaSqm} m²` : t.reviewNone} />
              <ReviewRow label={t.labelFurnished} value={form.isFurnished ? t.reviewFurnishedYes : t.reviewFurnishedNo} />
              {form.availableFrom && <ReviewRow label={t.labelAvailableFrom} value={form.availableFrom} />}
            </ReviewSection>

            <ReviewSection title={t.sectionPrice}>
              <ReviewRow
                label={t.labelPrice}
                value={`${form.price} ${form.currency}${isRent ? ` / ${periodLabel[form.period] ?? form.period}` : ""}`}
              />
              {hasShortTerm && form.pricePerNight && (
                <ReviewRow label={t.labelPricePerNight} value={`${form.pricePerNight} ${form.currency} / ${t.periodDay}`} />
              )}
            </ReviewSection>

            <ReviewSection title={t.sectionPhotosLabel}>
              <ReviewRow
                label={t.sectionPhotosLabel}
                value={t.reviewPhotosCount.replace("{n}", String(photos.length))}
              />
            </ReviewSection>

            {form.amenities.length > 0 && (
              <ReviewSection title={t.sectionAmenities}>
                <div className="px-3.5 py-2.5 text-sm">{form.amenities.join(" · ")}</div>
              </ReviewSection>
            )}

            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
              {t.reviewConfirmBody}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-muted">
      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/espace-agent/annonces"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium">{t.newListing}</span>
        </div>

        {/* Step bar */}
        <StepBar step={step} labels={STEP_LABELS} />

        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="px-6 py-4 border-b border-border">
            <h1 className="text-base font-semibold">{CARD_HEADERS[step - 1]}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {step} {t.stepSuffix} {TOTAL_STEPS}
            </p>
          </div>

          {/* Form content */}
          <div className="px-6 py-6">
            {error && (
              <div className="mb-4 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                <X className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {(savingDraft || submitting) && uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{t.uploadingPhotos}</span>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setError(null); setStep((s) => s - 1); }}
                  disabled={busy}
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> {t.backBtn}
                </Button>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/espace-agent/annonces">{t.cancelBtn}</Link>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {step < TOTAL_STEPS && (
                <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={busy}>
                  {savingDraft ? (
                    <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> {t.savingBtn}</>
                  ) : (
                    <><Save className="w-3.5 h-3.5 mr-1.5" /> {t.saveDraftBtn}</>
                  )}
                </Button>
              )}

              {step < TOTAL_STEPS ? (
                <Button size="sm" onClick={handleNext} disabled={busy}>
                  {t.nextBtn} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              ) : (
                <Button size="sm" onClick={handleSubmit} disabled={busy} className="bg-primary">
                  {submitting ? (
                    <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> {t.submittingBtn}</>
                  ) : (
                    <><SendHorizontal className="w-3.5 h-3.5 mr-1.5" /> {t.reviewConfirmBtn}</>
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
