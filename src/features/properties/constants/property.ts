import { PropertyCategory } from "@/features/properties/types/property";

/** Maps URL slug → internal category value */
export const SLUG_TO_CATEGORY: Record<string, PropertyCategory> = {
    appartements: "apartment",
    villas: "villa",
    "maisons-ville": "townhouse",
    maison: "townhouse",
    appartement: "apartment",
    terrains: "land",
    studios: "studio",
    bureaux: "office",
    magasins: "retail",
    entrepots: "warehouse",
  };

  export const AMENITIES_BY_CATEGORY: Record<PropertyCategory, string[]> = {
    apartment: [
      "Meublé",
      "Climatisation",
      "Cuisine équipée",
      "Sécurité 24/7",
      "Balcon",
      "Vue dégagée",
      "Ascenseur",
      "Parking privé",
    ],
    villa: [
      "Piscine",
      "Jardin paysager",
      "Garage 2 voitures",
      "Sécurité 24/7",
      "Cuisine équipée",
      "Climatisation centrale",
      "Quartiers du personnel",
      "Groupe électrogène",
    ],
    townhouse: [
      "Jardin privé",
      "Garage",
      "Sécurité",
      "Climatisation",
      "Cuisine équipée",
      "Terrasse",
    ],
    studio: ["Meublé", "Climatisation", "Sécurité", "Internet fibre", "Cuisine équipée"],
    duplex: ["Climatisation", "Garage", "Cuisine équipée", "Terrasse", "Sécurité"],
    penthouse: [
      "Vue panoramique",
      "Terrasse privative",
      "Concierge",
      "Climatisation centrale",
      "Cuisine premium",
      "Parking privé",
    ],
    land: ["Titre foncier", "Viabilisé", "Accès goudronné", "Clôturé"],
    office: [
      "Climatisation",
      "Parking visiteurs",
      "Sécurité 24/7",
      "Salle de réunion",
      "Internet fibre",
      "Ascenseur",
    ],
    warehouse: [
      "Quai de chargement",
      "Hauteur sous plafond 8m",
      "Sécurité 24/7",
      "Bureau intégré",
      "Parking poids-lourds",
    ],
    retail: ["Vitrine sur rue", "Climatisation", "Sécurité", "Parking client", "Stockage"],
  };