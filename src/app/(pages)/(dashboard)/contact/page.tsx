"use client";

import { useT } from "@/i18n/useT";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const t = useT();
  const p = t.pages.contact;

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, p.validationName),
        email: z.string().email(p.validationEmail),
        subject: z.string().min(3, p.validationSubject),
        message: z.string().min(10, p.validationMessage),
      }),
    [p.validationName, p.validationEmail, p.validationSubject, p.validationMessage],
  );

  const contactDetails = [
    {
      icon: MapPin,
      label: p.labelAddress,
      value: "123, Avenue du Commerce, Gombe, Kinshasa, RDC",
    },
    { icon: Phone, label: p.labelPhone, value: "+243 999 000 111" },
    { icon: Mail, label: p.labelEmail, value: "contact@okapiimmobilier.cd" },
    { icon: Clock, label: p.labelHours, value: "Lun – Ven : 8h00 – 17h00" },
  ];

  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(_data: FormData) {
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    reset();
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-20 px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
          {p.badge}
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">
          {p.heading}
        </h1>
        <p className="text-white/75 max-w-xl mx-auto text-base">
          {p.subtitle}
        </p>
      </section>

      {/* Content */}
      <section className="bg-background py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact details */}
          <div>
            <h2 className="text-xl font-semibold  mb-8">
              {p.infoHeading}
            </h2>
            <ul className="space-y-6">
              {contactDetails.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      {label}
                    </p>
                    <p className="text-sm  font-medium">
                      {value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 h-52 rounded-xl bg-muted flex items-center justify-center">
              <MapPin className="w-10 h-10 text-muted-foreground/40" />
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-xl font-semibold  mb-8">
              {p.formHeading}
            </h2>
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <p className="text-green-700 font-medium text-base mb-1">
                  {p.successTitle}
                </p>
                <p className="text-green-600 text-sm">
                  {p.successBody}
                </p>
                <Button className="mt-6" onClick={() => setSent(false)}>
                  {p.sendAnother}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="text-sm font-medium  block mb-1.5">
                    {p.fieldName}
                  </label>
                  <Input {...register("name")} placeholder={p.placeholderName} />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium  block mb-1.5">
                    {p.fieldEmail}
                  </label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder={p.placeholderEmail}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium  block mb-1.5">
                    {p.fieldSubject}
                  </label>
                  <Input
                    {...register("subject")}
                    placeholder={p.placeholderSubject}
                  />
                  {errors.subject && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium  block mb-1.5">
                    {p.fieldMessage}
                  </label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    placeholder={p.placeholderMessage}
                    className="flex w-full rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? p.sending : p.send}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
