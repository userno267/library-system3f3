import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/verify/${token}`);
        const data = await res.json();

        if (res.ok) {
          // Success: Email verified or already verified
          setStatus(data.message);
        } else {
          // Failure: invalid or expired token
          setError(data.message || "Verification failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("Could not reach server. Try again later.");
      }
    };

    verify();
  }, [token]);

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", textAlign: "center", padding: "20px", border: "1px solid #ddd", borderRadius: 8 }}>
      <h1>Email Verification</h1>
      {status && <p style={{ color: "green" }}>{status}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {(status || error) && (
        <p>
          <Link to="/login" style={{ color: "#3b82f6", textDecoration: "underline" }}>
            Go to Login
          </Link>
        </p>
      )}
    </div>
  );
}
