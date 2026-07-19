"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useT } from "@/i18n/useT";

export default function UserPendingPage() {
  const t = useT().userPending;

  const steps = [
    {
      icon: CheckCircle2,
      title: t.stepCreated,
      desc: t.stepCreatedDesc,
      done: true,
    },
    {
      icon: Clock,
      title: t.stepVerifying,
      desc: t.stepVerifyingDesc,
      done: false,
      active: true,
    },
    {
      icon: ShieldCheck,
      title: t.stepActivated,
      desc: t.stepActivatedDesc,
      done: false,
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <Image
              src="/assets/images/company-logo.png"
              alt="Okapi Real Estate"
              width={120}
              height={48}
              className="h-24 w-auto"
              priority
            />
          </Link>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-8">
          {/* Pending icon */}
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center mx-auto mb-5">
            <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>

          <h1 className="text-xl font-semibold text-center mb-2">
            {t.title}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            {t.subtitle}
          </p>

          {/* Progress steps */}
          <ol className="space-y-4 mb-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={i} className="flex gap-3 items-start">
                  <Icon
                    className={`w-5 h-5 mt-0.5 shrink-0 ${
                      step.done
                        ? "text-emerald-500"
                        : step.active
                        ? "text-amber-500"
                        : "text-muted-foreground/40"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        step.done || step.active ? "text-foreground" : "text-muted-foreground/50"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Info box */}
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-6">
            <strong className="font-semibold">{t.infoDelay}</strong>{" "}
            {t.infoEmail}
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/">{t.backHome}</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/acheter">{t.browseListings}</Link>
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          {t.supportPrompt}{" "}
          <a href="mailto:support@okapi.immo" className="text-primary hover:underline">
            {t.supportLink}
          </a>
        </p>
      </div>
    </div>
  );
}
