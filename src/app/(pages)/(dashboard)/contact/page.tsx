"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Adresse e-mail invalide"),
  subject: z.string().min(3, "Le sujet est requis"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères"),
});

type FormData = z.infer<typeof schema>;

const contactDetails = [
  {
    icon: MapPin,
    label: "Adresse",
    value: "123, Avenue du Commerce, Gombe, Kinshasa, RDC",
  },
  { icon: Phone, label: "Téléphone", value: "+243 999 000 111" },
  { icon: Mail, label: "E-mail", value: "contact@okapiimmobilier.cd" },
  { icon: Clock, label: "Horaires", value: "Lun – Ven : 8h00 – 17h00" },
];

export default function ContactPage() {
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
          Nous contacter
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">
          Une question ? Écrivez-nous
        </h1>
        <p className="text-white/75 max-w-xl mx-auto text-base">
          Notre équipe est disponible du lundi au vendredi pour répondre à
          toutes vos questions.
        </p>
      </section>

      {/* Content */}
      <section className="bg-background py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact details */}
          <div>
            <h2 className="text-xl font-semibold text-text-dark mb-8">
              Informations de contact
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
                    <p className="text-sm text-text-dark font-medium">
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
            <h2 className="text-xl font-semibold text-text-dark mb-8">
              Envoyer un message
            </h2>
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <p className="text-green-700 font-medium text-base mb-1">
                  Message envoyé !
                </p>
                <p className="text-green-600 text-sm">
                  Nous vous répondrons dans les plus brefs délais.
                </p>
                <Button className="mt-6" onClick={() => setSent(false)}>
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-text-dark block mb-1.5">
                    Nom complet
                  </label>
                  <Input {...register("name")} placeholder="Jean Makiese" />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-text-dark block mb-1.5">
                    Adresse e-mail
                  </label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="jean@exemple.cd"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-text-dark block mb-1.5">
                    Sujet
                  </label>
                  <Input
                    {...register("subject")}
                    placeholder="Demande d'information"
                  />
                  {errors.subject && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-text-dark block mb-1.5">
                    Message
                  </label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    placeholder="Décrivez votre demande..."
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
                  {isSubmitting ? "Envoi en cours…" : "Envoyer le message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
