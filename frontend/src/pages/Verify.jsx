// Verify.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Verify() {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    fetch(`http://localhost:5000/api/auth/verify/${token}`)
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch(() => setStatus("success please login"));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>{status}</h1>
      <a href="/login">Go to Login</a>
    </div>
  );
}
