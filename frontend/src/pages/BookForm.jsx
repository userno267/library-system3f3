import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isEbook, setIsEbook] = useState(false);
  const [pdf, setPdf] = useState(null);
  const [copies, setCopies] = useState(1);

  // 🌈 Color Palette
  const colors = {
    primary: "#2F7D32",
    secondary: "#CDE6A8",
    accent: "#F4C430",
    background: "#F7F9E9",
    text: "#1A202C",
    hover: "#D9E8B4",
    buttonHover: "#D4B12F",
  };

  const fetchCategories = () => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const b = data.data;
        setTitle(b.title);
        setAuthor(b.author);
        setDescription(b.description);
        setCategory(b.category_name || "");
        setIsEbook(b.is_ebook);
        setCopies(b.copies);
      })
      .catch(console.error);
  }, [id]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);

    const matches = categories.filter((c) =>
      c.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(matches);
  };

  const handleSelectCategory = (name) => {
    setCategory(name);
    setFilteredCategories([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let categoryId = null;
    let existing = categories.find(
      (c) => c.name.toLowerCase() === category.toLowerCase()
    );

    // CREATE category if doesn't exist
    if (!existing && category.trim() !== "") {
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: category.trim() }),
      });
      const data = await res.json();
      if (data.success) existing = data.data;
      fetchCategories();
    }

    if (existing) categoryId = existing.id;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("category_id", categoryId);
    formData.append("is_ebook", isEbook);
    if (pdf) formData.append("pdf", pdf);
    formData.append("copies", copies);

    const url = id
      ? `http://localhost:5000/api/books/${id}`
      : "http://localhost:5000/api/books";
    const method = id ? "PUT" : "POST";

    fetch(url, { method, body: formData })
      .then((res) => res.json())
      .then(() => navigate("/"))
      .catch(console.error);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      {/* MAIN AREA CENTERED */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
          fontFamily: "Inter, sans-serif",
          padding: "1rem",
        }}
      >
        {/* SLIGHTLY SMALLER & CLEANER CONTAINER */}
        <div
          style={{
            backgroundColor: "white",
            padding: "2.1rem", // slightly reduced
            borderRadius: "1rem",
            width: "100%",
            maxWidth: "650px", // slightly smaller
            boxShadow: "0px 8px 20px rgba(0,0,0,0.12)",
          }}
        >
          <h1
            style={{
              fontSize: "1.9rem", // slightly smaller than 2.2rem
              fontWeight: "790",
              marginBottom: "1.2rem",
              color: colors.primary,
              textAlign: "center",
              letterSpacing: "0.5px",
            }}
          >
            {id ? "Edit Book" : "Add Book"}
          </h1>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.9rem", // slightly reduced spacing
            }}
          >
            {/* INPUT FIELDS */}
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                padding: "0.9rem",
                fontSize: "1.05rem", // slightly smaller
                borderRadius: "0.45rem",
                border: `2px solid ${colors.primary}`,
                fontWeight: "600",
                backgroundColor: "white",
                color: colors.text,
              }}
            />

            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              style={{
                padding: "0.9rem",
                fontSize: "1.05rem",
                borderRadius: "0.45rem",
                border: `2px solid ${colors.primary}`,
                fontWeight: "600",
                backgroundColor: "white",
                color: colors.text,
              }}
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{
                padding: "0.9rem",
                fontSize: "1.05rem",
                borderRadius: "0.45rem",
                border: `2px solid ${colors.primary}`,
                minHeight: "130px",
                fontWeight: "600",
                backgroundColor: "white",
                color: colors.text,
              }}
            />

            {/* CATEGORY */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={handleCategoryChange}
                required
                style={{
                  padding: "0.9rem",
                  fontSize: "1.05rem",
                  borderRadius: "0.40rem",
                  border: `2px solid ${colors.primary}`,
                  fontWeight: "600",
                  backgroundColor: "white",
                  width: "95%",
                }}
              />

              {filteredCategories.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    border: `2px solid ${colors.primary}`,
                    borderRadius: "0.5rem",
                    backgroundColor: "white",
                    zIndex: 10,
                    maxHeight: "180px",
                    overflowY: "auto",
                  }}
                >
                  {filteredCategories.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        padding: "0.8rem",
                        fontSize: "1rem",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = colors.hover)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "white")
                      }
                      onClick={() => handleSelectCategory(c.name)}
                    >
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CHECKBOX */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                fontSize: "1.05rem",
                fontWeight: "600",
                color: colors.text,
              }}
            >
              <input
                type="checkbox"
                checked={isEbook}
                onChange={(e) => setIsEbook(e.target.checked)}
                style={{ width: "18px", height: "18px" }}
              />
              Is eBook?
            </label>

            {isEbook && (
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdf(e.target.files[0])}
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              />
            )}

            <input
              type="number"
              min="1"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
              placeholder="Copies"
              required
              style={{
                padding: "0.9rem",
                fontSize: "1.05rem",
                borderRadius: "0.45rem",
                border: `2px solid ${colors.primary}`,
                fontWeight: "600",
                backgroundColor: "white",
                color: colors.text,
              }}
            />

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              style={{
                padding: "0.9rem",
                borderRadius: "0.5rem",
                border: "none",
                backgroundColor: colors.accent,
                color: colors.text,
                fontSize: "1.2rem",
                fontWeight: "800",
                cursor: "pointer",
                transition: "0.3s",
                letterSpacing: "0.5px",
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
              {id ? "Update Book" : "Add Book"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
