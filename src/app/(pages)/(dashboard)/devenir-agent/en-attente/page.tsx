"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useT } from "@/i18n/useT";

export default function AgentPendingPage() {
  const t = useT();
  const s = t.agentSignup;

  const STEPS = [
    { icon: CheckCircle2, title: s.stepAccountCreated,  desc: s.stepAccountCreatedDesc,  done: true  },
    { icon: CheckCircle2, title: s.stepEmailVerified,   desc: s.stepEmailVerifiedDesc,   done: true  },
    { icon: Clock,        title: s.stepValidating,      desc: s.stepValidatingDesc,      done: false },
    { icon: ShieldCheck,  title: s.stepActivated,       desc: s.stepActivatedDesc,       done: false },
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
          {/* Amber pending icon */}
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center mx-auto mb-5">
            <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>

          <h1 className="text-xl font-semibold text-center mb-2">{s.pendingTitle}</h1>
          <p className="text-sm text-muted-foreground text-center mb-8">{s.pendingSubtitle}</p>

          {/* Progress steps */}
          <ol className="space-y-4 mb-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={i} className="flex gap-3 items-start">
                  <Icon
                    className={`w-5 h-5 mt-0.5 shrink-0 ${
                      step.done
                        ? "text-emerald-500"
                        : i === 2
                        ? "text-amber-500"
                        : "text-muted-foreground/40"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        step.done
                          ? "text-foreground"
                          : i === 2
                          ? "text-foreground"
                          : "text-muted-foreground/50"
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
            <strong className="font-semibold">{s.pendingInfoDelay}</strong>{" "}
            {s.pendingInfoCheck}
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">{s.backToHome}</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full text-sm">
              <Link href="/agents">{s.discoverAgents}</Link>
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          {s.supportPrompt}{" "}
          <a
            href="mailto:support@okapi.immo"
            className="text-primary hover:underline"
          >
            {s.supportLink}
          </a>
        </p>
      </div>
    </div>
  );
}
