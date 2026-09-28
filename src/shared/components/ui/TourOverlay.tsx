"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useTourStore, TOUR_STEPS } from "@/store/useTourStore";
import { useT } from "@/i18n/useT";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const PAD = 10; // spotlight padding around the target element
const TOOLTIP_W = 320;
const TOOLTIP_H_ESTIMATE = 210;

export default function TourOverlay() {
  const { isActive, currentStep, nextStep, skipTour } = useTourStore();
  const t = useT();
  const [rect, setRect] = useState<Rect | null>(null);
  const [mounted, setMounted] = useState(false);

  // Avoid SSR mismatch — only portal-render after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const measure = useCallback(() => {
    if (!isActive) return;
    const step = TOUR_STEPS[currentStep];
    if (!step) return;
    const el = document.querySelector<HTMLElement>(
      `[data-tour-id="${step.id}"]`,
    );
    if (!el) {
      setRect(null);
      return;
    }
    // Scroll target into view (smooth) if partially off-screen
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    const r = el.getBoundingClientRect();
    setRect({ x: r.left, y: r.top, width: r.width, height: r.height });
  }, [isActive, currentStep]);

  useEffect(() => {
    if (!isActive) {
      setRect(null);
      return;
    }
    // Small delay to let any navigation / scroll settle
    const t = setTimeout(measure, 150);
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [isActive, measure]);

  if (!mounted || !isActive) return null;

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const stepTitles = [t.tour.step1Title, t.tour.step2Title, t.tour.step3Title];
  const stepDescs = [t.tour.step1Desc, t.tour.step2Desc, t.tour.step3Desc];

  const W = typeof window !== "undefined" ? window.innerWidth : 1280;
  const H = typeof window !== "undefined" ? window.innerHeight : 800;

  // Spotlight bounds
  const spX = rect ? Math.max(0, rect.x - PAD) : 0;
  const spY = rect ? Math.max(0, rect.y - PAD) : 0;
  const spW = rect ? Math.min(rect.width + PAD * 2, W - spX) : 0;
  const spH = rect ? rect.height + PAD * 2 : 0;

  // Tooltip left: align to spotlight left, but keep on screen
  const tooltipLeft = rect
    ? Math.min(Math.max(16, spX), W - TOOLTIP_W - 16)
    : W / 2 - TOOLTIP_W / 2;

  // Tooltip top: prefer below spotlight, fall back above if too close to bottom
  const belowY = spY + spH + 16;
  const aboveY = spY - TOOLTIP_H_ESTIMATE - 16;
  const tooltipTop = rect
    ? belowY + TOOLTIP_H_ESTIMATE < H
      ? belowY
      : aboveY > 0
        ? aboveY
        : 16
    : H / 2 - TOOLTIP_H_ESTIMATE / 2;

  const arrowFacesDown = rect && tooltipTop < spY; // tooltip above → arrow faces down

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-modal
      role="dialog"
      aria-label="Guide de démarrage"
    >
      {/* ── 4-rectangle dark overlay ── */}
      {rect ? (
        <>
          {/* Top */}
          <div
            className="absolute bg-black/65 pointer-events-auto"
            style={{ top: 0, left: 0, right: 0, height: spY }}
            onClick={skipTour}
          />
          {/* Left */}
          <div
            className="absolute bg-black/65 pointer-events-auto"
            style={{ top: spY, left: 0, width: spX, height: spH }}
            onClick={skipTour}
          />
          {/* Right */}
          <div
            className="absolute bg-black/65 pointer-events-auto"
            style={{ top: spY, left: spX + spW, right: 0, height: spH }}
            onClick={skipTour}
          />
          {/* Bottom */}
          <div
            className="absolute bg-black/65 pointer-events-auto"
            style={{ top: spY + spH, left: 0, right: 0, bottom: 0 }}
            onClick={skipTour}
          />
          {/* Spotlight highlight border */}
          <div
            className="absolute rounded-xl border-2 border-primary/80 shadow-[0_0_0_4px_rgba(0,0,0,0.15)] pointer-events-none"
            style={{ top: spY, left: spX, width: spW, height: spH }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0 bg-black/65 pointer-events-auto"
          onClick={skipTour}
        />
      )}

      {/* ── Tooltip card ── */}
      <div
        className="absolute pointer-events-auto bg-white dark:bg-card rounded-2xl shadow-2xl border border-border"
        style={{
          width: TOOLTIP_W,
          top: tooltipTop,
          left: tooltipLeft,
        }}
      >
        {/* Arrow pointing UP (tooltip is below spotlight) */}
        {rect && !arrowFacesDown && (
          <div
            className="absolute -top-2 w-4 h-4 bg-white dark:bg-card rotate-45 border-l border-t border-border"
            style={{ left: 24 }}
          />
        )}
        {/* Arrow pointing DOWN (tooltip is above spotlight) */}
        {rect && arrowFacesDown && (
          <div
            className="absolute -bottom-2 w-4 h-4 bg-white dark:bg-card rotate-45 border-r border-b border-border"
            style={{ left: 24 }}
          />
        )}

        <div className="p-5">
          {/* Step dots + close */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1.5 items-center">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? "w-5 h-1.5 bg-primary"
                      : i < currentStep
                        ? "w-2 h-1.5 bg-primary/40"
                        : "w-2 h-1.5 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={skipTour}
              className="text-muted-foreground hover:text-foreground transition-colors rounded-md p-0.5"
              aria-label="Fermer le guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <h3 className="font-semibold text-foreground text-[15px] mb-1.5">
            {stepTitles[currentStep]}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {stepDescs[currentStep]}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={skipTour}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.tour.skip}
            </button>
            <button
              onClick={nextStep}
              className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition-all"
            >
              {isLast ? t.tour.finish : t.tour.next}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
