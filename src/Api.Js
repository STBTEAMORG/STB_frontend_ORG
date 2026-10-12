import { useEffect, useState } from "react";

// A backend címe a .env fájlból jön: VITE_API_URL=https://...azurewebsites.net
// (a végén ne legyen perjel, és ne legyen benne /swagger vagy /api)
const API_URL = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");

// Egy cella értékének szöveggé alakítása (objektum/tömb/null esetén sem száll el)
function formatCell(value) {
    if (value === null || value === undefined) return "–";
    if (typeof value === "object") return JSON.stringify(value);
    if (typeof value === "boolean") return value ? "igen" : "nem";
    return String(value);
}

// Egy adatbázistábla adatait tölti le és jeleníti meg külön szekcióban.
// Az oszlopokat az első sor kulcsaiból veszi, így bármelyik táblával működik.
export default function TableSection({ title, endpoint, hiddenColumns = [] }) {
    const [rows, setRows] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | ok | error
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            try {
                setStatus("loading");
                const res = await fetch(`${API_URL}${endpoint}`, { signal: controller.signal });
                console.log("Lekért cím:", `${API_URL}${endpoint}`, "→ státusz:", res.status);

                if (res.status === 401 || res.status === 403) {
                    throw new Error(`${res.status}: ez a végpont bejelentkezést kér`);
                }
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const json = await res.json();
                // Van, ahol tömböt ad vissza az API, van, ahol { data: [...] } formát
                setRows(Array.isArray(json) ? json : json.data ?? []);
                setStatus("ok");
            } catch (err) {
                if (err.name === "AbortError") return;
                setError(err.message);
                setStatus("error");
            }
        }

        load();
        return () => controller.abort();
    }, [endpoint]);

    const columns =
        rows.length > 0 ? Object.keys(rows[0]).filter((c) => !hiddenColumns.includes(c)) : [];

    return (
        <section className="table-section">
            <header className="table-section__head">
                <h2>{title}</h2>
                {status === "ok" && <span className="table-section__count">{rows.length} sor</span>}
            </header>

            {status === "loading" && <p className="note">Adatok betöltése…</p>}
            {status === "error" && (
                <p className="note note--error">
                    Nem sikerült betölteni: {API_URL}{endpoint} ({error})
                </p>
            )}
            {status === "ok" && rows.length === 0 && <p className="note">Ebben a táblában még nincs adat.</p>}

            {status === "ok" && rows.length > 0 && (
                <div className="table-wrap">
                    <table>
                        <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col}>{col}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((row, i) => (
                            <tr key={row.id ?? i}>
                                {columns.map((col) => (
                                    <td key={col}>{formatCell(row[col])}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}