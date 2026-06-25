import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contact@okapi-real-estate.com";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "Okapi Real Estate <onboarding@resend.dev>";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { message: "RESEND_API_KEY manquante. Veuillez la configurer dans .env.local" },
      { status: 500 },
    );
  }

  const { name, email, subject, message } = parsed.data;
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `[Contact] ${subject}`,
    text: `Nom : ${name}\nE-mail : ${email}\n\n${message}`,
  });

  if (error) {
    console.error("Contact form send error:", error);
    return NextResponse.json({ message: "Échec de l'envoi" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
