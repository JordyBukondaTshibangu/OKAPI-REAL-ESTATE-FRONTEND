"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, Briefcase, Building2, Check, ChevronRight, Clock, Copy,
  CreditCard, AlertCircle, Calendar, ExternalLink, Hash, Home,
  Loader2, Rocket, ShoppingBag, TreePine, Upload, Warehouse, X, ZoomIn,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useMounted } from "@/shared/hooks/useMounted";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { useT } from "@/i18n/useT";
import {
  type BoostPaymentMethod,
  type BoostRequest,
  createBoostRequest,
  getMyBoosts,
  presignBoostScreenshot,
  updateBoostScreenshot,
} from "@/services/agentAuth";

// ── Constants ─────────────────────────────────────────────────────────────────

const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

const BOOST_PLANS = [
  { id: "week",   durationDays: 7  as const, amount: 5,  recommended: false },
  { id: "biweek", durationDays: 15 as const, amount: 9,  recommended: true  },
  { id: "month",  durationDays: 30 as const, amount: 15, recommended: false },
];

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

// ── Property thumbnail with category fallback ─────────────────────────────────

const CATEGORY_ICON: Record<string, { Icon: LucideIcon; bg: string; color: string }> = {
  apartment:  { Icon: Building2,   bg: "bg-blue-50 dark:bg-blue-950",    color: "text-blue-400" },
  studio:     { Icon: Building2,   bg: "bg-blue-50 dark:bg-blue-950",    color: "text-blue-400" },
  duplex:     { Icon: Building2,   bg: "bg-blue-50 dark:bg-blue-950",    color: "text-blue-400" },
  penthouse:  { Icon: Building2,   bg: "bg-indigo-50 dark:bg-indigo-950",color: "text-indigo-400" },
  villa:      { Icon: Home,        bg: "bg-emerald-50 dark:bg-emerald-950", color: "text-emerald-400" },
  house:      { Icon: Home,        bg: "bg-emerald-50 dark:bg-emerald-950", color: "text-emerald-400" },
  townhouse:  { Icon: Home,        bg: "bg-teal-50 dark:bg-teal-950",    color: "text-teal-400" },
  land:       { Icon: TreePine,    bg: "bg-lime-50 dark:bg-lime-950",    color: "text-lime-500" },
  terrain:    { Icon: TreePine,    bg: "bg-lime-50 dark:bg-lime-950",    color: "text-lime-500" },
  office:     { Icon: Briefcase,   bg: "bg-amber-50 dark:bg-amber-950",  color: "text-amber-400" },
  warehouse:  { Icon: Warehouse,   bg: "bg-orange-50 dark:bg-orange-950",color: "text-orange-400" },
  entrepot:   { Icon: Warehouse,   bg: "bg-orange-50 dark:bg-orange-950",color: "text-orange-400" },
  retail:     { Icon: ShoppingBag, bg: "bg-rose-50 dark:bg-rose-950",    color: "text-rose-400" },
  store:      { Icon: ShoppingBag, bg: "bg-rose-50 dark:bg-rose-950",    color: "text-rose-400" },
  commercial: { Icon: ShoppingBag, bg: "bg-pink-50 dark:bg-pink-950",    color: "text-pink-400" },
};

