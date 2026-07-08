import { env } from "./env";

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = env.VITE_API_URL.replace(/\/$/, "");
  return `${baseUrl}${normalizedPath}`;
}
