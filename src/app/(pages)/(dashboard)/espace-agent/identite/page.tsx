"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  ShieldCheck,
  Upload,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { getMyAgentProfile, submitAgentIdentity } from "@/services/agentAuth";
import { KINSHASA_COMMUNES } from "@/constants/kinshasa";
import { useT } from "@/i18n/useT";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadedFile = {
  file: File;
  preview: string;
  key?: string;
  uploading: boolean;
  error?: string;
};

type Status = "idle" | "submitted" | "approved" | "rejected";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maxDobDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split("T")[0];
}

async function presignAndUpload(file: File, token: string): Promise<string> {
  const { data } = await axios.post(
    "/api/proxy/uploads/presign-agent-avatar",
    { filename: file.name, contentType: file.type },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const { url, key } = data as { url: string; key: string };
  const res = await fetch("/api/proxy/uploads/put-r2", {
    method: "POST",
    body: file,
    headers: { "Content-Type": file.type, "X-Presigned-Url": url },
  });
  if (!res.ok) throw new Error("Upload failed");
  return key;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
      {children}
    </h2>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground leading-snug">{hint}</p>}
    </div>
  );
}

function PhotoUploadBox({
  label,
  hint,
  uploaded,
  onChange,
  onRemove,
  disabled,
  clickLabel,
  uploadHint,
  uploadedLabel,
}: {
  label: string;
  hint?: string;
  uploaded: UploadedFile | null;
  onChange: (f: File) => void;
  onRemove: () => void;
  disabled?: boolean;
  clickLabel: string;
  uploadHint: string;
  uploadedLabel: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {uploaded ? (
        <div className="relative rounded-xl overflow-hidden border border-border aspect-video bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={uploaded.preview} alt={label} className="w-full h-full object-contain" />
          {uploaded.uploading && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          {uploaded.error && (
            <div className="absolute inset-0 bg-destructive/10 flex items-center justify-center p-4">
              <p className="text-xs text-destructive text-center">{uploaded.error}</p>
            </div>
          )}
          {!uploaded.uploading && !disabled && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 w-7 h-7 bg-background/80 rounded-full flex items-center justify-center shadow hover:bg-background transition"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>
          )}
          {uploaded.key && !uploaded.uploading && (
            <div className="absolute bottom-2 left-2 bg-emerald-500 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {uploadedLabel}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={disabled}
          className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-6 h-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{clickLabel}</span>
          <span className="text-xs text-muted-foreground/70">{uploadHint}</span>
        </button>
      )}
      {hint && <p className="text-xs text-muted-foreground leading-snug">{hint}</p>}
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IdentitePage() {
  const router = useRouter();
  const { token, _hasHydrated: hydrated } = useAgentSessionStore();
  const t = useT().espaceAgent;

  const [status, setStatus] = useState<Status>("idle");
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const [dob, setDob] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [showIdNumber, setShowIdNumber] = useState(false);
  const [commune, setCommune] = useState("");
  const [idDoc, setIdDoc] = useState<UploadedFile | null>(null);
  const [selfie, setSelfie] = useState<UploadedFile | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) { router.replace("/connexion-agent"); return; }
    getMyAgentProfile(token)
      .then((p: Record<string, unknown>) => {
        const isVerified = p.verificationTier === "VERIFIE";
        const profileComplete = Boolean(p.profileComplete);
        const reason = (p.idDocumentRejectionReason as string) ?? null;
        if (isVerified) setStatus("approved");
        else if (reason) { setStatus("rejected"); setRejectionReason(reason); }
        else if (profileComplete) setStatus("submitted");
        else setStatus("idle");
        if (p.residenceCommune) setCommune(p.residenceCommune as string);
      })
      .finally(() => setLoadingStatus(false));
  }, [hydrated, token, router]);

  function handlePhoto(file: File, setter: (v: UploadedFile | null) => void) {
    if (file.size > 10 * 1024 * 1024) {
      setter({ file, preview: URL.createObjectURL(file), uploading: false, error: t.identiteErrFileTooLarge });
      return;
    }
    const preview = URL.createObjectURL(file);
    setter({ file, preview, uploading: true });
    presignAndUpload(file, token!)
      .then((key) => setter({ file, preview, uploading: false, key }))
      .catch(() => setter({ file, preview, uploading: false, error: t.identiteErrUploadFailed }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!dob) return setSubmitError(t.identiteErrDob);
    if (!idNumber.trim()) return setSubmitError(t.identiteErrIdNumber);
    if (!idDoc?.key) return setSubmitError(t.identiteErrIdDoc);
    if (!commune) return setSubmitError(t.identiteErrCommune);
    if (idDoc.uploading || selfie?.uploading) return setSubmitError(t.identiteErrUploading);
    setSubmitting(true);
    try {
      await submitAgentIdentity(token!, {
        dateOfBirth: new Date(dob).toISOString(),
        nationalIdNumber: idNumber.trim(),
        idDocumentUrl: idDoc.key!,
        selfieUrl: selfie?.key,
        residenceCommune: commune,
      });
      setSubmitSuccess(true);
      setStatus("submitted");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setSubmitError(Array.isArray(msg) ? msg.join(", ") : (msg ?? t.identiteErrGeneric));
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-xl font-bold">{t.identiteApprovedTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.identiteApprovedBody}</p>
        <Button asChild className="mt-4">
          <Link href="/espace-agent">{t.identiteBackToDashboard}</Link>
        </Button>
      </div>
    );
  }

  if (status === "submitted" && !submitSuccess) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-xl font-bold">{t.identitePendingTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.identitePendingBody}</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/espace-agent">{t.identiteBackToDashboard}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/espace-agent" className="p-2 rounded-lg hover:bg-muted transition">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">{t.identiteTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.identiteSubtitle}</p>
        </div>
      </div>

      {/* Rejection banner */}
      {status === "rejected" && rejectionReason && (
        <div className="flex gap-3 bg-destructive/10 border border-destructive/30 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-destructive">{t.identiteRejectedTitle}</p>
            <p className="text-sm text-destructive/80 mt-0.5">{rejectionReason}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.identiteRejectedHint}</p>
          </div>
        </div>
      )}

      {/* Success banner */}
      {submitSuccess && (
        <div className="flex gap-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{t.identiteSuccessTitle}</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">{t.identiteSuccessBody}</p>
          </div>
        </div>
      )}

      {/* Why card */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground">{t.identiteWhyTitle}</p>
        <p>{t.identiteWhyBody}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal identity */}
        <div className="bg-card rounded-2xl shadow-sm p-5 space-y-5">
          <SectionTitle>{t.identiteSectionPersonal}</SectionTitle>

          <Field label={t.identiteDob} hint={t.identiteDobHint}>
            <input
              type="date"
              value={dob}
              max={maxDobDate()}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </Field>

          <Field label={t.identiteIdNumber} hint={t.identiteIdNumberHint}>
            <div className="relative">
              <input
                type={showIdNumber ? "text" : "password"}
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Ex : 123456789"
                required
                className="w-full border border-border rounded-lg px-3 py-2 pr-10 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="button"
                onClick={() => setShowIdNumber((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              >
                {showIdNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </Field>

          <Field label={t.identiteCommune} hint={t.identiteCommuneHint}>
            <select
              value={commune}
              onChange={(e) => setCommune(e.target.value)}
              required
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">—</option>
              {KINSHASA_COMMUNES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Documents */}
        <div className="bg-card rounded-2xl shadow-sm p-5 space-y-5">
          <SectionTitle>{t.identiteSectionDocs}</SectionTitle>

          <PhotoUploadBox
            label={t.identiteIdDoc}
            hint={t.identiteIdDocHint}
            uploaded={idDoc}
            onChange={(f) => handlePhoto(f, setIdDoc)}
            onRemove={() => setIdDoc(null)}
            disabled={submitting || submitSuccess}
            clickLabel={t.identiteClickToUpload}
            uploadHint={t.identiteUploadHint}
            uploadedLabel={t.identiteUploaded}
          />

          <PhotoUploadBox
            label={t.identiteSelfie}
            hint={t.identiteSelfieHint}
            uploaded={selfie}
            onChange={(f) => handlePhoto(f, setSelfie)}
            onRemove={() => setSelfie(null)}
            disabled={submitting || submitSuccess}
            clickLabel={t.identiteClickToUpload}
            uploadHint={t.identiteUploadHint}
            uploadedLabel={t.identiteUploaded}
          />
        </div>

        {/* Error */}
        {submitError && (
          <div className="flex gap-2 bg-destructive/10 border border-destructive/30 rounded-xl p-3">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{submitError}</p>
          </div>
        )}

        {!submitSuccess ? (
          <Button
            type="submit"
            className="w-full"
            disabled={submitting || idDoc?.uploading || selfie?.uploading}
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t.identiteSubmittingBtn}</>
            ) : (
              <><ShieldCheck className="w-4 h-4 mr-2" />{t.identiteSubmitBtn}</>
            )}
          </Button>
        ) : (
          <Button variant="outline" asChild className="w-full">
            <Link href="/espace-agent">{t.identiteBackToDashboard}</Link>
          </Button>
        )}
      </form>
    </div>
  );
}
