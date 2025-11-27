import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;
  const navigate = useNavigate();

  // Color Palette
  const colors = {
    primary: "#2F7D32",
    secondary: "#CDE6A8",
    accent: "#F4C430",
    success: "#4CAF50",
    danger: "#E74C3C",
    background: "#F7F9E9",
    text: "#1A202C",
    hover: "#EEF6E8",
    buttonHover: "#D4B12F",
  };

  const fetchBooks = () => {
    fetch("http://localhost:5000/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data.data || []))
      .catch(console.error);
  };

  const fetchCategories = () => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const handleBorrow = (book) => {
    if (!userId) return alert("Please log in to borrow");

    if (book.is_ebook) {
      if (!book.pdf_path) return alert("No PDF uploaded for this eBook");
      navigate(`/view-pdf/${book.id}`);
      return;
    }

    fetch(`http://localhost:5000/api/borrow/borrow/${book.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) alert(data.message);
        fetchBooks();
      })
      .catch(console.error);
  };

  const filteredBooks = books.filter(
    (b) =>
      (b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())) &&
      (selectedCategory === "" ||
        (b.category_name || "").toLowerCase() === selectedCategory.toLowerCase())
  );

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <Sidebar />

      {/* main area with same background as auth pages */}
      <main
        style={{
          flex: 1,
          padding: "1.5rem",
          backgroundColor: colors.background,
          position: "relative",
          overflowX: "auto",
        }}
      >
        {/* background image + overlay (placed behind content) */}
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

        {/* inline CSS block for consistent styling */}
        <style>{`
          .page-content { position: relative; z-index: 2; }

          .controls {
            display:flex;
            flex-wrap:wrap;
            justify-content:space-between;
            gap:12px;
            margin-bottom:1.25rem;
            align-items:center;
          }

          .search, .category {
            padding: 0.6rem 0.8rem;
            border-radius: 12px;
            border: 1px solid ${colors.primary};
            background: white;
            color: ${colors.text};
            box-shadow: 0 2px 6px rgba(0,0,0,0.06);
            font-size: 0.95rem;
          }

          .table-wrap {
            overflow-x:auto;
            background: white;
            padding: 1rem;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.07);
          }

          table.library-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.95rem;
          }

          table.library-table thead {
            background: linear-gradient(90deg, ${colors.secondary}, rgba(205,230,168,0.9));
            color: ${colors.primary};
          }

          table.library-table th, table.library-table td {
            text-align: left;
            padding: 0.65rem;
            border-bottom: 1px solid rgba(0,0,0,0.04);
          }

          table.library-table tbody tr {
            transition: background 0.18s ease, transform 0.12s ease;
          }

          table.library-table tbody tr:hover {
            background: ${colors.hover};
            transform: translateY(-2px);
          }

          .action-btn {
            padding: 0.45rem 0.9rem;
            background: ${colors.accent};
            color: ${colors.text};
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.12s;
          }

          .action-btn:hover {
            background: ${colors.buttonHover};
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          }

          .badge {
            padding: 4px 8px;
            border-radius: 6px;
            color: white;
            font-weight: 600;
            display: inline-block;
            font-size: 0.85rem;
          }

          .pagination {
            margin-top: 1rem;
            display:flex;
            justify-content:center;
            gap:8px;
            flex-wrap:wrap;
          }

          .page-btn {
            padding: 0.4rem 0.7rem;
            border-radius: 6px;
            border: 1px solid ${colors.primary};
            cursor: pointer;
            transition: background 0.12s ease, transform 0.12s;
            background: ${colors.accent};
            color: ${colors.text};
          }

          .page-btn.active {
            background: ${colors.primary};
            color: white;
            transform: translateY(-2px);
          }

          /* responsive tweaks */
          @media (max-width: 860px) {
            .controls { gap:10px; }
            .search { flex: 1 1 60%; min-width: 180px; }
            .category { flex: 1 1 35%; min-width: 140px; }
          }

          @media (max-width: 520px) {
            table.library-table th:nth-child(1),
            table.library-table td:nth-child(1) { display:none; } /* hide ID on tiny screens */
          }
        `}</style>

        <div className="page-content">
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: colors.primary,
            }}
          >
            Explore Books
          </h1>

          <div className="controls">
            <input
              className="search"
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              style={{ flex: "1", minWidth: "220px" }}
            />

            <select
              className="category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="table-wrap" role="region" aria-label="Books table">
            <table className="library-table" aria-describedby="books-list">
              <thead>
                <tr>
                  {["ID", "Title", "Author", "Category", "Type", "Copies", "Status", "Action"].map(
                    (th) => (
                      <th key={th}>{th}</th>
                    )
                  )}
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
                  currentBooks.map((book) => (
                    <tr key={book.id}>
                      <td>{book.id}</td>
                      <td style={{ fontWeight: 600, color: colors.primary }}>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.category_name || "Uncategorized"}</td>
                      <td>{book.is_ebook ? "eBook" : "Physical"}</td>
                      <td>{book.copies}</td>

                      <td>
                        <span
                          className="badge"
                          style={{ backgroundColor: book.copies > 0 ? colors.success : colors.danger }}
                        >
                          {book.copies > 0 ? "Available" : "Unavailable"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="action-btn"
                          onClick={() => handleBorrow(book)}
                          aria-label={book.is_ebook ? `Read ${book.title}` : `Borrow ${book.title}`}
                        >
                          {book.is_ebook ? "Read PDF" : "Borrow"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination" role="navigation" aria-label="Pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
