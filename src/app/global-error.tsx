"use client";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "sans-serif",
          gap: "1rem",
        }}
      >
        <h2>Une erreur est survenue</h2>
        {error.digest && (
          <p style={{ color: "#888", fontSize: "0.85rem" }}>
            Code : {error.digest}
          </p>
        )}
        <button
          onClick={() => unstable_retry()}
          style={{ padding: "0.5rem 1.5rem", cursor: "pointer" }}
        >
          Réessayer
        </button>
      </body>
    </html>
  );
}
