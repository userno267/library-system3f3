import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

export default function MyBorrows() {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [borrows, setBorrows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const borrowsPerPage = 10;

  // 🌈 Same color palette used in Home.js
  const colors = {
    primary: "#2F7D32",       // deep green (titles / accents)
    secondary: "#CDE6A8",     // light green (table headers)
    accent: "#F4C430",        // yellow (buttons)
    success: "#4CAF50",       // green badge
    danger: "#E74C3C",        // red badge
    background: "#F7F9E9",    // cream background
    text: "#1A202C",
    hover: "#D9E8B4",         // soft green hover
    buttonHover: "#D4B12F"    // darker yellow hover
  };

  const fetchBorrows = () => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/borrow/${userId}`)
      .then(res => res.json())
      .then(data => setBorrows(data.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchBorrows();
  }, [userId]);

  const handleReturn = (bookId) => {
    fetch(`http://localhost:5000/api/borrow/return/${bookId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    })
      .then(res => res.json())
      .then(() => fetchBorrows())
      .catch(console.error);
  };

  // Pagination
  const indexOfLastBorrow = currentPage * borrowsPerPage;
  const indexOfFirstBorrow = indexOfLastBorrow - borrowsPerPage;
  const currentBorrows = borrows.slice(indexOfFirstBorrow, indexOfLastBorrow);
  const totalPages = Math.ceil(borrows.length / borrowsPerPage);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <Sidebar />

      <main style={{ flex: 1, padding: "1.5rem", backgroundColor: colors.background }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            color: colors.primary
          }}
        >
          My Borrowed Books
        </h1>

        <div
          style={{
            overflowX: "auto",
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "0.75rem",
            boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: colors.secondary, color: colors.primary }}>
              <tr>
                {["Title", "Author", "Borrow Date", "Status", "Action"].map((th) => (
                  <th
                    key={th}
                    style={{
                      padding: "0.6rem",
                      textAlign: "left",
                      border: `1px solid ${colors.primary}`
                    }}
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentBorrows.map((b) => (
                <tr
                  key={b.borrow_id}
                  style={{
                    borderBottom: `1px solid ${colors.primary}`,
                    transition: "0.2s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.hover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "0.6rem", color: colors.text }}>{b.title}</td>
                  <td style={{ padding: "0.6rem", color: colors.text }}>{b.author}</td>
                  <td style={{ padding: "0.6rem", color: colors.text }}>
                    {new Date(b.borrow_date).toLocaleDateString()}
                  </td>

                  {/* Status badge */}
                  <td style={{ padding: "0.6rem" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        color: "white",
                        backgroundColor:
                          b.status === "borrowed" ? colors.success : colors.danger
                      }}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td style={{ padding: "0.6rem" }}>
                    {b.status === "borrowed" && (
                      <button
                        onClick={() => handleReturn(b.book_id)}
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: "0.5rem",
                          border: "none",
                          backgroundColor: colors.accent,
                          color: colors.text,
                          cursor: "pointer",
                          fontWeight: 600,
                          transition: "0.3s"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = colors.buttonHover;
                          e.target.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = colors.accent;
                          e.target.style.transform = "scale(1)";
                        }}
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          style={{
            marginTop: "1.25rem",
            display: "flex",
            justifyContent: "center",
            gap: "0.35rem",
            flexWrap: "wrap"
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: "0.4rem 0.7rem",
                borderRadius: "0.35rem",
                border: `1px solid ${colors.primary}`,
                backgroundColor: currentPage === page ? colors.primary : colors.accent,
                color: currentPage === page ? "white" : colors.text,
                cursor: "pointer",
                transition: "0.2s"
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
