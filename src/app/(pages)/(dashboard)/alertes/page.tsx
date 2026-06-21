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
import { useT } from "@/i18n/useT";
import type { Messages } from "@/i18n/types";

function makeAlertSchema(t: Messages) {
  return z.object({
    name: z.string().min(2, t.dashboard.valAlertNameRequired),
    listingType: z.string().optional(),
    category: z.string().optional(),
    city: z.string().optional(),
    suburb: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    minBedrooms: z.string().optional(),
    maxBedrooms: z.string().optional(),
  });
}

type AlertForm = z.infer<ReturnType<typeof makeAlertSchema>>;

function toNum(v: string | undefined) {
  return v && v !== "" ? Number(v) : undefined;
}

export default function AlertsPage() {
  const { token } = useAuthStore();
  const t = useT();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AlertForm>({ resolver: zodResolver(makeAlertSchema(t)) });

  useEffect(() => {
    if (!token) return;
    getAlerts(token)
      .then(setAlerts)
      .catch(() => setError(t.dashboard.errLoadAlerts))
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
      setError(t.dashboard.errCreateAlert);
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;
    try {
      await deleteAlert(token, id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setError(t.dashboard.errDeleteAlert);
    }
  }

  return (
    <UserSidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold ">{t.dashboard.alertsTitle}</h1>
          <Button onClick={() => setShowForm((v) => !v)} size="sm">
            {showForm ? (
              <>
                <X className="w-4 h-4 mr-1.5" />
                {t.dashboard.cancel}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1.5" />
                {t.dashboard.newAlert}
              </>
            )}
          </Button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="bg-card rounded-2xl shadow-sm p-6 border border-primary/20">
            <h2 className="text-base font-semibold  mb-5">
              {t.dashboard.createAlertHeading}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium  block mb-1.5">
                  {t.dashboard.alertNameLabel} <span className="text-destructive">*</span>
                </label>
                <Input {...register("name")} placeholder={t.dashboard.alertNamePlaceholder} />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium  block mb-1.5">
                    {t.dashboard.listingTypeLabel}
                  </label>
                  <select
                    {...register("listingType")}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">{t.dashboard.all}</option>
                    <option value="for-sale">{t.dashboard.forSale}</option>
                    <option value="for-rent">{t.dashboard.forRent}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium  block mb-1.5">
                    {t.dashboard.categoryLabel}
                  </label>
                  <select
                    {...register("category")}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">{t.dashboard.all}</option>
                    <option value="Apartment">{t.dashboard.categoryApartment}</option>
                    <option value="Villa">{t.dashboard.categoryVilla}</option>
                    <option value="House">{t.dashboard.categoryHouse}</option>
                    <option value="Land">{t.dashboard.categoryLand}</option>
                    <option value="Studio">{t.dashboard.categoryStudio}</option>
                    <option value="Commercial">{t.dashboard.categoryCommercial}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium  block mb-1.5">
                    {t.dashboard.cityLabel}
                  </label>
                  <Input {...register("city")} placeholder={t.dashboard.cityPlaceholder} />
                </div>
                <div>
                  <label className="text-sm font-medium  block mb-1.5">
                    {t.dashboard.suburbLabel}
                  </label>
                  <Input {...register("suburb")} placeholder={t.dashboard.suburbPlaceholder} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium  block mb-1.5">
                    {t.dashboard.minPriceLabel}
                  </label>
                  <Input {...register("minPrice")} type="number" placeholder="0" min={0} />
                </div>
                <div>
                  <label className="text-sm font-medium  block mb-1.5">
                    {t.dashboard.maxPriceLabel}
                  </label>
                  <Input {...register("maxPrice")} type="number" placeholder={t.dashboard.unlimited} min={0} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium  block mb-1.5">
                    {t.dashboard.minBedroomsLabel}
                  </label>
                  <Input {...register("minBedrooms")} type="number" placeholder="0" min={0} />
                </div>
                <div>
                  <label className="text-sm font-medium  block mb-1.5">
                    {t.dashboard.maxBedroomsLabel}
                  </label>
                  <Input {...register("maxBedrooms")} type="number" placeholder={t.dashboard.unlimited} min={0} />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t.dashboard.creatingAlert : t.dashboard.createAlertBtn}
                </Button>
              </div>
            </form>
          </div>
        )}

        {loading && (
          <div className="bg-card rounded-2xl p-12 text-center text-muted-foreground text-sm">
            {t.dashboard.loading}
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
            <h2 className="text-base font-semibold  mb-2">
              {t.dashboard.noAlertsTitle}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t.dashboard.noAlertsBody}
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
                      <p className="text-sm font-semibold ">{alert.name}</p>
                      {alert.active === false && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          {t.dashboard.inactive}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[
                        alert.listingType === "for-sale"
                          ? t.dashboard.forSale
                          : alert.listingType === "for-rent"
                          ? t.dashboard.forRent
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
                          : t.dashboard.unlimited}
                      </p>
                    )}
                    {(alert.minBedrooms != null || alert.maxBedrooms != null) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {alert.minBedrooms ?? 0}
                        {alert.maxBedrooms != null
                          ? `–${alert.maxBedrooms}`
                          : "+"}{" "}
                        {t.dashboard.bedroomsSuffix}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.dashboard.createdOn}{" "}
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
                  title={t.dashboard.deleteAlertTitle}
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
