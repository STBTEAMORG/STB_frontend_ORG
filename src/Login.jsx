import { useState } from "react";

// A backend címe a .env fájlból: VITE_API_URL=https://...azurewebsites.net (záró perjel, /swagger, /api nélkül)
const API_URL = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");

// A login válaszából kikeresi a tokent (többféle gyakori formátumot kezel,
// mert nem tudjuk biztosan, pontosan hogyan adja vissza a backend).
function findToken(data) {
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

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
            const res = await fetch(`${API_URL}/api/Auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }), // LoginDTO: email, password
            });

            const text = await res.text();
            let data = text;
            try {
                data = JSON.parse(text);
            } catch {
                /* nem JSON, marad szövegnek (lehet, hogy maga a token) */
            }

            if (res.status === 400 || res.status === 401) {
                setError("Hibás e-mail cím vagy jelszó.");
                return;
            }
            if (!res.ok) {
                setError(`A bejelentkezés nem sikerült (HTTP ${res.status}).`);
                return;
            }

            const token = findToken(data);
            if (!token) {
                console.log("Login válasz:", data);
                const keys = typeof data === "object" && data ? Object.keys(data).join(", ") : "(nem objektum)";
                setError(`A válaszban nem találtam tokent. A kapott mezők: ${keys}. Nézd meg a konzolt (F12).`);
                return;
            }

            onLogin(token); // → az App átvált a táblák oldalára
        } catch (err) {
            setError(`Nem érem el a szervert: ${err.message}`);
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="login">
            <form className="login__card" onSubmit={handleSubmit}>
                <h1>Bejelentkezés</h1>

                <label htmlFor="email">E-mail cím</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Jelszó</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="note note--error" role="alert">{error}</p>}

                <button type="submit" disabled={busy}>
                    {busy ? "Bejelentkezés…" : "Bejelentkezés"}
                </button>
            </form>
        </main>
    );
}