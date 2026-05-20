"use client";

import { useEffect, useState } from "react";
import { Heart, MapPin, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import UserSidebarLayout from "@/features/user/components/UserSidebarLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { getFavourites, removeFavourite, type Favourite } from "@/services/auth";






export default function FavouritesPage() {
  const { token } = useAuthStore();
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    getFavourites(token)
      .then(setFavourites)
      .catch(() => setError("Impossible de charger vos favoris."))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleRemove(propertyId: string) {
    if (!token) return;
    try {
      await removeFavourite(token, propertyId);
      setFavourites((prev) => prev.filter((f) => f.property.id !== propertyId));
    } catch {
      setError("Impossible de supprimer ce favori.");
    }
  }

  
  return (
    <UserSidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-text-dark">Mes Favoris</h1>
          {favourites.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {favourites.length} bien{favourites.length > 1 ? "s" : ""} sauvegardé
              {favourites.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

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

        {!loading && !error && favourites.length === 0 && (
          <div className="bg-card rounded-2xl p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-base font-semibold text-text-dark mb-2">
              Aucun favori pour l&apos;instant
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Sauvegardez des biens qui vous intéressent pour les retrouver facilement ici.
            </p>
            <Button asChild>
              <Link href="/acheter">Explorer les biens</Link>
            </Button>
          </div>
        )}

        {!loading && favourites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {favourites.map((fav ) => (
              <div
                key={fav.id}
                className="bg-card rounded-2xl shadow-sm overflow-hidden group"
              >
                <div className="relative h-44 bg-muted">
                  { fav.property.gallery[0] ? (
                    <Image
                      src={fav.property.gallery[0]}
                      alt={fav.property.title}
                      fill
                      sizes="450"
                      className="object-cover"
                    />
                  )  : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs bg-secondary text-white">
                      <p className="text-xl">Aucune image</p>
                    </div>
                  )}
                  <button
                    onClick={() => handleRemove(fav.property.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-destructive hover:bg-white transition-colors shadow-sm"
                    title="Retirer des favoris"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <Link
                    href={`/property/${fav.property.id}`}
                    className="text-sm font-semibold text-text-dark hover:text-primary line-clamp-1 transition-colors"
                  >
                    {fav.property.title}
                  </Link>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {fav.property.location}
                  </div>
                  <p className="text-primary font-semibold text-sm mt-2">
                    {fav.property.price.toLocaleString("fr-CD")} USD
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}
