// pages/AdminDashboard.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

// charts
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export default function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/");
  }, [user, navigate]);

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 3;

  // === KEEP COLORS EXACTLY AS YOU HAD THEM ===
  const colors = {
    primary: "#2F7D32",       // Dark Green
    secondary: "#CDE6A8",     // Light Green Header
    accent: "#F4C430",        // Yellow Buttons
    background: "#F7F9E9",    // Soft Cream
    text: "#1A202C",
    hover: "#D9E8B4",         // Light Green Hover
    buttonHover: "#D4B12F",   // Darker Yellow Hover
    badgeRead: "#4CAF50",     // Green
    badgeUnread: "#E74C3C"    // Red
  };

  // fetchers
  const fetchBooks = () => {
    fetch("http://localhost:5000/api/books")
      .then((r) => r.json())
      .then((d) => setBooks(d.data || []))
      .catch(console.error);
  };

  const fetchCategories = () => {
    fetch("http://localhost:5000/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.data || []))
      .catch(console.error);
  };

  const fetchBorrows = () => {
    fetch("http://localhost:5000/api/admin/borrow-records")
      .then((r) => r.json())
      .then((d) => setBorrows(d.data || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchBorrows();
  }, []);

  const handleDelete = (id) => {
    if (!confirm("Delete this book?")) return;
    fetch(`http://localhost:5000/api/books/${id}`, { method: "DELETE" })
      .then(() => fetchBooks())
      .catch(console.error);
  };

  const requestAIInsights = async () => {
    // ... AI request code unchanged
    setAiLoading(true);
    setAiError(null);
    setInsights(null);
    try {
      const payload = {
        stats: {
          total_books: books.length,
          total_categories: categories.length,
          total_borrow_records: borrows.length,
          ebook_count: books.filter(b => b.is_ebook).length,
          physical_count: books.filter(b => !b.is_ebook).length,
          low_copy_books_count: books.filter(b => b.copies < 3).length
        },
        books: books.map(b => ({
          id: b.id,
          title: b.title,
          author: b.author,
          category_name: b.category_name || "Uncategorized",
          copies: b.copies,
          is_ebook: b.is_ebook,
          checkouts: b.checkouts || 0
        })),
        categories: categories.map(c => ({ id: c.id, name: c.name })),
        borrows: borrows.slice(0, 500)
      };

      const res = await fetch("http://localhost:5000/api/admin/ai-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `AI endpoint responded ${res.status}`);
      }

      const data = await res.json();
      setInsights(data);
    } catch (err) {
      console.error("AI request failed:", err);
      setAiError(err.message || "Unknown error");
    } finally {
      setAiLoading(false);
    }
  };

  // Filtering and pagination
  const filteredBooks = books.filter((b) =>
    (b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())) &&
    (selectedCategory === "" ||
      (b.category_name || "").toLowerCase() === selectedCategory.toLowerCase())
  );

  const indexOfLast = currentPage * booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfLast - booksPerPage, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));

  // Charts data
  const booksPerCategory = categories.map((cat) => ({
    name: cat.name,
    count: books.filter((b) => b.category_name === cat.name).length
  }));

  const ebookCount = books.filter((b) => b.is_ebook).length;
  const physicalCount = books.length - ebookCount;
  const pieData = [
    { name: "eBooks", value: ebookCount },
    { name: "Physical", value: physicalCount }
  ];

  const chartColors = [colors.primary, colors.accent];

  const lowCopyBooks = books.filter(b => b.copies < 3).map(b => ({ title: b.title, copies: b.copies }));
  const categoriesNeedingBooks = categories.map(cat => {
    const count = books.filter(b => b.category_name === cat.name).length;
    return { category: cat.name, count };
  }).filter(c => c.count < 5);

  // local state related to AI (kept here so the code compiles)
  const [insights, setInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <Sidebar />

      <main style={{ flex: 1, padding: "1.5rem", backgroundColor: colors.background, position: "relative" }}>
        {/* background image (uploaded file path) */}
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            backgroundImage: "url('/mnt/data/965a45a9-f6d0-4129-8f38-bbcf4b14fa39.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(6px) brightness(0.55)",
            pointerEvents: "none",
          }}
        />

        {/* shared CSS (hover, table, cards) */}
        <style>{`
          .page-wrap { position: relative; z-index: 2; }
          .controls { display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:1rem; }
          .controls input, .controls select {
            padding: 0.5rem;
            border-radius: 6px;
            border: 1px solid ${colors.primary};
            min-width: 160px;
            background: white;
            color: ${colors.text};
          }
          .controls .btn {
            padding: 0.5rem 1rem;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-weight: 600;
          }
          .btn-accent { background: ${colors.accent}; color: ${colors.text}; }
          .btn-accent:hover { background: ${colors.buttonHover}; transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.12); }
          .btn-primary { background: ${colors.primary}; color: white; }
          .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

          .card { background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 6px 15px rgba(0,0,0,0.08); }

          table.admin-table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
          table.admin-table thead { background: linear-gradient(90deg, ${colors.secondary}, rgba(205,230,168,0.9)); color: ${colors.primary}; }
          table.admin-table th, table.admin-table td { padding: 0.6rem; text-align:left; border-bottom: 1px solid rgba(0,0,0,0.04); }
          table.admin-table tbody tr { transition: background 0.18s ease, transform 0.12s ease; }
          table.admin-table tbody tr:hover { background: ${colors.hover}; transform: translateY(-2px); }

          .badge { padding: 4px 8px; border-radius: 6px; color: white; font-weight: 600; font-size: 0.85rem; display:inline-block; }

          .stats { display:flex; gap:1rem; margin-top:1rem; flex-wrap:wrap; }
          .stat-card { padding: 1rem; border-radius: 8px; min-width: 160px; background: ${colors.secondary}; color: ${colors.primary}; box-shadow: 0 2px 6px rgba(0,0,0,0.06); }

          @media (max-width: 880px) {
            .controls input { min-width: 140px; }
            .controls { gap: 10px; }
          }

          @media (max-width: 520px) {
            table.admin-table th:nth-child(1), table.admin-table td:nth-child(1) { display:none; } /* hide ID */
          }
        `}</style>

        <div className="page-wrap">
          <h1 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "0.75rem", color: colors.primary }}>
            Admin Dashboard — Insights & Analytics
          </h1>

          {/* Controls */}
          <div className="controls">
            <input
              value={search}
              placeholder="Search by title or author..."
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
            <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>

            <button className="btn btn-accent" onClick={() => navigate("/books/add")}>
              Add Book
            </button>

            <button className="btn btn-primary" onClick={requestAIInsights} disabled={aiLoading}>
              {aiLoading ? "Analyzing..." : "Run AI Insights"}
            </button>
          </div>

          {/* Table */}
          <div className="card" style={{ marginBottom: 12 }}>
            <table className="admin-table" role="table" aria-label="Books table">
              <thead>
                <tr>
                  {["ID", "Title", "Author", "Category", "Type", "Copies", "Status", "Actions"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentBooks.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
                      No books found.
                    </td>
                  </tr>
                ) : (
                  currentBooks.map(b => (
                    <tr key={b.id}>
                      <td style={{ color: colors.text }}>{b.id}</td>
                      <td style={{ color: colors.text }}>{b.title}</td>
                      <td style={{ color: colors.text }}>{b.author}</td>
                      <td style={{ color: colors.text }}>{b.category_name || "Uncategorized"}</td>
                      <td style={{ color: colors.text }}>{b.is_ebook ? "eBook" : "Physical"}</td>
                      <td style={{ color: colors.text }}>{b.copies}</td>
                      <td>
                        <span
                          className="badge"
                          style={{ backgroundColor: b.is_ebook || b.copies > 0 ? colors.badgeRead : colors.badgeUnread }}
                        >
                          {b.is_ebook || b.copies > 0 ? "Available" : "Not Available"}
                        </span>
                      </td>
                      <td style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => navigate(`/books/edit/${b.id}`)}
                          className="btn btn-accent"
                          style={{ padding: "6px 10px", borderRadius: 6 }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="btn"
                          style={{ background: colors.badgeUnread, color: "white", padding: "6px 10px", borderRadius: 6 }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ marginBottom: 12 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: `1px solid ${colors.primary}`,
                  backgroundColor: currentPage === page ? colors.primary : colors.accent,
                  color: currentPage === page ? "white" : colors.text,
                  marginRight: 6,
                  cursor: "pointer"
                }}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Statistics */}
          {/* AI Summary Panel */}
{insights && (
  <div className="card" style={{ marginTop: 16 }}>
    
    {/* Title */}
    <h2 style={{
      color: colors.primary,
      marginBottom: 10,
      fontSize: "1.4rem",
      fontWeight: "700",
      borderBottom: `2px solid ${colors.secondary}`,
      paddingBottom: 4
    }}>
      🤖 AI Summary
    </h2>

    {/* Summary Box */}
    <div style={{
      background: colors.secondary,
      padding: "12px",
      borderRadius: 8,
      marginBottom: 12,
      color: colors.text,
      lineHeight: "1.6",
      whiteSpace: "pre-wrap"
    }}>
      {insights.summary || insights.insights || "No summary available."}
    </div>

    {/* Recommendations */}
    {insights.recommendations && (
      <>
        <h3 style={{
          marginTop: 10,
          color: colors.primary,
          fontWeight: 600
        }}>
          📌 Recommendations
        </h3>

        <div style={{
          background: "#FFFBE6",
          padding: "12px",
          borderRadius: 8,
          borderLeft: `5px solid ${colors.accent}`,
          whiteSpace: "pre-wrap",
          lineHeight: "1.6"
        }}>
          {insights.recommendations}
        </div>
      </>
    )}
  </div>
)}

{/* Loading */}
{aiLoading && (
  <div style={{
    padding: 10,
    marginTop: 10,
    background: "#FFF3CD",
    borderRadius: 6,
    color: "#856404",
    fontWeight: 600
  }}>
    ⏳ AI is analyzing your library data...
  </div>
)}

{/* Error */}
{aiError && (
  <div style={{
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    color: "white",
    background: colors.badgeUnread,
    fontWeight: 600
  }}>
    ❌ Error: {aiError}
  </div>
)}

          <h2 style={{ marginTop: 12, color: colors.primary }}>Library Statistics</h2>
          <div className="stats">
            <div className="stat-card">Total Books: <b>{books.length}</b></div>
            <div className="stat-card">Categories: <b>{categories.length}</b></div>
            <div className="stat-card">eBooks: <b>{ebookCount}</b></div>
          </div>

          {/* Charts */}
          <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 420px", minWidth: 320, height: 300 }} className="card">
              <h3>Books Per Category</h3>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={booksPerCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill={colors.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ flex: "1 1 320px", minWidth: 320, height: 300 }} className="card">
              <h3> eBooks vs Physical</h3>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} label dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={chartColors[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights (if present) */}
          {insights && (
            <div style={{ marginTop: 18 }} className="card">
              {lowCopyBooks.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <h3> Books Low in Copies</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={lowCopyBooks}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="copies" fill={colors.badgeUnread} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {categoriesNeedingBooks.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <h3>Categories Needing More Books</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoriesNeedingBooks}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill={colors.accent} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div style={{ marginTop: 12 }}>
                <h3>eBooks vs Physical</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      <Cell fill={colors.primary} />
                      <Cell fill={colors.accent} />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
