import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const colors = {
    primary: "#2F7D32",
    primaryDark: "#27632A",
    secondary: "#CDE6A8",
    accent: "#F4C430",
    background: "#F7F9E9",
    text: "#1A202C",
    danger: "#E74C3C",
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Failed to parse JSON:", jsonErr);
      }

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Could not reach server. Try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* darker overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      ></div>

      <style>{`
        /* card */
        .auth-card {
          position: relative;
          z-index: 8;
          width: clamp(320px, 90vw, 480px);
          padding: 2.25rem;
          border-radius: 18px;
          background: rgba(205, 230, 168, 0.56);
          border: 1px solid rgba(47,125,50,0.12);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .auth-card h1 {
          color: ${colors.primary};
          text-align: center;
          margin: 0 0 1.1rem 0;
          font-weight: 800;
          font-size: 28px;
        }

        /* form layout: ensure it is a column flexbox */
        .auth-card form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* inputs and button share the same width & sizing rules */
        .auth-card input,
        .auth-card .submit-btn {
          width: 100%;
          box-sizing: border-box; /* crucial so padding doesn't break width */
        }

        .auth-card input {
          padding: 0.85rem;
          border-radius: 10px;
          border: 1px solid ${colors.primary};
          background: ${colors.background};
          color: ${colors.text};
          font-size: 15px;
          outline: none;
          transition: box-shadow 0.18s ease, transform 0.12s ease, border-color 0.12s ease;
        }

        .auth-card input:focus {
          box-shadow: 0 6px 18px rgba(47,125,50,0.12), 0 0 0 4px rgba(47,125,50,0.08);
          border-color: ${colors.primaryDark};
          transform: translateY(-1px);
        }

        .auth-card .submit-btn {
          margin-top: 0.5rem;
          background-color: ${colors.primary};
          color: white;
          padding: 0.85rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.12s ease;
          font-size: 16px;
          display: inline-block;
          text-align: center;
        }

        .auth-card .submit-btn:hover {
          transform: translateY(-3px) scale(1.02);
          background-color: ${colors.primaryDark};
          box-shadow: 0 10px 30px rgba(39,99,42,0.28);
        }

        .auth-card .small-note {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.9rem;
          color: ${colors.text};
        }

        /* smaller screens */
        @media (max-width: 380px) {
          .auth-card {
            padding: 1rem;
            border-radius: 14px;
          }
          .auth-card h1 {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="auth-card" role="region" aria-label="Register form">
        <h1>Register Here</h1>

        {error && (
          <div
            style={{
              backgroundColor: colors.danger,
              color: "white",
              padding: "0.8rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              textAlign: "left",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            aria-label="Full name"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            aria-label="Email address"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            aria-label="Password"
          />

          <button className="submit-btn" type="submit">
            Register
          </button>
        </form>

        <p className="small-note">
          Already have an account?{" "}
          <a href="/login" style={{ color: colors.primary, fontWeight: "700" }}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
