"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bell, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import UserSidebarLayout from "@/features/user/components/UserSidebarLayout";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getAlerts,
  createAlert,
  deleteAlert,
  type Alert,
} from "@/services/auth";

const alertSchema = z.object({
  name: z.string().min(2, "Donnez un nom à votre alerte"),
  listingType: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  suburb: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minBedrooms: z.string().optional(),
  maxBedrooms: z.string().optional(),
});

type AlertForm = z.infer<typeof alertSchema>;

function toNum(v: string | undefined) {
  return v && v !== "" ? Number(v) : undefined;
}

export default function AlertsPage() {
  const { token } = useAuthStore();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AlertForm>({ resolver: zodResolver(alertSchema) });

  useEffect(() => {
    if (!token) return;
    getAlerts(token)
      .then(setAlerts)
      .catch(() => setError("Impossible de charger vos alertes."))
      .finally(() => setLoading(false));
  }, [token]);

  async function onSubmit(data: AlertForm) {
    if (!token) return;
    setError(null);
    try {
      const newAlert = await createAlert(token, {
        name: data.name,
        listingType: data.listingType || undefined,
        category: data.category || undefined,
        city: data.city || undefined,
        suburb: data.suburb || undefined,
        minPrice: toNum(data.minPrice),
        maxPrice: toNum(data.maxPrice),
        minBedrooms: toNum(data.minBedrooms),
        maxBedrooms: toNum(data.maxBedrooms),
        active: true,
      });
      setAlerts((prev) => [newAlert, ...prev]);
      reset();
      setShowForm(false);
    } catch {
      setError("Impossible de créer l'alerte.");
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;
    try {
      await deleteAlert(token, id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setError("Impossible de supprimer cette alerte.");
    }
  }

  return (
    <UserSidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-text-dark">Mes Alertes</h1>
          <Button onClick={() => setShowForm((v) => !v)} size="sm">
            {showForm ? (
              <>
                <X className="w-4 h-4 mr-1.5" />
                Annuler
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1.5" />
                Nouvelle alerte
              </>
            )}
          </Button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="bg-card rounded-2xl shadow-sm p-6 border border-primary/20">
            <h2 className="text-base font-semibold text-text-dark mb-5">
              Créer une nouvelle alerte
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">
                  Nom de l&apos;alerte <span className="text-destructive">*</span>
                </label>
                <Input {...register("name")} placeholder="Ex : Appartement Gombe" />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-dark block mb-1.5">
                    Type d&apos;annonce
                  </label>
                  <select
                    {...register("listingType")}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Tous</option>
                    <option value="for-sale">À vendre</option>
                    <option value="for-rent">À louer</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-dark block mb-1.5">
                    Catégorie
                  </label>
                  <select
                    {...register("category")}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Tous</option>
                    <option value="Apartment">Appartement</option>
                    <option value="Villa">Villa</option>
                    <option value="House">Maison de ville</option>
                    <option value="Land">Terrain</option>
                    <option value="Studio">Studio</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-dark block mb-1.5">
                    Ville
                  </label>
                  <Input {...register("city")} placeholder="Ex : Kinshasa" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-dark block mb-1.5">
                    Quartier
                  </label>
                  <Input {...register("suburb")} placeholder="Ex : Gombe" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-dark block mb-1.5">
                    Prix min (USD)
                  </label>
                  <Input {...register("minPrice")} type="number" placeholder="0" min={0} />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-dark block mb-1.5">
                    Prix max (USD)
                  </label>
                  <Input {...register("maxPrice")} type="number" placeholder="Illimité" min={0} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-dark block mb-1.5">
                    Chambres min
                  </label>
                  <Input {...register("minBedrooms")} type="number" placeholder="0" min={0} />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-dark block mb-1.5">
                    Chambres max
                  </label>
                  <Input {...register("maxBedrooms")} type="number" placeholder="Illimité" min={0} />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Création…" : "Créer l'alerte"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {loading && (
          <div className="bg-card rounded-2xl p-12 text-center text-muted-foreground text-sm">
            Chargement…
          </div>
        )}

        {!loading && !showForm && error && (
          <div className="bg-card rounded-2xl p-8 text-center text-destructive text-sm">
            {error}
          </div>
        )}

        {!loading && alerts.length === 0 && !showForm && (
          <div className="bg-card rounded-2xl p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-base font-semibold text-text-dark mb-2">
              Aucune alerte configurée
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Créez des alertes pour être notifié dès qu&apos;un bien correspond à vos critères.
            </p>
          </div>
        )}

        {!loading && alerts.length > 0 && (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-card rounded-2xl shadow-sm p-5 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      alert.active !== false
                        ? "bg-primary/10"
                        : "bg-muted"
                    }`}
                  >
                    <Bell
                      className={`w-4 h-4 ${
                        alert.active !== false ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-text-dark">{alert.name}</p>
                      {alert.active === false && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[
                        alert.listingType === "for-sale"
                          ? "À vendre"
                          : alert.listingType === "for-rent"
                          ? "À louer"
                          : null,
                        alert.category,
                        alert.city,
                        alert.suburb,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {(alert.minPrice || alert.maxPrice) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {alert.minPrice
                          ? `${alert.minPrice.toLocaleString("fr-CD")} USD`
                          : "0 USD"}{" "}
                        —{" "}
                        {alert.maxPrice
                          ? `${alert.maxPrice.toLocaleString("fr-CD")} USD`
                          : "Illimité"}
                      </p>
                    )}
                    {(alert.minBedrooms != null || alert.maxBedrooms != null) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {alert.minBedrooms ?? 0}
                        {alert.maxBedrooms != null
                          ? `–${alert.maxBedrooms}`
                          : "+"}{" "}
                        chambre{(alert.maxBedrooms ?? 99) > 1 ? "s" : ""}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Créée le{" "}
                      {new Date(alert.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(alert.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                  title="Supprimer l'alerte"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}
