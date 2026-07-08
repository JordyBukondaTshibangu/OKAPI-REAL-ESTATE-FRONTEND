export type ListingType = "rent" | "sale" | "commercial";

export type CommercialTransaction = "rent" | "sale";

export type PropertyCategory =
  | "apartment"
  | "villa"
  | "townhouse"
  | "studio"
  | "duplex"
  | "penthouse"
  | "land"
  | "office"
  | "warehouse"
  | "retail";

export type Agency = {
  id: string;
  name: string;
  monogram: string;
  accentClass: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string | null;
  founded: number;
  agentCount: number;
  listingCount: number;
  closedDeals: number;
  specializations: string[];
  areasServed: string[];
  languages: string[];
  certifications: string[];
};

/** Engagement metrics returned by the backend on every property. */
export type PropertyPerformance = {
  /** Total page views (POST /properties/:id/view) */
  viewed: number;
  /** Total shares (POST /properties/:id/share) */
  shared: number;
  /** Live count of users who favorited the property */
  saved: number;
};

export type Property = {
  id: string;
  listingType: ListingType;
  category: PropertyCategory;
  price: number;
  currency: string;
  period: "monthly" | "yearly" | null;
  title: string;
  subtitle: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  suburb: string;
  neighborhood: string;
  city: string;
  verified: boolean;
  premium: boolean;
  isNew: boolean;
  listedDaysAgo: number;
  agent: { name: string; title: string; photo: string };
  imageGradient: string;
  iconType: "building" | "home" | "land" | "office" | "store" | "warehouse";
  transaction?: CommercialTransaction;
  gallery: string[];
  performance?: PropertyPerformance;
  // Rental duration type — optional so pre-migration data doesn't break.
  // Absence means long-term only (matches the schema default).
  updatedAt?: string; // ISO date — used for freshness indicator
  isShortTerm?: boolean;
  isLongTerm?: boolean;
  // Short-term optional details
  pricePerNight?: number | null;
  minStayNights?: number | null;
  maxStayNights?: number | null;
  shortTermNotes?: string | null;
};

export type PropertyDetail = Property & {
  description: string | null;
  amenities: string[];
  reference: string;
  zone: string | null;
  agency: Agency;
  brokerLicense: string | null;
  agentLicense: string | null;
  permitNumber: string | null;
  availableFrom: string | null;
  averagePriceArea: number | null;
  averageSizeArea: number | null;
};


