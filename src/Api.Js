// Közös API-segédfüggvények: backend címe, token tárolása, hitelesített kérések.
// Vite-ban a .env fájlból jön: VITE_API_URL=https://...azurewebsites.net  (perjel és /swagger nélkül!)
export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3000")
    .trim()
    .replace(/\/+$/, "");

const TOKEN_KEY = "stb_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Minden kérést ezen keresztül küldünk, így a token automatikusan bekerül a fejlécbe.
export function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = { "Content-Type": "application/json", ...(options.headers ?? {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(`${API_URL}${path}`, { ...options, headers });
}

// A login válaszából kikeresi a tokent. Többféle gyakori formátumot kezel,
// mert még nem tudjuk, pontosan mit küld vissza a backend.
export function findToken(data) {
    if (!data) return null;
    if (typeof data === "string") return data.split(".").length === 3 ? data : null;
    return (
        data.token ??
        data.accessToken ??
        data.access_token ??
        data.jwt ??
        data.session?.access_token ??
        data.data?.token ??
        data.data?.access_token ??
        null
    );
}