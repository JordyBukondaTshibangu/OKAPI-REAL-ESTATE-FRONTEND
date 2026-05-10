"use client";

import { useEffect } from "react";

export default function Error({
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        gap: "1rem",
        fontFamily: "sans-serif",
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
    </div>
  );
}
