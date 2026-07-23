import axios from "axios";

// All calls go through Next.js API proxy to avoid CORS
const agentAuthHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

export type AgentAuthResult = {
  access_token: string;
  agent: {
    id: string;
    name: string;
    email: string;
    verificationTier: "NON_VERIFIE" | "VERIFIE";
    emailVerified: boolean;
    agentType?: string | null;
    agencyId?: string | null;
  };
  message?: string;
};

/** Step 1 — self-register. Sends OTP email automatically. */
export async function registerAgent(data: {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}): Promise<AgentAuthResult> {
  const res = await axios.post<AgentAuthResult>(
    `/api/proxy/auth/agent/register`,
    data,
  );
  return res.data;
}

/** Step 2 — submit OTP received by email. */
export async function verifyAgentEmail(
  token: string,
  code: string,
): Promise<{ message: string; emailVerified: boolean }> {
  const res = await axios.post(
    `/api/proxy/auth/agent/verify-email`,
    { code },
    { headers: agentAuthHeader(token) },
  );
  return res.data;
}

export type AgentProfilePayload = {
  agentType: string;
  whatsapp?: string;
  agencyId?: string;
  communes: string[];
  propertyTypes: string[];
  rentalFocus: string;
  yearsExperienceLabel?: string;
  idDocumentUrl?: string;
  referredById?: string;
  bio?: string;
  photo?: string;
};

/** Step 2 — complete professional profile after email verification. */
export async function completeAgentProfile(
  token: string,
  data: AgentProfilePayload,
): Promise<{ message: string }> {
  const res = await axios.patch(
    `/api/proxy/auth/agent/complete-profile`,
    data,
    { headers: agentAuthHeader(token) },
  );
  return res.data;
}

/** Fetch the authenticated agent's full profile. */
export async function getMyAgentProfile(token: string) {
  const res = await axios.get(`/api/proxy/agents/me`, {
    headers: agentAuthHeader(token),
  });
  return res.data;
}

/** Login an existing agent (email/phone + password). */
export async function loginAgent(
  identifier: string,
  password: string,
): Promise<AgentAuthResult> {
  const res = await axios.post<AgentAuthResult>(
    `/api/proxy/auth/agent/login`,
    { identifier, password },
  );
  return res.data;
}

/** Resend OTP (60 s cooldown enforced by backend). */
export async function resendAgentVerification(
  token: string,
): Promise<{ message: string }> {
  const res = await axios.post(
    `/api/proxy/auth/agent/resend-verification`,
    {},
    { headers: agentAuthHeader(token) },
  );
  return res.data;
}

// ── Boost types & service functions ────────────────────────────────────────────

export type BoostPaymentMethod = "ORANGE_MONEY" | "MTN_MONEY" | "AIRTEL_MONEY" | "MPESA" | "CASH";
export type BoostStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "EXPIRED";

export type BoostRequest = {
  id: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
    suburb: string;
    city: string;
    category: string;
    gallery: string[];
    isBoosted: boolean;
    boostedUntil: string | null;
  };
  durationDays: number;
  amount: number;
  currency: string;
  paymentMethod: BoostPaymentMethod;
  paymentReference: string | null;
  screenshotUrl: string | null;
  status: BoostStatus;
  rejectionReason: string | null;
  createdAt: string;
};

export type CreateBoostRequestPayload = {
  durationDays: 7 | 15 | 30;
  paymentMethod: BoostPaymentMethod;
  screenshotUrl?: string;
};

export async function createBoostRequest(
  token: string,
  propertyId: string,
  data: CreateBoostRequestPayload,
): Promise<BoostRequest> {
  const res = await axios.post<BoostRequest>(
    `/api/proxy/boosts/properties/${propertyId}/request`,
    data,
    { headers: agentAuthHeader(token) },
  );
  return res.data;
}

export async function getMyBoosts(token: string): Promise<BoostRequest[]> {
  const res = await axios.get<BoostRequest[]>(`/api/proxy/boosts/mine`, {
    headers: agentAuthHeader(token),
  });
  return res.data;
}

export async function updateBoostScreenshot(
  token: string,
  boostId: string,
  screenshotUrl: string,
): Promise<BoostRequest> {
  const res = await axios.patch<BoostRequest>(
    `/api/proxy/boosts/${boostId}/screenshot`,
    { screenshotUrl },
    { headers: agentAuthHeader(token) },
  );
  return res.data;
}

/** Presign a payment screenshot upload via R2. */
export async function presignBoostScreenshot(
  token: string,
  filename: string,
  contentType: string,
): Promise<{ key: string; url: string }> {
  const res = await axios.post<{ key: string; url: string }>(
    `/api/proxy/uploads/presign-boost-screenshot`,
    { filename, contentType },
    { headers: agentAuthHeader(token) },
  );
  return res.data;
}
