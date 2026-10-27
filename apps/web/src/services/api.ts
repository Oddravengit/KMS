/** Public API prefix, including its version. Never put credentials in Vite env. */
export function apiUrl(path: string, baseUrl = import.meta.env.VITE_API_BASE_URL || "/api/v1") {
  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
