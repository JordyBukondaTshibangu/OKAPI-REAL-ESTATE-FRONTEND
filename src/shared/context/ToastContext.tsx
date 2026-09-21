"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useRef,
} from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ─── Single toast item ────────────────────────────────────────────────────────

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const isError = toast.type === "error";

  const base =
    "flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium max-w-sm pointer-events-auto border";
  const styles = isError
    ? `${base} bg-zinc-900 text-zinc-100 border-zinc-700`
    : `${base} bg-zinc-900 text-zinc-100 border-zinc-700`;

  // Slide in from top for success/info, from bottom for error
  const animation = isError
    ? "animate-toast-up"
    : "animate-toast-down";

  return (
    <div className={`${styles} ${animation}`} role="alert">
      <span className="shrink-0 mt-0.5">
        {isError ? (
          <XCircle className="w-4 h-4 text-red-400" />
        ) : (
          <CheckCircle className="w-4 h-4 text-emerald-400" />
        )}
      </span>
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity mt-0.5"
        aria-label="Fermer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = `toast-${++counter.current}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  // Separate success/info toasts (top) from error toasts (bottom)
  const topToasts = toasts.filter((t) => t.type !== "error");
  const bottomToasts = toasts.filter((t) => t.type === "error");

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Success toasts — slide in from top */}
      {topToasts.length > 0 && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none"
          aria-live="polite"
        >
          {topToasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>
      )}

      {/* Error toasts — slide in from bottom */}
      {bottomToasts.length > 0 && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col-reverse gap-2 items-center pointer-events-none"
          aria-live="assertive"
        >
          {bottomToasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
