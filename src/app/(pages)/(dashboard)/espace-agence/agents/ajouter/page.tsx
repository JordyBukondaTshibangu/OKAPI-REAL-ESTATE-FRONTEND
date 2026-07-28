"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Check, ArrowLeft, Users, UserPlus, Link as LinkIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useMounted } from "@/shared/hooks/useMounted";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { getMyAgentProfile } from "@/services/agentAuth";

type Agency = { id: string; name: string; freeAgentCap?: number; agentCount: number };

export default function AjouterAgentPage() {
  const router = useRouter();
  const { token, agent: sessionAgent } = useAgentSessionStore();
  const hydrated = useMounted();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) { router.replace("/connexion-agent"); return; }
  }, [hydrated, token, router]);

  useEffect(() => {
    if (!token) return;
    getMyAgentProfile(token).then((profile) => {
      if (profile?.agency) setAgency(profile.agency);
    }).catch(() => {});
  }, [token]);

  if (!hydrated || !token) return null;

  const agencySlug = (agency?.name ?? "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const inviteLink = `okapi.cd/rejoindre/${agencySlug}`;
  const fullInviteLink = `https://okapi.cd/devenir-agent?agence=${agency?.id ?? ""}`;

  const cap = agency?.freeAgentCap ?? 3;
  const current = agency?.agentCount ?? 0;
  const atCap = current >= cap;

  function handleCopy() {
    navigator.clipboard.writeText(fullInviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-muted">
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Back */}
        <Link
          href="/espace-agence"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Retour au tableau de bord
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Ajouter un agent
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Invitez un agent à rejoindre votre agence via un lien d&apos;inscription.
          </p>
        </div>

        {/* Cap status card */}
        <div className={`bg-card rounded-2xl shadow-sm p-5 mb-4 border ${atCap ? "border-amber-300" : "border-emerald-200"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${atCap ? "bg-amber-100" : "bg-emerald-50"}`}>
              <Users className={`w-5 h-5 ${atCap ? "text-amber-600" : "text-emerald-600"}`} />
            </div>
            <div>
              <p className="text-sm font-semibold">
                {current} / {cap} agents sur votre plan
              </p>
              <p className="text-xs text-muted-foreground">
                {atCap
                  ? "Vous avez atteint la limite de votre plan actuel."
                  : `Vous pouvez encore ajouter ${cap - current} agent${cap - current > 1 ? "s" : ""}.`}
              </p>
            </div>
          </div>

          {atCap && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">
                Passez au Plan Agence pour des agents illimités.
              </p>
              <Button size="sm" asChild>
                <Link href="/agence">⭐ Voir le Plan Agence ($50/mois)</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Invite link card */}
        {!atCap && (
          <div className="bg-card rounded-2xl shadow-sm p-5">
            <h2 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-primary" />
              Lien d&apos;invitation
            </h2>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Partagez ce lien à l&apos;agent. Il cliquera dessus, remplira sa demande d&apos;inscription, et sera automatiquement rattaché à votre agence.
            </p>

            {/* Link display */}
            <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-3 border border-border">
              <span className="text-xs font-mono flex-1 truncate text-muted-foreground">
                {inviteLink}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  copied
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {copied ? (
                  <><Check className="w-3.5 h-3.5" /> Copié !</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copier</>
                )}
              </button>
            </div>

            {/* How it works */}
            <div className="mt-5 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Comment ça marche</p>
              {[
                { n: "1", text: "Copiez le lien ci-dessus et envoyez-le à l'agent (WhatsApp, SMS, email)." },
                { n: "2", text: "L'agent clique sur le lien, remplit sa demande d'inscription sur Okapi." },
                { n: "3", text: "L'admin Okapi valide le profil — l'agent apparaît ensuite dans votre équipe." },
              ].map((step) => (
                <div key={step.n} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step.n}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to dashboard */}
        <div className="mt-6 text-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/espace-agence">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Retour au tableau de bord
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
