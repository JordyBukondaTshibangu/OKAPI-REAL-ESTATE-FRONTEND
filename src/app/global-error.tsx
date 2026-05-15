"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#ffffff",
          color: "#1A1F2B",
          textAlign: "center",
          padding: "1rem",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: "rgba(220,38,38,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <svg
            width={28}
            height={28}
            fill="none"
            viewBox="0 0 24 24"
            stroke="#dc2626"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
          Une erreur critique est survenue
        </h2>
        <p style={{ color: "#64748b", maxWidth: 360, margin: "0.5rem 0 0" }}>
          L&apos;application a rencontré un problème inattendu.
        </p>
        {error.digest && (
          <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontFamily: "monospace" }}>
            Code : {error.digest}
          </p>
        )}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button
            onClick={unstable_retry}
            style={{
              padding: "0.6rem 1.5rem",
              borderRadius: 9999,
              border: "none",
              backgroundColor: "#1E63B5",
              color: "#fff",
              fontWeight: 500,
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Réessayer
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            style={{
              padding: "0.6rem 1.5rem",
              borderRadius: 9999,
              border: "1px solid #e2e8f0",
              backgroundColor: "transparent",
              color: "#1A1F2B",
              fontWeight: 500,
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </body>
    </html>
  );
}
