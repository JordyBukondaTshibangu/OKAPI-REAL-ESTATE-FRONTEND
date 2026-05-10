import { Property } from "@/features/properties/types/property";

export const NATIONALITY_POOL = [
    "RD Congo",
    "République du Congo",
    "Belgique",
    "France",
    "Cameroun",
    "Sénégal",
  ];
  
  export const LANGUAGE_POOL = [
    "Français",
    "Anglais",
    "Lingala",
    "Swahili",
    "Tshiluba",
    "Kikongo",
    "Portugais",
  ];
  
  export const AGENCY_POOL = [
    { name: "Okapi Premier", monogram: "OP", accent: "bg-navy" },
    { name: "Kinshasa Élite Realty", monogram: "KE", accent: "bg-primary" },
    { name: "Boulevard Properties", monogram: "BP", accent: "bg-secondary" },
    { name: "Gombe Estates", monogram: "GE", accent: "bg-navy" },
  ];
  
  export const SUBURBS = [
    "Gombe",
    "Limete",
    "Ngaliema",
    "Lemba",
    "Kintambo",
    "Bandalungwa",
    "Mont-Ngafula",
  ];
  
  export const SUBURB_BLURBS: Record<string, string> = {
    Gombe:
      "Gombe est le centre d'affaires de Kinshasa : ambassades, sièges sociaux, hôtels haut de gamme et boulevards bordés d'arbres. Une demande locative très soutenue.",
    Limete:
      "Limete combine zones résidentielles familiales et un tissu commercial dense, offrant un excellent rapport qualité-prix.",
    Ngaliema:
      "Ngaliema est le quartier résidentiel premium, perché sur les collines avec vue sur le fleuve. Villas, ambassades et résidences sécurisées.",
    Lemba:
      "Lemba accueille la cité universitaire et beaucoup de jeunes actifs. Idéal pour les studios et appartements de standing.",
    Kintambo:
      "Kintambo est en pleine transformation : nouveaux immeubles, écoles internationales et commerces de proximité.",
    Bandalungwa:
      "Bandalungwa offre un rythme de vie tranquille avec une bonne connexion aux principaux axes de la capitale.",
    "Mont-Ngafula":
      "Mont-Ngafula séduit par ses grandes parcelles et son atmosphère verdoyante, à 30 minutes du centre.",
  };
  
  export const PROPERTY_TYPE_LABEL: Record<Property["category"], string> = {
    apartment: "Appartement",
    villa: "Villa",
    townhouse: "Maison de ville",
    studio: "Studio",
    duplex: "Duplex",
    penthouse: "Penthouse",
    land: "Terrain",
    office: "Bureau",
    warehouse: "Entrepôt",
    retail: "Commerce",
  };
  
  export const PHOTO_GRADIENT_POOL = [
    "from-amber-200 via-amber-300 to-amber-500",
    "from-rose-200 via-rose-300 to-rose-500",
    "from-sky-200 via-sky-300 to-sky-500",
    "from-emerald-200 via-emerald-300 to-emerald-500",
    "from-indigo-200 via-indigo-300 to-indigo-500",
    "from-purple-200 via-purple-300 to-purple-500",
    "from-orange-200 via-orange-300 to-orange-500",
  ];