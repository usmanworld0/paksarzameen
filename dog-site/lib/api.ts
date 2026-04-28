export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export function apiUrl(path: string) {
  if (!API_BASE) return path;
  return `${API_BASE.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
