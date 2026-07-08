"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/useT";
import { Bell, MapPin, MessageSquare, Search } from "lucide-react";
import AppleIcon from "./AppleIcon";
import PlayIcon from "./PlayIcon";

function HighlightedHeading({ text, highlight }: { text: string; highlight: string }) {
  const parts = text.split(highlight);
  if (parts.length < 2) return <>{text}</>;
  return (
    <>
      {parts[0]}
      <span className="text-secondary">{highlight}</span>
      {parts.slice(1).join(highlight)}
    </>
  );
}

export default function MobileApp() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: MapPin,        label: t.home.mobileApp.feature1 },
    { icon: Bell,          label: t.home.mobileApp.feature2 },
    { icon: MessageSquare, label: t.home.mobileApp.feature3 },
  ];

  return (
    <section ref={sectionRef} className="relative bg-navy text-white py-32 px-6 overflow-hidden">
      {/* Top gold line */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent"
        aria-hidden="true"
      />

      {/* Radial background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[280px] h-[280px] bg-secondary/8 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Left — Device mockups */}
        <div
          className={`relative flex justify-center py-8 transition-all duration-700 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
        >
          {/* Floating notification pill — centered above the tablet */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white dark:bg-card text-navy dark:text-foreground rounded-full px-3 py-1.5 shadow-lg text-[11px] font-semibold whitespace-nowrap">
            <Bell className="w-3 h-3 text-primary shrink-0" />
            {t.home.mobileApp.notification}
          </div>

          {/* Tablet mockup — tilted */}
          <div
            className="relative w-64 md:w-80 aspect-[4/3] bg-white dark:bg-card rounded-2xl shadow-2xl overflow-hidden border border-white/10"
            style={{ transform: "rotate(-6deg) translateY(-6px)" }}
          >
            {/* App header — brand-colored */}
            <div className="h-9 bg-navy border-b border-secondary/25 flex items-center px-3 gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-white/80" />
                <span className="w-2 h-2 rounded-full bg-white/80" />
                <span className="w-2 h-2 rounded-full bg-white/80" />
              </div>
              <span className="text-secondary font-bold text-xs ml-1">Okapi Real Estate</span>
            </div>
            {/* Search bar row */}
            <div className="h-6 bg-background-alt flex items-center px-2 gap-1.5 border-b border-border/40">
              <Search className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
              <span className="text-[9px] text-muted-foreground">Rechercher un bien…</span>
            </div>
            {/* Property cards grid */}
            <div className="grid grid-cols-2 gap-1.5 p-2 h-[calc(100%-3.75rem)]">
              <div className="bg-accent rounded-md overflow-hidden flex flex-col">
                <div className="flex-1 bg-primary/15" />
                <div className="p-1 space-y-0.5">
                  <div className="h-1.5 bg-primary/40 rounded w-3/4" />
                  <div className="h-1.5 bg-secondary/50 rounded w-1/2" />
                </div>
              </div>
              <div className="bg-accent rounded-md overflow-hidden flex flex-col">
                <div className="flex-1 bg-navy/10" />
                <div className="p-1 space-y-0.5">
                  <div className="h-1.5 bg-primary/40 rounded w-2/3" />
                  <div className="h-1.5 bg-secondary/50 rounded w-1/3" />
                </div>
              </div>
              <div className="bg-accent rounded-md col-span-2 flex items-center gap-2 p-1.5">
                <div className="w-10 h-8 bg-primary/15 rounded shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-1.5 bg-primary/40 rounded w-full" />
                  <div className="h-1.5 bg-muted rounded w-2/3" />
                  <div className="h-1.5 bg-secondary/50 rounded w-1/3" />
                </div>
              </div>
            </div>
          </div>

          {/* Phone mockup — tilted opposite */}
          <div
            className="absolute -right-3 md:right-10 -bottom-6 w-20 md:w-28 aspect-[9/19] bg-white dark:bg-card rounded-2xl shadow-2xl overflow-hidden border border-white/10"
            style={{ transform: "rotate(5deg)" }}
          >
            <div className="h-5 bg-navy border-b border-secondary/25 flex items-center justify-center">
              <span className="text-secondary font-bold text-[7px]">Okapi</span>
            </div>
            <div className="p-1 space-y-1">
              <div className="h-10 bg-primary/15 rounded-md" />
              <div className="h-1.5 bg-primary/30 rounded w-3/4" />
              <div className="h-1.5 bg-secondary/40 rounded w-1/2" />
              <div className="h-8 bg-accent rounded-md mt-1" />
              <div className="h-1.5 bg-primary/30 rounded w-2/3" />
            </div>
          </div>
        </div>

        {/* Right — Text content */}
        <div
          className={`transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
            {t.home.mobileApp.badge}
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">
            <HighlightedHeading
              text={t.home.mobileApp.heading}
              highlight={t.home.mobileApp.headingHighlight}
            />
          </h2>

          <p className="text-base text-white/75 leading-relaxed mb-7">
            {t.home.mobileApp.body}
          </p>

          {/* Store badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { Icon: AppleIcon, top: t.home.mobileApp.downloadOn, name: "App Store" },
              { Icon: PlayIcon,  top: t.home.mobileApp.availableOn, name: "Google Play" },
            ].map(({ Icon, top, name }) => (
              <a
                key={name}
                href="#"
                className="inline-flex items-center gap-2.5 bg-white/8 hover:bg-white/12 border border-white/20 hover:border-secondary/40 hover:shadow-[0_0_12px_hsl(var(--secondary)/0.15)] transition-all duration-200 text-white rounded-lg px-3.5 py-2.5"
              >
                <Icon className="w-5 h-5 shrink-0" />
                <div className="leading-tight">
                  <p className="text-[9px] text-white/60 uppercase tracking-wide">{top}</p>
                  <p className="text-xs font-semibold">{name}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Feature bullets */}
          <div className="space-y-3">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-white/75">
                <div className="w-9 h-9 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center shrink-0">
                  <Icon className="w-[18px] h-[18px] text-secondary" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
