import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url('bg.png')`,
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(6px)",
        }}
      ></div>

      <style>{`
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
        }

        .auth-card h1 {
          color: ${colors.primary};
          text-align: center;
          margin: 0 0 1.1rem 0;
          font-weight: 800;
          font-size: 28px;
        }

        .auth-card form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .auth-card input,
        .auth-card button {
          width: 100%;
          box-sizing: border-box;
        }

        .auth-card input {
          padding: 0.85rem;
          border-radius: 10px;
          border: 1px solid ${colors.primary};
          background: ${colors.background};
          color: ${colors.text};
          font-size: 15px;
          outline: none;
          transition: box-shadow 0.18s ease, transform 0.12s ease;
        }

        .auth-card input:focus {
          box-shadow: 0 6px 18px rgba(47,125,50,0.12), 0 0 0 4px rgba(47,125,50,0.08);
          border-color: ${colors.primaryDark};
          transform: translateY(-1px);
        }

        .auth-card button {
          margin-top: 0.5rem;
          background-color: ${colors.accent};
          color: ${colors.text};
          padding: 0.85rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.12s;
          font-size: 16px;
        }

        .auth-card button:hover {
          transform: translateY(-3px) scale(1.02);
          background-color: #d4b12f;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        }

        .auth-card .small-note {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.9rem;
          color: ${colors.text};
        }

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

      <div className="auth-card">
        <h1>Login Now</h1>

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
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <p className="small-note">
          Don't have an account?{" "}
          <a href="/register" style={{ color: colors.primary, fontWeight: 700 }}>
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
