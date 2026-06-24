import axios from "axios";
import type { User } from "@/features/properties/types/user";

// All calls go to Next.js API routes which proxy server-side to avoid CORS
const BASE = "";

const authHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string) {
  const res = await axios.post<{ access_token: string }>(`/api/proxy/auth/login`, {
    email,
    password,
  });
  return res.data;
}

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}) {
  const res = await axios.post<{ access_token: string }>(
    `/api/proxy/auth/register`,
    data
  );
  return res.data;
}

export async function forgotPassword(email: string) {
  const res = await axios.post(`/api/auth/forgot-password`, { email });
  return res.data;
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await axios.post(`/api/auth/reset-password`, {
    token,
    newPassword,
  });
  return res.data;
}

export async function getMe(token: string): Promise<User> {
  const res = await axios.get<User>(`/api/proxy/users/me`, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function updateMe(
  token: string,
  data: Partial<Omit<User, "id">>
): Promise<User> {
  const res = await axios.patch<User>(`/api/proxy/users/me`, data, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function changePassword(
  token: string,
  data: { currentPassword: string; newPassword: string }
) {
  const res = await axios.patch(`/api/proxy/users/me/password`, data, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function uploadAvatar(token: string, file: File) {
  // Step 1: get presigned URL from backend
  const { data: { key, url } } = await axios.post<{ key: string; url: string }>(
    `/api/proxy/uploads/presign-avatar`,
    { filename: file.name, contentType: file.type },
    { headers: authHeader(token) }
  );

  // Step 2: PUT file binary directly to R2
  await fetch(url, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  // Step 3: promote tmp key → users/{userId}/ and update user record
  const res = await axios.patch<import("@/features/properties/types/user").User>(
    `/api/proxy/users/me/avatar`,
    { key },
    { headers: authHeader(token) }
  );
  return res.data;
}

export async function removeAvatar(token: string) {
  const res = await axios.delete<import("@/features/properties/types/user").User>(
    `/api/proxy/users/me/avatar`,
    { headers: authHeader(token) }
  );
  return res.data;
}

export async function deleteAccount(token: string) {
  await axios.delete(`/api/proxy/users/me`, {
    headers: authHeader(token),
  });
}

// ── Alerts ────────────────────────────────────────────────────────────────────

export type Alert = {
  id: string;
  name: string;
  listingType?: string;
  category?: string;
  city?: string;
  suburb?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  active?: boolean;
  createdAt: string;
};

export type CreateAlertPayload = Omit<Alert, "id" | "createdAt">;
export type UpdateAlertPayload = Partial<CreateAlertPayload>;

export async function getAlerts(token: string): Promise<Alert[]> {
  const res = await axios.get<Alert[]>(`${BASE}/api/user/alerts`, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function createAlert(
  token: string,
  data: CreateAlertPayload
): Promise<Alert> {
  const res = await axios.post<Alert>(`${BASE}/api/user/alerts`, data, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function updateAlert(
  token: string,
  id: string,
  data: UpdateAlertPayload
): Promise<Alert> {
  const res = await axios.patch<Alert>(`${BASE}/api/user/alerts/${id}`, data, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function deleteAlert(token: string, id: string) {
  await axios.delete(`${BASE}/api/user/alerts/${id}`, {
    headers: authHeader(token),
  });
}

export async function getAlertMatches(token: string, id: string) {
  const res = await axios.get(`${BASE}/api/user/alerts/${id}/matches`, {
    headers: authHeader(token),
  });
  return res.data;
}

// ── Favourites ────────────────────────────────────────────────────────────────

export type Favourite = {
  id: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
    location: string;
    type: string;
    gallery : string[]
  };
  createdAt: string;
};

export async function getFavourites(token: string): Promise<Favourite[]> {
  const res = await axios.get<Favourite[]>(`${BASE}/api/user/favorites`, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function addFavourite(token: string, propertyId: string) {
  const res = await axios.post(
    `${BASE}/api/user/favorites`,
    { propertyId },
    { headers: authHeader(token) }
  );
  return res.data;
}

export async function removeFavourite(token: string, propertyId: string) {
  await axios.delete(`${BASE}/api/user/favorites/${propertyId}`, {
    headers: authHeader(token),
  });
}

// ── Enquiries ─────────────────────────────────────────────────────────────────

export type Enquiry = {
  id: string;
  propertyId: string;
  property?: { id: string; title: string };
  message: string;
  status: "pending" | "replied" | "closed";
  createdAt: string;
};

export async function getEnquiries(token: string): Promise<Enquiry[]> {
  const res = await axios.get<Enquiry[]>(`${BASE}/api/user/enquiries`, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function createEnquiry(
  token: string,
  data: { propertyId: string; message: string }
) {
  const res = await axios.post(`${BASE}/api/user/enquiries`, data, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function deleteEnquiry(token: string, id: string) {
  await axios.delete(`${BASE}/api/user/enquiries/${id}`, {
    headers: authHeader(token),
  });
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export type Review = {
  id: string;
  propertyId?: string;
  agentId?: string;
  property?: { id: string; title: string };
  agent?: { id: string; name: string };
  rating: number;
  comment?: string;
  createdAt: string;
};

export async function getMyReviews(token: string): Promise<Review[]> {
  const res = await axios.get<Review[]>(`${BASE}/api/user/reviews/mine`, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function createReview(
  token: string,
  data: { propertyId?: string; agentId?: string; rating: number; comment?: string }
) {
  const res = await axios.post(`${BASE}/api/user/reviews`, data, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function deleteReview(token: string, id: string) {
  await axios.delete(`${BASE}/api/user/reviews/${id}`, {
    headers: authHeader(token),
  });
}

export async function getPropertyReviews(propertyId: string): Promise<Review[]> {
  const res = await axios.get<Review[]>(
    `${BASE}/api/user/reviews/property/${propertyId}`
  );
  return res.data;
}

export async function getAgentReviews(agentId: string): Promise<Review[]> {
  const res = await axios.get<Review[]>(
    `${BASE}/api/user/reviews/agent/${agentId}`
  );
  return res.data;
}

export async function getEnquiriesForProperty(propertyId: string): Promise<Enquiry[]> {
  const res = await axios.get<Enquiry[]>(
    `${BASE}/api/user/enquiries/property/${propertyId}`
  );
  return res.data;
}
