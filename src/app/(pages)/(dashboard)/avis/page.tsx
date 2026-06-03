"use client";

import { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import UserSidebarLayout from "@/features/user/components/UserSidebarLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { getMyReviews, deleteReview, type Review } from "@/services/auth";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? "fill-secondary text-secondary" : "text-border"
          }`}
        />
      ))}
    </div>
  );
}

function reviewSubject(r: Review): string {
  if (r.agent) return `${r.agent.firstName} ${r.agent.lastName}`;
  if (r.property) return r.property.title;
  return "—";
}

export default function ReviewsPage() {
  const { token } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    getMyReviews(token)
      .then(setReviews)
      .catch(() => setError("Impossible de charger vos avis."))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleDelete(id: string) {
    if (!token) return;
    try {
      await deleteReview(token, id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError("Impossible de supprimer cet avis.");
    }
  }

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <UserSidebarLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-not-dark">
          Mes Avis &amp; Notes
        </h1>

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

        {!loading && !error && reviews.length === 0 && (
          <div className="bg-card rounded-2xl p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-base font-semibold text-not-dark mb-2">
              Aucun avis publié
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Partagez votre expérience en notant les agents ou biens avec qui vous avez travaillé.
            </p>
            <Button asChild>
              <Link href="/agents">Trouver un agent</Link>
            </Button>
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <>
            {/* Summary */}
            <div className="bg-card rounded-2xl shadow-sm p-6 flex items-center gap-6">
              <div className="text-center shrink-0">
                <p className="text-4xl font-bold text-not-dark">
                  {avgRating.toFixed(1)}
                </p>
                <StarRating rating={Math.round(avgRating)} />
                <p className="text-xs text-muted-foreground mt-1">
                  {reviews.length} avis
                </p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const pct =
                    reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="w-4 text-muted-foreground">{star}</span>
                      <Star className="w-3 h-3 fill-secondary text-secondary shrink-0" />
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-secondary rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-5 text-muted-foreground text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review list */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-card rounded-2xl shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-not-dark">
                        {reviewSubject(review)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-muted-foreground">
                          {review.agentId ? "Agent" : "Propriété"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-text-light">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </UserSidebarLayout>
  );
}
