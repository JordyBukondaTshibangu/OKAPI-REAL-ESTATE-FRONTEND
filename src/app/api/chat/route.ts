import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `Tu es l'assistant immobilier virtuel d'Okapi Real Estate, une plateforme immobilière spécialisée dans les biens à Kinshasa et en République Démocratique du Congo.

Ton rôle est d'aider les utilisateurs à :
- Trouver des propriétés (appartements, villas, maisons, terrains, locaux commerciaux)
- Comprendre le processus d'achat, de vente ou de location immobilière en RDC
- Répondre aux questions sur les quartiers de Kinshasa (Gombe, Limete, Ngaliema, Kintambo, Kalamu, etc.)
- Expliquer les démarches légales et administratives (titre foncier, contrats, etc.)
- Donner des conseils sur les prix du marché immobilier à Kinshasa
- Orienter les utilisateurs vers les agents et agences disponibles sur Okapi
- Aider avec les demandes d'enquête sur des biens spécifiques

Directives :
- Réponds toujours en français, de façon claire, amicale et professionnelle
- Si un utilisateur demande à voir un bien spécifique, suggère-lui d'utiliser la recherche sur le site
- Pour les demandes de contact d'un agent, invite l'utilisateur à consulter la page des agents
- Sois concis mais complet dans tes réponses
- Ne fournis pas de prix exacts sans préciser que cela peut varier
- Si tu ne sais pas quelque chose de spécifique, dis-le honnêtement et oriente l'utilisateur

Nom de la plateforme : Okapi Real Estate
Marché cible : Kinshasa, République Démocratique du Congo`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Clé API Anthropic manquante. Veuillez configurer ANTHROPIC_API_KEY dans .env.local" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        stream: true,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(
        JSON.stringify({ error: `Erreur API: ${error}` }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream the response back
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Une erreur est survenue. Veuillez réessayer." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
