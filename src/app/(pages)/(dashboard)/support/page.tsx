"use client";

import { useT } from "@/i18n/useT";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Mail, MessageCircle, FileText, ExternalLink } from "lucide-react";

const WHATSAPP_NUMBER = "+243999000111";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="text-sm font-medium">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border bg-muted/20">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function SupportPage() {
  const t = useT();
  const p = t.supportPage;

  const faqs = [
    { q: p.q1, a: p.a1 },
    { q: p.q2, a: p.a2 },
    { q: p.q3, a: p.a3 },
    { q: p.q4, a: p.a4 },
    { q: p.q5, a: p.a5 },
    { q: p.q6, a: p.a6 },
  ];

  const channels = [
    {
      icon: Mail,
      label: p.channelEmailLabel,
      desc: p.channelEmailDesc,
      btn: p.channelEmailBtn,
      href: "mailto:support@okapi-real-estate.com",
    },
    {
      icon: MessageCircle,
      label: p.channelWhatsAppLabel,
      desc: p.channelWhatsAppDesc,
      btn: p.channelWhatsAppBtn,
      href: `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`,
    },
    {
      icon: FileText,
      label: p.channelContactLabel,
      desc: p.channelContactDesc,
      btn: p.channelContactBtn,
      href: "/contact",
    },
  ];

  const usefulLinks = [
    { label: p.linkTerms, href: "/conditions-generales" },
    { label: p.linkPrivacy, href: "/confidentialite" },
    { label: p.linkCookies, href: "/cookies" },
    { label: p.linkContact, href: "/contact" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-20 px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
          {p.badge}
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">{p.heading}</h1>
        <p className="text-white/75 max-w-xl mx-auto text-base">{p.subtitle}</p>
      </section>

      <section className="bg-background py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-16">

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-semibold mb-8">{p.faqHeading}</h2>
            <div className="space-y-3">
              {faqs.map((item) => (
                <FaqItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>

          {/* Contact channels */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">{p.contactHeading}</h2>
            <p className="text-muted-foreground text-sm mb-8">{p.contactSubtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {channels.map(({ icon: Icon, label, desc, btn, href }) => (
                <div
                  key={label}
                  className="border border-border rounded-xl p-6 flex flex-col gap-4 hover:border-primary/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    {btn}
                    {href.startsWith("http") && <ExternalLink className="w-3 h-3" />}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Useful links */}
          <div>
            <h2 className="text-lg font-semibold mb-4">{p.linksHeading}</h2>
            <div className="flex flex-wrap gap-3">
              {usefulLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-4 py-2 rounded-full border border-border text-sm hover:bg-muted transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
