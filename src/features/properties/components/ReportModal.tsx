"use client";

import { useState } from "react";
import { Flag, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { reportProperty, type ReportReason } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

const REASONS: { value: ReportReason; label: string }[] = [
  { value: "FAKE_LISTING",   label: "Annonce fausse ou inexistante" },
  { value: "WRONG_PRICE",    label: "Prix différent de celui affiché" },
  { value: "STOLEN_PHOTOS",  label: "Photos volées ou trompeuses" },
  { value: "ALREADY_RENTED", label: "Bien déjà loué ou vendu" },
  { value: "SCAM",           label: "Arnaque suspectée" },
  { value: "INAPPROPRIATE",  label: "Contenu inapproprié" },
  { value: "OTHER",          label: "Autre" },
];

interface ReportModalProps {
  propertyId: string;
  onClose: () => void;
}

export default function ReportModal({ propertyId, onClose }: ReportModalProps) {
  const { token, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [reason, setReason] = useState<ReportReason | "">("");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!reason) return;
    if (!isAuthenticated || !token) {
      onClose();
      router.push("/connexion");
      return;
    }
    setSending(true);
    setError(null);
    try {
      await reportProperty(token, propertyId, reason, description.trim() || undefined);
      setSent(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-md bg-white dark:bg-card rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-destructive" />
            <span className="text-sm font-semibold text-foreground">
              Signaler cette annonce
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          /* Success state */
          <div className="px-6 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Signalement envoyé</p>
            <p className="text-xs text-muted-foreground mb-6">
              Merci pour votre contribution. Notre équipe examinera cette annonce sous 24h.
            </p>
            <Button onClick={onClose} variant="outline" size="sm">Fermer</Button>
          </div>
        ) : (
          /* Form */
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-foreground/80">
              Pourquoi signalez-vous cette annonce ?
            </p>

            {/* Reason radio list */}
            <div className="space-y-2">
              {REASONS.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-accent transition-colors"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={value}
                    checked={reason === value}
                    onChange={() => setReason(value)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground">{label}</span>
                </label>
              ))}
            </div>

            {/* Optional description */}
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Description (optionnel)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Précisez le problème…"
                rows={3}
                maxLength={1000}
                className="w-full text-sm border border-border rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white dark:bg-card"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!reason || sending}
                onClick={handleSubmit}
                className="flex-1"
              >
                {sending ? "Envoi…" : "Envoyer le signalement →"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