function PropertyThumb({ src, category, title, className }: { src: string | null; category?: string; title: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const cfg = CATEGORY_ICON[category?.toLowerCase() ?? ""] ?? { Icon: Home, bg: "bg-muted", color: "text-muted-foreground" };
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center ${cfg.bg} ${className ?? ""}`}>
        <cfg.Icon className={`w-12 h-12 ${cfg.color}`} />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={title} className={`object-cover ${className ?? ""}`} onError={() => setFailed(true)} />
  );
}

type T = ReturnType<typeof useT>["espaceAgent"];

// ── Status config ─────────────────────────────────────────────────────────────

function statusConfig(t: T) {
  return {
    PENDING:   { label: t.boostStatusPending,   dot: "bg-yellow-400", badge: "bg-yellow-50 text-yellow-700 ring-yellow-200" },
    CONFIRMED: { label: t.boostStatusConfirmed, dot: "bg-green-500",  badge: "bg-green-50 text-green-700 ring-green-200"  },
    REJECTED:  { label: t.boostStatusRejected,  dot: "bg-red-400",    badge: "bg-red-50 text-red-700 ring-red-200"        },
    EXPIRED:   { label: t.boostStatusExpired,   dot: "bg-gray-300",   badge: "bg-gray-50 text-gray-500 ring-gray-200"    },
  } satisfies Record<BoostRequest["status"], { label: string; dot: string; badge: string }>;
}

// ── Screenshot lightbox ───────────────────────────────────────────────────────

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

// ── 3-step modal ──────────────────────────────────────────────────────────────

type ModalState = { propertyId: string; propertyTitle: string };

function BoostModal({ modal, token, t, onClose, onSuccess }: {
  modal: ModalState; token: string; t: T; onClose: () => void; onSuccess: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPlan, setSelectedPlan] = useState<(typeof BOOST_PLANS)[number] | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<BoostPaymentMethod | null>(null);
  const [reference, setReference] = useState("");
  const [boostId, setBoostId] = useState("");
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
    if (!selectedPlan || !selectedMethod) return;
    setSubmitting(true); setError("");
    try {
      const req = await createBoostRequest(token, modal.propertyId, {
        durationDays: selectedPlan.durationDays,
        paymentMethod: selectedMethod,
      });
      setBoostId(req.id);
      setReference(req.paymentReference ?? "");
      setStep(2);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t.boostErrCreate);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadScreenshot = async (file: File) => {
    setScreenshotUploading(true); setError("");
    try {
      const { key, url } = await presignBoostScreenshot(token, file.name, file.type);
      await fetch("/api/proxy/uploads/put-r2", {
        method: "POST",
        body: file,
        headers: { "Content-Type": file.type, "X-Presigned-Url": url },
      });
      const publicUrl = resolveUrl(key);
      await updateBoostScreenshot(token, boostId, publicUrl);
      setScreenshotUrl(publicUrl);
      setStep(3);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t.boostErrUpload);
    } finally {
      setScreenshotUploading(false);
    }
  };

  const STEPS = [t.boostStep1, t.boostStep2, t.boostStep3];

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
              <h2 className="font-semibold text-base">{t.boostModalTitle}</h2>
              <p className="text-xs text-muted-foreground truncate max-w-[260px]">{modal.propertyTitle}</p>
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
                    ${done ? "bg-amber-500 text-white" : active ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"}`}>
                    {done ? <Check className="w-3.5 h-3.5" /> : idx}
                  </div>
                  <span className={`text-[10px] font-medium ${active ? "text-amber-600" : "text-muted-foreground"}`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-4 rounded ${done ? "bg-amber-400" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {/* ── Step 1 ── */}
          {step === 1 && (
            <>
              <div className="flex flex-col gap-3">
                {BOOST_PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`relative flex items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left transition
                      ${selectedPlan?.id === plan.id ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30" : "border-border hover:border-amber-300"}`}
                  >
                    {plan.recommended && (
                      <span className="absolute -top-2.5 left-4 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {t.boostRecommended}
                      </span>
                    )}
                    <div>
                      <p className="font-semibold text-sm">{plan.durationDays} {t.boostDays}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.boostPlanDesc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-bold text-amber-600">${plan.amount}</p>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition
                        ${selectedPlan?.id === plan.id ? "border-amber-500 bg-amber-500" : "border-border"}`}>
                        {selectedPlan?.id === plan.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{t.boostPaymentMethodLabel}</p>
                <div className="flex gap-2 flex-wrap">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition
                        ${selectedMethod === m.id ? "border-amber-500 bg-amber-50 text-amber-700" : "border-border hover:border-amber-300"}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button
                onClick={handleSubmitRequest}
                disabled={!selectedPlan || !selectedMethod || submitting}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-semibold"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {t.boostContinueBtn} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <>
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 p-4 flex flex-col gap-3">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                  {selectedPlan?.amount} $ — {selectedPlan?.durationDays} {t.boostDays} · {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label}
                </p>
                <div className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                  <p>{t.boostPayNumber} : <strong>{process.env.NEXT_PUBLIC_PAYMENT_NUMBER ?? "+243 XXX XXX XXX"}</strong></p>
                  <p>{t.boostPayName} : <strong>Okapi Real Estate</strong></p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 rounded-lg border px-3 py-2.5">
                  <span className="text-xs text-muted-foreground shrink-0">{t.boostPayRef} :</span>
                  <span className="font-mono font-bold text-amber-700 text-sm flex-1 tracking-wider">{reference}</span>
                  <button onClick={handleCopyRef} className="text-muted-foreground hover:text-foreground transition p-1">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 flex gap-1.5">
                  <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                  {t.boostPayRefWarning}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">
                  {t.boostScreenshotLabel}{" "}
                  <span className="text-muted-foreground font-normal">{t.boostScreenshotOptional}</span>
                </p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadScreenshot(f); }} />
                {screenshotUrl ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
                    <Check className="w-4 h-4" /> {t.boostScreenshotSuccess}
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={screenshotUploading}
                    className="flex items-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-4 text-sm text-muted-foreground hover:border-amber-400 hover:text-foreground transition w-full"
                  >
                    {screenshotUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {screenshotUploading ? t.boostScreenshotUploading : t.boostScreenshotChoose}
                  </button>
                )}
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">{t.boostSkipBtn}</Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={screenshotUploading}
                  className="flex-1 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white"
                >
                  {t.boostPaidBtn} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-base">{t.boostConfirmTitle}</p>
                <p className="text-sm text-muted-foreground mt-1">{t.boostConfirmDesc}</p>
              </div>
              <div className="bg-muted rounded-xl px-4 py-3 text-left w-full text-sm space-y-1">
                <p><span className="text-muted-foreground">{t.boostSummaryPlan}</span> {selectedPlan?.durationDays} {t.boostDays} — ${selectedPlan?.amount}</p>
                <p><span className="text-muted-foreground">{t.boostSummaryPayment}</span> {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label}</p>
                <p><span className="text-muted-foreground">{t.boostSummaryRef}</span> <span className="font-mono font-semibold text-amber-700">{reference}</span></p>
              </div>
              <Button onClick={() => { onSuccess(); onClose(); }} className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white">
                {t.boostDoneBtn}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Boost card ────────────────────────────────────────────────────────────────

function BoostCard({ b, t, onViewScreenshot }: { b: BoostRequest; t: T; onViewScreenshot: (url: string) => void }) {
  const STATUS = statusConfig(t);
  const st = STATUS[b.status];
  const cover = b.property.gallery?.[0] ? resolveUrl(b.property.gallery[0]) : null;
  const location = [b.property.suburb, b.property.city].filter(Boolean).join(", ");
  const screenshotUrl = b.screenshotUrl ? resolveUrl(b.screenshotUrl) : null;

  return (
    <div className="group bg-white dark:bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Cover image */}
        <div className="sm:w-40 h-36 sm:h-auto relative bg-muted shrink-0">
          <PropertyThumb
            src={cover}
            category={b.property.category}
            title={b.property.title}
            className="w-full h-full"
          />
          {/* Status overlay */}
          <div className={`absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ring-1 ${st.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {st.label}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between gap-3">
          <div>
            <p className="font-semibold text-sm line-clamp-1">{b.property.title}</p>
            {location && <p className="text-xs text-muted-foreground mt-0.5">{location}</p>}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{b.durationDays} {t.boostDays} — <span className="font-semibold text-foreground">${b.amount}</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CreditCard className="w-3.5 h-3.5 shrink-0" />
              <span>
                {b.paymentMethod === "ORANGE_MONEY" ? "Orange Money"
                  : b.paymentMethod === "MTN_MONEY" ? "MTN Money"
                  : b.paymentMethod === "AIRTEL_MONEY" ? "Airtel Money"
                  : b.paymentMethod === "MPESA" ? "M-Pesa (Vodacom)"
                  : "—"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
              <Hash className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono font-semibold text-amber-700 tracking-wider">{b.paymentReference ?? "—"}</span>
            </div>
            {b.status === "CONFIRMED" && b.property.boostedUntil && (
              <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
                <Calendar className="w-3.5 h-3.5 shrink-0 text-green-500" />
                <span>{t.boostActiveUntil} <span className="font-medium text-foreground">
                  {new Date(b.property.boostedUntil).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </span></span>
              </div>
            )}
            {b.status === "REJECTED" && b.rejectionReason && (
              <div className="flex items-start gap-1.5 text-red-600 col-span-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span><span className="font-semibold">{t.boostRejectedReason} : </span>{b.rejectionReason}</span>
              </div>
            )}
          </div>

          {/* Screenshot */}
          {screenshotUrl && (
            <button
              onClick={() => onViewScreenshot(screenshotUrl)}
              className="self-start flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              {t.boostViewCapture}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type Tab = "PENDING" | "ACTIVE" | "HISTORY";

function EspaceAgentBoostsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useMounted();
  const { token, isAuthenticated } = useAgentSessionStore();
  const t = useT().espaceAgent;
  const [boosts, setBoosts] = useState<BoostRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [tab, setTab] = useState<Tab>("PENDING");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const loadBoosts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getMyBoosts(token);
      setBoosts(Array.isArray(data) ? data : []);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated || !token) { router.replace("/connexion?agent=1"); return; }
    /* eslint-disable react-hooks/set-state-in-effect -- mount-triggered fetch + URL param parsing, not derived state */
    loadBoosts();
    const pid = searchParams.get("propertyId");
    const ptitle = searchParams.get("title");
    if (pid && ptitle) setModal({ propertyId: pid, propertyTitle: decodeURIComponent(ptitle) });
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, isAuthenticated]);

  if (!mounted) return null;

  const filtered = boosts.filter((b) => {
    if (tab === "PENDING") return b.status === "PENDING";
    if (tab === "ACTIVE") return b.status === "CONFIRMED";
    return b.status === "REJECTED" || b.status === "EXPIRED";
  });

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "PENDING", label: t.boostTabPending, count: boosts.filter((b) => b.status === "PENDING").length },
    { key: "ACTIVE",  label: t.boostTabActive,  count: boosts.filter((b) => b.status === "CONFIRMED").length },
    { key: "HISTORY", label: t.boostTabHistory, count: boosts.filter((b) => ["REJECTED","EXPIRED"].includes(b.status)).length },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background">
      {/* Top nav */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-background/95 backdrop-blur border-b px-4 md:px-8 py-3.5 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-muted transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-sm">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-semibold text-lg">{t.boostsTitle}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">

        {/* Hero banner */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/60 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md shrink-0">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-amber-900 dark:text-amber-300">{t.boostVisibilityTitle}</p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">{t.boostVisibilityDesc}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            {BOOST_PLANS.map((plan) => (
              <span key={plan.id} className="text-xs font-semibold bg-white/80 dark:bg-white/10 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full border border-amber-200">
                {plan.durationDays}{t.boostDays[0]}/${ plan.amount}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b">
          {tabs.map((tabItem) => (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`px-5 py-2.5 text-sm font-medium transition border-b-2 -mb-px
                ${tab === tabItem.key
                  ? "border-amber-500 text-amber-700 dark:text-amber-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {tabItem.label}
              {tabItem.count > 0 && (
                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold
                  ${tab === tabItem.key ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}>
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
              <Rocket className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{t.boostEmpty}</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">{t.boostEmptyDesc}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((b) => (
              <BoostCard key={b.id} b={b} t={t} onViewScreenshot={setLightboxUrl} />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxUrl && <Lightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}

      {/* Boost modal */}
      {modal && token && (
        <BoostModal modal={modal} token={token} t={t} onClose={() => setModal(null)} onSuccess={loadBoosts} />
      )}
    </div>
  );
}

export default function EspaceAgentBoostsPage() {
  return (
    <Suspense fallback={null}>
      <EspaceAgentBoostsPageInner />
    </Suspense>
  );
}
