/**
 * Returns a stable anonymous session UUID persisted in localStorage.
 * Used to deduplicate property view/share/whatsapp tracking across
 * page loads for the same browser session.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "okapi_session_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
