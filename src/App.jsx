import { useState } from "react";
import TableSection from "./TableSection";
import Login from "./Login";
import { getToken, setToken, clearToken } from "./api";
import "./App.css";

// A végpontok a backend Swagger oldaláról vannak (…/swagger).
const TABLES = [
    { title: "Eszközök (assets)", endpoint: "/api/Assets" },
    { title: "Termek (rooms)", endpoint: "/api/Rooms" },
    {
        title: "Felhasználók (users)",
        endpoint: "/api/Users",
        hiddenColumns: ["password", "password_hash", "passwordHash"],
    },
    // Ha a backendes megírta, vedd ki a // jelet:
    // { title: "Foglalások (bookings)", endpoint: "/api/Bookings" },
    // { title: "Kreditnapló (credit_ledger)", endpoint: "/api/CreditLedger" },
    // { title: "Törölt rekordok archívuma", endpoint: "/api/DeletedRecordsArchive" },
];

export default function App() {
    const [token, setTokenState] = useState(getToken());

    function handleLogin(newToken) {
        setToken(newToken);
        setTokenState(newToken);
    }

    function handleLogout() {
        clearToken();
        setTokenState(null);
    }

    // Nincs token → bejelentkező oldal
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
                    onUnauthorized={handleLogout}
                />
            ))}
        </main>
    );
}