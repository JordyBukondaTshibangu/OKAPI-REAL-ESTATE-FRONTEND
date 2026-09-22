import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/espace-agent/",
          "/espace-agence/",
          "/profil/",
          "/favoris/",
          "/alertes/",
          "/demandes/",
          "/connexion",
          "/connexion-agent",
          "/inscription",
          "/mot-de-passe-oublie",
          "/reset-password",
          "/devenir-agent/profil",
          "/devenir-agent/verification",
          "/devenir-agent/en-attente",
        ],
      },
    ],
    sitemap: "https://okapi-real-estate.com/sitemap.xml",
    host: "https://okapi-real-estate.com",
  };
}
