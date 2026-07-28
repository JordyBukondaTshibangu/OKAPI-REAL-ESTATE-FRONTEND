"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle, ArrowLeft, Calendar, Check, ChevronRight,
  Copy, CreditCard, Hash, Loader2, Star, Upload, X,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useMounted } from "@/shared/hooks/useMounted";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { useT } from "@/i18n/useT";
import {
  type BoostPaymentMethod,
  type SubscriptionRequest,
  type SubscriptionTier,
  createSubscriptionRequest,
  getMySubscriptions,
  presignSubscriptionScreenshot,
  updateSubscriptionScreenshot,
} from "@/services/agentAuth";

// ── Constants ─────────────────────────────────────────────────────────────────

const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

const PAYMENT_METHODS: { id: BoostPaymentMethod; label: string }[] = [
  { id: "ORANGE_MONEY", label: "Orange Money" },
  { id: "MTN_MONEY",    label: "MTN Money" },
  { id: "AIRTEL_MONEY", label: "Airtel Money" },
  { id: "MPESA",        label: "M-Pesa (Vodacom)" },
];

function resolveUrl(raw: string | null | undefined): string {
  if (!raw) return "";
  if (raw.startsWith("http")) return raw;
  return `${R2_BASE}/${raw.replace(/^\/+/, "")}`;
}

type T = ReturnType<typeof useT>["espaceAgent"];

// ── Lightbox ──────────────────────────────────────────────────────────────────

