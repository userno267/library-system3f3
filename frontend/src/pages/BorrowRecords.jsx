import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

export default function AdminBorrowRecords() {
  const { user } = useContext(AuthContext);

  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // theme colors (UNCHANGED)
  const colors = {
    primary: "#2F7D32",
    secondary: "#CDE6A8",
    accent: "#F4C430",
    background: "#F7F9E9",
    text: "#1A202C",
    hover: "#D9E8B4",
    buttonHover: "#D4B12F",
    badgeBorrowed: "#E74C3C",
    badgeReturned: "#4CAF50"
  };

  useEffect(() => {
    if (user?.role !== "admin") return;

    fetch("http://localhost:5000/api/borrow/")
      .then(res => res.json())
      .then(data => {
        if (data.success) setRecords(data.data);
      });
  }, [user]);

  const filtered = records.filter(r =>
    r.book_title.toLowerCase().includes(search.toLowerCase()) ||
    r.user_name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(filtered.length / limit);

  if (user?.role !== "admin") return <h2>Unauthorized</h2>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "1.5rem", position: "relative" }}>

        {/* BLURRED DARK BACKGROUND (same as AdminDashboard) */}
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: "url('/mnt/data/965a45a9-f6d0-4129-8f38-bbcf4b14fa39.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(6px) brightness(0.55)",
            zIndex: 0,
            pointerEvents: "none"
          }}
        />

        {/* Local page wrapper */}
        <div style={{ position: "relative", zIndex: 2 }}>

          {/* PAGE HEADER */}
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: colors.primary
            }}
          >
            Borrowing Records
          </h1>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by book or user name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "0.5rem",
              width: "300px",
              marginBottom: "1rem",
              borderRadius: "0.375rem",
              border: `1px solid ${colors.primary}`,
              background: "white"
            }}
          />

          {/* TABLE CARD */}
          <div
            style={{
              overflowX: "auto",
              background: "white",
              borderRadius: "0.75rem",
              padding: "1rem",
              boxShadow: "0 6px 15px rgba(0,0,0,0.12)"
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.primary
                }}
              >
                <tr>
                  {["ID", "User", "Email", "Book", "Borrow Date", "Return Date", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "0.6rem",
                          border: `1px solid rgba(0,0,0,0.08)`,
                          textAlign: "left",
                          fontWeight: "600"
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {paginated.map((r) => (
                  <tr
                    key={r.borrow_id}
                    className="hover-row"
                    style={{ transition: "0.18s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.hover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td style={{ padding: "0.6rem", color: colors.text }}>{r.borrow_id}</td>
                    <td style={{ padding: "0.6rem", color: colors.text }}>{r.user_name}</td>
                    <td style={{ padding: "0.6rem", color: colors.text }}>{r.user_email}</td>
                    <td style={{ padding: "0.6rem", color: colors.text }}>{r.book_title}</td>
                    <td style={{ padding: "0.6rem", color: colors.text }}>
                      {new Date(r.borrow_date).toLocaleString()}
                    </td>
                    <td style={{ padding: "0.6rem", color: colors.text }}>
                      {r.return_date
                        ? new Date(r.return_date).toLocaleString()
                        : "Not Returned"}
                    </td>
                    <td style={{ padding: "0.6rem" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          color: "white",
                          backgroundColor:
                            r.status === "borrowed"
                              ? colors.badgeBorrowed
                              : colors.badgeReturned,
                          fontWeight: 600
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ marginTop: "1rem" }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  padding: "0.35rem 0.75rem",
                  marginRight: "0.25rem",
                  borderRadius: "0.375rem",
                  border: `1px solid ${colors.primary}`,
                  backgroundColor: page === i + 1 ? colors.primary : colors.accent,
                  color: page === i + 1 ? "white" : colors.text,
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
