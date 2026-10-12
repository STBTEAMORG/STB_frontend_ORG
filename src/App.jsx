import { useState } from "react";
import Login from "./Login";
import TableSection from "./TableSection";
import "./App.css";

const TOKEN_KEY = "stb_token";

// A végpontok a backend Swagger oldaláról vannak (…/swagger).
const TABLES = [
    { title: "Eszközök (assets)", endpoint: "/api/Assets" },
    { title: "Termek (rooms)", endpoint: "/api/Rooms" },
    {
        title: "Felhasználók (users)",
        endpoint: "/api/Users",
        // Jelszó jellegű oszlopok elrejtése (a pontos nevet a megjelenő táblából nézd meg)
        hiddenColumns: ["password", "password_hash", "passwordHash"],
    },

    // Ezekhez a backendben még nincs controller. Ha a backendes megírta, vedd ki a // jelet:
    // { title: "Foglalások (bookings)", endpoint: "/api/Bookings" },
    // { title: "Kreditnapló (credit_ledger)", endpoint: "/api/CreditLedger" },
    // { title: "Törölt rekordok archívuma", endpoint: "/api/DeletedRecordsArchive" },
];

export default function App() {
    // A token a böngészőben marad, így frissítés után is bejelentkezve maradsz
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

    function handleLogin(newToken) {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
    }

    function handleLogout() {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
    }

    // Nincs token → bejelentkező oldal. Sikeres belépés után a token beállításával
    // az alábbi táblás oldal jelenik meg.
    if (!token) return <Login onLogin={handleLogin} />;

    return (
        <main className="page">
            <div className="page__bar">
                <h1>Adatbázis áttekintés</h1>
                <button type="button" className="btn-secondary" onClick={handleLogout}>
                    Kijelentkezés
                </button>
            </div>

            {TABLES.map((t) => (
                <TableSection
                    key={t.endpoint}
                    title={t.title}
                    endpoint={t.endpoint}
                    hiddenColumns={t.hiddenColumns}
                    token={token}
                    onUnauthorized={handleLogout}
                />
            ))}
        </main>
    );
}