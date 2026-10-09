import TableSection from "./TableSection";
import "./App.css";

// A végpontok a backend Swagger oldaláról vannak (…/swagger).
// Egyesével add hozzá az újakat: ha az előző megjelent, jöhet a következő.
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
    return (
        <main className="page">
            <h1>Adatbázis áttekintés</h1>
            {TABLES.map((t) => (
                <TableSection
                    key={t.endpoint}
                    title={t.title}
                    endpoint={t.endpoint}
                    hiddenColumns={t.hiddenColumns}
                />
            ))}
        </main>
    );
}