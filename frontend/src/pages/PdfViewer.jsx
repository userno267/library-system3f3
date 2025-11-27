import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function PdfViewer() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/books/${id}`)
      .then(res => res.json())
      .then(data => setBook(data.data))
      .catch(console.error);
  }, [id]);

  if (!book) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        
        <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" }}>
          <p style={{ fontSize: "1.5rem", color: "#6b7280" }}>Loading book...</p>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
     

      <main style={{ flex: 1, backgroundColor: "#f9fafb", padding: "2rem" }}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#1f2937",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            border: "none",
            cursor: "pointer",
            marginBottom: "2rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          ← Back
        </button>

        {/* Book Info Card */}
        <div style={{
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          marginBottom: "2rem"
        }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>{book.title}</h1>
          <p style={{ fontSize: "1.125rem", color: "#4b5563", marginBottom: "0.5rem" }}>Author: {book.author}</p>
          <p style={{ fontSize: "1rem", color: "#6b7280" }}>{book.description || "No description available."}</p>
        </div>

        {/* PDF Viewer */}
        <div style={{
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
          {book.pdf_path ? (
            <iframe
              src={`http://localhost:5000/uploads/pdf/${book.pdf_path}`}
              title="PDF Viewer"
              width="100%"
              height="700px"
              style={{ border: "none", borderRadius: "0.375rem" }}
            />
          ) : (
            <p style={{ color: "#dc2626", fontWeight: "600" }}>No PDF uploaded for this book.</p>
          )}
        </div>
      </main>
    </div>
  );
}
