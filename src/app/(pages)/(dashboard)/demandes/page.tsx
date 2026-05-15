"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import UserSidebarLayout from "@/features/user/components/UserSidebarLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { getEnquiries, deleteEnquiry, type Enquiry } from "@/services/auth";

const STATUS_LABEL: Record<Enquiry["status"], string> = {
  pending: "En attente",
  replied: "Répondu",
  closed: "Clôturé",
};

const STATUS_CLASS: Record<Enquiry["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  replied: "bg-green-100 text-green-700",
  closed: "bg-muted text-muted-foreground",
};

export default function EnquiriesPage() {
  const { token } = useAuthStore();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    getEnquiries(token)
      .then(setEnquiries)
      .catch(() => setError("Impossible de charger vos demandes."))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleDelete(id: string) {
    if (!token) return;
    try {
      await deleteEnquiry(token, id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setError("Impossible de supprimer cette demande.");
    }
  }

  return (
    <UserSidebarLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-text-dark">Mes Demandes</h1>

        {loading && (
          <div className="bg-card rounded-2xl p-12 text-center text-muted-foreground text-sm">
            Chargement…
          </div>
        )}

        {error && (
          <div className="bg-card rounded-2xl p-8 text-center text-destructive text-sm">
            {error}
          </div>
        )}

        {!loading && !error && enquiries.length === 0 && (
          <div className="bg-card rounded-2xl p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-base font-semibold text-text-dark mb-2">
              Aucune demande envoyée
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Contactez un agent depuis une fiche propriété pour soumettre une demande.
            </p>
            <Button asChild>
              <Link href="/acheter">Trouver un bien</Link>
            </Button>
          </div>
        )}

        {!loading && enquiries.length > 0 && (
          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div key={enq.id} className="bg-card rounded-2xl shadow-sm p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-text-dark">
                      {enq.property?.title ?? "Propriété inconnue"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Réf. propriété : {enq.propertyId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_CLASS[enq.status]}`}
                    >
                      {STATUS_LABEL[enq.status]}
                    </span>
                    <button
                      onClick={() => handleDelete(enq.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-text-light line-clamp-2">{enq.message}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  Envoyée le{" "}
                  {new Date(enq.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}
