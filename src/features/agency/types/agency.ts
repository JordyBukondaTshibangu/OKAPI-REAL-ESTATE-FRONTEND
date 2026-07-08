export type Agency = {
  id: string;
  name: string;
  // Cosmetic (optional for new agencies)
  monogram?: string | null;
  accentClass?: string | null;
  tagline?: string | null;
  description?: string | null;
  // Contact
  address?: string | null;
  phone: string;
  email: string;
  website?: string | null;
  whatsapp?: string | null;
  // DRC-specific
  communes?: string[];
  propertyTypes?: string[];
  rentalFocus?: "LONG_TERM" | "SHORT_TERM" | "BOTH" | null;
  rccmNumber?: string | null;
  logoUrl?: string | null;
  // Dates & freemium
  founded?: number | null;
  gracePeriodEndsAt?: string | null;
  freeListingCap?: number | null;
  // Verification
  verificationStatus?: string | null;
  approvedAt?: string | null;
  // Stats
  agentCount?: number;
  listingCount?: number;
  closedDeals?: number;
  // Legacy arrays
  specializations?: string[];
  areasServed?: string[];
  languages?: string[];
  certifications?: string[];
  // Relations
  agents?: unknown[];
  createdAt?: string;
};
