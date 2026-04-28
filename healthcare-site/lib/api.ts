export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export function apiUrl(path: string) {
  if (!API_BASE) return path;
  return `${API_BASE.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

// Client-side helper to patch window.fetch for relative /api calls when running on subdomain.
export function installClientFetchProxy() {
  if (typeof window === "undefined") return;
  const base = API_BASE || "";
  if (!base) return;
  const originalFetch = window.fetch;
  // avoid installing twice
  if ((window as any).__apiProxyInstalled) return;
  (window as any).__apiProxyInstalled = true;

  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    try {
      let url = typeof input === "string" ? input : String(input);
      if (url.startsWith("/api/")) {
        url = `${base.replace(/\/$/, "")}${url}`;
      }
      return originalFetch.call(this, url, init);
    } catch (err) {
      return originalFetch.call(this, input as any, init);
    }
  } as typeof window.fetch;
}