function Lightbox({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
        onClick={onClose}
      >
        <X className="w-5 h-5 text-white" />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Capture de paiement"
        className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

// ── Plan selection ────────────────────────────────────────────────────────────

const PLANS: {
  id: SubscriptionTier;
  color: string;
  borderActive: string;
  bgActive: string;
  badgeBg: string;
  badgeText: string;
}[] = [
  {
    id: "PRO",
    color: "blue",
    borderActive: "border-blue-500",
    bgActive: "bg-blue-50 dark:bg-blue-950/30",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
  },
  {
    id: "AGENCY",
    color: "purple",
    borderActive: "border-purple-500",
    bgActive: "bg-purple-50 dark:bg-purple-950/30",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
  },
];

// ── 3-step modal ──────────────────────────────────────────────────────────────

function SubscriptionModal({ token, t, onClose, onSuccess }: {
  token: string;
  t: T;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<BoostPaymentMethod | null>(null);
  const [reference, setReference] = useState("");
  const [subId, setSubId] = useState("");
  const [screenshotUploading, setScreenshotUploading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(reference).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmitRequest = async () => {
    if (!selectedTier || !selectedMethod) return;
    setSubmitting(true); setError("");
    try {
      const req = await createSubscriptionRequest(token, {
        tier: selectedTier,
        paymentMethod: selectedMethod,
      });
      setSubId(req.id);
      setReference(req.paymentReference ?? "");
      setStep(2);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t.subErrCreate);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadScreenshot = async (file: File) => {
    setScreenshotUploading(true); setError("");
    try {
      const { key, url } = await presignSubscriptionScreenshot(token, file.name, file.type);
      await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      const publicUrl = resolveUrl(key);
      await updateSubscriptionScreenshot(token, subId, publicUrl);
      setScreenshotUrl(publicUrl);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t.subErrUpload);
    } finally {
      setScreenshotUploading(false);
    }
  };

  const STEPS = [t.subStep1, t.subStep2, t.subStep3];

  const selectedPlan = PLANS.find((p) => p.id === selectedTier);
  const planPrice = selectedTier === "PRO" ? t.subPlanProPrice : t.subPlanAgencyPrice;
  const planLabel = selectedTier === "PRO" ? t.subPlanPro : t.subPlanAgency;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button onClick={() => setStep((s) => (s - 1) as 1|2|3)} className="p-1.5 rounded-lg hover:bg-muted transition">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="font-semibold text-base">{t.subTitle}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-6 pt-4 pb-2 shrink-0">
          {STEPS.map((label, i) => {
            const idx = i + 1;
            const done = step > idx;
            const active = step === idx;
            return (
              <div key={idx} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition
                    ${done || active ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"}`}>
                    {done ? <Check className="w-3.5 h-3.5" /> : idx}
                  </div>
                  <span className={`text-[10px] font-medium ${active ? "text-blue-600" : "text-muted-foreground"}`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-4 rounded ${done ? "bg-blue-400" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {/* ── Step 1: Plan + Payment method ── */}
          {step === 1 && (
            <>
              <div className="flex flex-col gap-3">
                {PLANS.map((plan) => {
                  const isSelected = selectedTier === plan.id;
                  const isPro = plan.id === "PRO";
                  const features = isPro
                    ? [t.subPlanProFeature1, t.subPlanProFeature2, t.subPlanProFeature3]
                    : [t.subPlanAgencyFeature1, t.subPlanAgencyFeature2, t.subPlanAgencyFeature3];
                  const price = isPro ? t.subPlanProPrice : t.subPlanAgencyPrice;
                  const label = isPro ? t.subPlanPro : t.subPlanAgency;

                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedTier(plan.id)}
                      className={`relative flex flex-col rounded-xl border-2 px-4 py-4 text-left transition
                        ${isSelected ? `${plan.borderActive} ${plan.bgActive}` : "border-border hover:border-blue-300"}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${plan.badgeBg} ${plan.badgeText}`}>
                            <Star className="w-3 h-3" />
                            {label}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-lg font-bold text-foreground">{price}</p>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition
                            ${isSelected ? `${plan.borderActive} bg-blue-600` : "border-border"}`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      </div>
                      <ul className="space-y-1">
                        {features.map((f, fi) => (
                          <li key={fi} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Check className="w-3 h-3 text-green-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{t.subPaymentMethodLabel}</p>
                <div className="flex gap-2 flex-wrap">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition
                        ${selectedMethod === m.id ? "border-blue-500 bg-blue-50 text-blue-700" : "border-border hover:border-blue-300"}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button
                onClick={handleSubmitRequest}
                disabled={!selectedTier || !selectedMethod || submitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {t.subContinueBtn} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          )}

          {/* ── Step 2: Payment instructions + screenshot ── */}
          {step === 2 && (
            <>
              <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 p-4 flex flex-col gap-3">
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-400">
                  {planLabel} — {planPrice} · {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label}
                </p>
                <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <p>{t.subPayNumber} : <strong>{process.env.NEXT_PUBLIC_PAYMENT_NUMBER ?? "+243 XXX XXX XXX"}</strong></p>
                  <p>{t.subPayName} : <strong>Okapi Real Estate</strong></p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 rounded-lg border px-3 py-2.5">
                  <span className="text-xs text-muted-foreground shrink-0">{t.subPayRef} :</span>
                  <span className="font-mono font-bold text-blue-700 text-sm flex-1 tracking-wider">{reference}</span>
                  <button onClick={handleCopyRef} className="text-muted-foreground hover:text-foreground transition p-1">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 flex gap-1.5">
                  <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                  {t.subPayRefWarning}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">
                  {t.subScreenshotLabel}{" "}
                  <span className="text-muted-foreground font-normal">{t.subScreenshotOptional}</span>
                </p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadScreenshot(f); }} />
                {screenshotUrl ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
                    <Check className="w-4 h-4" /> {t.subScreenshotSuccess}
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={screenshotUploading}
                    className="flex items-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-4 text-sm text-muted-foreground hover:border-blue-400 hover:text-foreground transition w-full"
                  >
                    {screenshotUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {screenshotUploading ? t.subScreenshotUploading : t.subScreenshotChoose}
                  </button>
                )}
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">{t.subSkipBtn}</Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={screenshotUploading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  {t.subPaidBtn} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          )}

          {/* ── Step 3: Confirmation ── */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-base">{t.subConfirmTitle}</p>
                <p className="text-sm text-muted-foreground mt-1">{t.subConfirmDesc}</p>
              </div>
              <div className="bg-muted rounded-xl px-4 py-3 text-left w-full text-sm space-y-1">
                <p><span className="text-muted-foreground">{t.subSummaryPlan}</span> {planLabel} — {planPrice}</p>
                <p><span className="text-muted-foreground">{t.subSummaryPayment}</span> {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label}</p>
                <p><span className="text-muted-foreground">{t.subSummaryRef}</span> <span className="font-mono font-semibold text-blue-700">{reference}</span></p>
              </div>
              <Button onClick={() => { onSuccess(); onClose(); }} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                {t.subDoneBtn}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Subscription card ─────────────────────────────────────────────────────────

function SubscriptionCard({ sub, t, onViewScreenshot }: {
  sub: SubscriptionRequest;
  t: T;
  onViewScreenshot: (url: string) => void;
}) {
  const screenshotUrl = sub.screenshotUrl ? resolveUrl(sub.screenshotUrl) : null;

  const statusMap: Record<string, { label: string; dot: string; badge: string }> = {
    PENDING:   { label: t.subStatusPending,   dot: "bg-yellow-400", badge: "bg-yellow-50 text-yellow-700 ring-yellow-200" },
    CONFIRMED: { label: t.subStatusConfirmed, dot: "bg-green-500",  badge: "bg-green-50 text-green-700 ring-green-200"  },
    REJECTED:  { label: t.subStatusRejected,  dot: "bg-red-400",    badge: "bg-red-50 text-red-700 ring-red-200"        },
    EXPIRED:   { label: t.subStatusExpired,   dot: "bg-gray-300",   badge: "bg-gray-50 text-gray-500 ring-gray-200"    },
  };

  const tierColors: Record<SubscriptionTier, { bg: string; text: string; icon: string }> = {
    PRO:    { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-600", icon: "text-blue-500" },
    AGENCY: { bg: "bg-purple-50 dark:bg-purple-950", text: "text-purple-600", icon: "text-purple-500" },
  };

  const st = statusMap[sub.status] ?? statusMap.PENDING;
  const tc = tierColors[sub.tier];

  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-start gap-4 p-4">
        {/* Tier icon */}
        <div className={`w-12 h-12 rounded-xl ${tc.bg} flex items-center justify-center shrink-0`}>
          <Star className={`w-6 h-6 ${tc.icon}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <p className={`font-bold text-base ${tc.text}`}>
                {sub.tier === "PRO" ? t.subPlanPro : t.subPlanAgency}
              </p>
              <p className="text-xs text-muted-foreground">
                {sub.tier === "PRO" ? t.subPlanProPrice : t.subPlanAgencyPrice}
              </p>
            </div>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ring-1 ${st.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
              {st.label}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CreditCard className="w-3.5 h-3.5 shrink-0" />
              <span>
                {PAYMENT_METHODS.find((m) => m.id === sub.paymentMethod)?.label ?? sub.paymentMethod}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Hash className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono font-semibold text-blue-700 tracking-wider">{sub.paymentReference ?? "—"}</span>
            </div>
            {sub.status === "CONFIRMED" && sub.periodEnd && (
              <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
                <Calendar className="w-3.5 h-3.5 shrink-0 text-green-500" />
                <span>{t.subActiveUntil} <span className="font-medium text-foreground">
                  {new Date(sub.periodEnd).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </span></span>
              </div>
            )}
            {sub.status === "REJECTED" && sub.rejectionReason && (
              <div className="flex items-start gap-1.5 text-red-600 col-span-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span><span className="font-semibold">{t.subRejectedReason} : </span>{sub.rejectionReason}</span>
              </div>
            )}
          </div>

          {screenshotUrl && (
            <button
              onClick={() => onViewScreenshot(screenshotUrl)}
              className="mt-3 self-start flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              {t.subViewCapture}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type Tab = "PENDING" | "ACTIVE" | "HISTORY";

function EspaceAgentAbonnementPageInner() {
  const router = useRouter();
  const mounted = useMounted();
  const { token, isAuthenticated } = useAgentSessionStore();
  const t = useT().espaceAgent;
  const [subs, setSubs] = useState<SubscriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState<Tab>("PENDING");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const loadSubs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getMySubscriptions(token);
      setSubs(Array.isArray(data) ? data : []);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated || !token) { router.replace("/connexion?agent=1"); return; }
    loadSubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, isAuthenticated]);

  if (!mounted) return null;

  const filtered = subs.filter((s) => {
    if (tab === "PENDING") return s.status === "PENDING";
    if (tab === "ACTIVE") return s.status === "CONFIRMED";
    return s.status === "REJECTED" || s.status === "EXPIRED";
  });

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "PENDING", label: t.subTabPending, count: subs.filter((s) => s.status === "PENDING").length },
    { key: "ACTIVE",  label: t.subTabActive,  count: subs.filter((s) => s.status === "CONFIRMED").length },
    { key: "HISTORY", label: t.subTabHistory, count: subs.filter((s) => ["REJECTED","EXPIRED"].includes(s.status)).length },
  ];

  const hasActiveSub = subs.some((s) => s.status === "CONFIRMED");

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background">
      {/* Top nav */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-background/95 backdrop-blur border-b px-4 md:px-8 py-3.5 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-muted transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Star className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-semibold text-lg">{t.subTitle}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">

        {/* Hero banner */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200/60 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md shrink-0">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-blue-900 dark:text-blue-300">{t.subTitle}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-0.5">{t.subHeroDesc}</p>
          </div>
          {!hasActiveSub && (
            <Button
              onClick={() => setShowModal(true)}
              className="shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md"
            >
              <Star className="w-4 h-4 mr-2" />
              S&apos;abonner
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b">
          {tabs.map((tabItem) => (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`px-5 py-2.5 text-sm font-medium transition border-b-2 -mb-px
                ${tab === tabItem.key
                  ? "border-blue-500 text-blue-700 dark:text-blue-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {tabItem.label}
              {tabItem.count > 0 && (
                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold
                  ${tab === tabItem.key ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground"}`}>
                  {tabItem.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <Star className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{t.subEmpty}</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">{t.subEmptyDesc}</p>
            </div>
            {tab === "PENDING" && !hasActiveSub && (
              <Button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                S&apos;abonner
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((sub) => (
              <SubscriptionCard key={sub.id} sub={sub} t={t} onViewScreenshot={setLightboxUrl} />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxUrl && <Lightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}

      {/* Subscription modal */}
      {showModal && token && (
        <SubscriptionModal
          token={token}
          t={t}
          onClose={() => setShowModal(false)}
          onSuccess={loadSubs}
        />
      )}
    </div>
  );
}

export default function EspaceAgentAbonnementPage() {
  return (
    <Suspense fallback={null}>
      <EspaceAgentAbonnementPageInner />
    </Suspense>
  );
}
