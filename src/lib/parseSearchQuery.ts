/**
 * Lightweight French natural-language parser for real estate search queries.
 * Extracts structured intent (category, listing type, beds, suburb) from free text
 * such as "Villa a louer a la gombe" or "2 chambres salon a louer".
 */

// ─── Kinshasa communes ────────────────────────────────────────────────────────

const COMMUNES: { key: string; display: string }[] = [
  { key: "barumbu", display: "Barumbu" },
  { key: "bumbu", display: "Bumbu" },
  { key: "gombe", display: "Gombe" },
  { key: "kalamu", display: "Kalamu" },
  { key: "kasavubu", display: "Kasa-Vubu" },   // also match "kasa vubu" / "kasa-vubu"
  { key: "kimbanseke", display: "Kimbanseke" },
  { key: "kinshasa", display: "Kinshasa" },
  { key: "kintambo", display: "Kintambo" },
  { key: "kisenso", display: "Kisenso" },
  { key: "lemba", display: "Lemba" },
  { key: "limete", display: "Limete" },
  { key: "lingwala", display: "Lingwala" },
  { key: "makala", display: "Makala" },
  { key: "maluku", display: "Maluku" },
  { key: "masina", display: "Masina" },
  { key: "matete", display: "Matete" },
  { key: "montngafula", display: "Mont-Ngafula" }, // match "mont ngafula" / "mont-ngafula"
  { key: "ndjili", display: "Ndjili" },
  { key: "ngaba", display: "Ngaba" },
  { key: "ngaliema", display: "Ngaliema" },
  { key: "ngirngiri", display: "Ngiri-Ngiri" },   // match "ngiri ngiri" / "ngiri-ngiri"
  { key: "nsele", display: "Nsele" },
  { key: "selembao", display: "Selembao" },
];

// ─── Property category keywords ───────────────────────────────────────────────

const CATEGORY_KEYWORDS: { patterns: string[]; category: string }[] = [
  { patterns: ["villa", "villas"], category: "villa" },
  { patterns: ["appartement", "appartements", "appart", "apparts", "apt"], category: "apartment" },
  { patterns: ["studio", "studios"], category: "studio" },
  {
    patterns: ["maison de ville", "maisons de ville", "townhouse", "townhouses"],
    category: "townhouse",
  },
  { patterns: ["duplex"], category: "duplex" },
  { patterns: ["penthouse", "penthouses"], category: "penthouse" },
  { patterns: ["terrain", "terrains", "parcelle", "parcelles"], category: "land" },
  { patterns: ["bureau", "bureaux", "office"], category: "office" },
  { patterns: ["entrepôt", "entrepot", "entrepôts", "warehouse"], category: "warehouse" },
  {
    patterns: ["commerce", "local commercial", "locaux commerciaux", "retail"],
    category: "retail",
  },
];

// ─── Listing-type detection ────────────────────────────────────────────────────

const RENT_PATTERNS = [
  /\bà?\s*louer\b/,
  /\blocation\b/,
  /\bloue\b/,
  /\blouer\b/,
];

const SALE_PATTERNS = [
  /\bà?\s*vendre\b/,
  /\bvente\b/,
  /\bacheter\b/,
  /\bachat\b/,
];

// ─── Structural noise words (stripped before text-match fallback) ─────────────

const STRUCTURAL_WORDS = new Set([
  "a", "à", "au", "aux", "la", "le", "les", "de", "du", "des",
  "en", "et", "ou", "un", "une", "pour", "sur",
  // listing type words
  "louer", "location", "loue", "acheter", "achat", "vente", "vendre",
  // bedroom words
  "chambre", "chambres", "ch", "pièce", "pièces", "piece", "pieces", "salon",
]);

// ─── Types ────────────────────────────────────────────────────────────────────

export type ParsedQuery = {
  /** Detected property category (villa, apartment, studio, …) */
  category?: string;
  /** Detected listing type */
  listingType?: "rent" | "sale";
  /** Detected bedroom count */
  beds?: number;
  /** Detected Kinshasa commune (display name) */
  suburb?: string;
  /**
   * Remaining meaningful words after removing structural tokens.
   * Use this as the text-search `q` instead of the raw query so
   * filterProperties gets cleaner input.
   */
  cleanQ?: string;
};

// ─── Main parser ──────────────────────────────────────────────────────────────

export function parseSearchQuery(raw: string): ParsedQuery {
  if (!raw || !raw.trim()) return {};

  const result: ParsedQuery = {};

  // Normalise: lowercase, collapse spaces, remove punctuation except hyphens
  const normalised = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents for matching
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // ── 1. Listing type ────────────────────────────────────────────────────────
  if (RENT_PATTERNS.some((re) => re.test(normalised))) {
    result.listingType = "rent";
  } else if (SALE_PATTERNS.some((re) => re.test(normalised))) {
    result.listingType = "sale";
  }

  // ── 2. Bedrooms ────────────────────────────────────────────────────────────
  const bedsMatch = normalised.match(/(\d+)\s*(?:chambres?|ch\.?|pieces?|pieces?)/);
  if (bedsMatch) {
    const n = parseInt(bedsMatch[1], 10);
    if (n >= 1 && n <= 20) result.beds = n;
  }

  // ── 3. Category ────────────────────────────────────────────────────────────
  for (const { patterns, category } of CATEGORY_KEYWORDS) {
    if (patterns.some((p) => new RegExp(`\\b${p}\\b`).test(normalised))) {
      result.category = category;
      break;
    }
  }

  // ── 4. Commune ────────────────────────────────────────────────────────────
  // Normalise the text for commune matching (remove hyphens / spaces between words)
  const compacted = normalised.replace(/[-\s]+/g, "");
  for (const { key, display } of COMMUNES) {
    if (compacted.includes(key)) {
      result.suburb = display;
      break;
    }
  }

  // ── 5. Clean remaining query ───────────────────────────────────────────────
  // Remove structural words; keep meaningful leftover tokens for text search.
  const words = normalised.split(/\s+/);
  const meaningful = words.filter(
    (w) => w.length > 2 && !STRUCTURAL_WORDS.has(w) && !/^\d+$/.test(w),
  );
  // Remove extracted tokens (category, suburb) from the clean query
  const skipWords = new Set<string>();
  if (result.category) {
    CATEGORY_KEYWORDS.find((c) => c.category === result.category)?.patterns.forEach((p) =>
      p.split(/\s+/).forEach((t) => skipWords.add(t)),
    );
  }
  if (result.suburb) {
    skipWords.add(result.suburb.toLowerCase().replace(/[-\s]/g, ""));
  }
  const cleanTokens = meaningful.filter((w) => !skipWords.has(w));
  result.cleanQ = cleanTokens.length > 0 ? cleanTokens.join(" ") : undefined;

  return result;
}
