import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Notifications() {
  const { user, token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  const colors = {
    primary: "#6B4226",    // Dark Wood Brown
    secondary: "#A67B5B",  // Medium Wood
    accent: "#D9C3A5",     // Light Wood / Beige
    background: "#F5F1EC", // Soft Cream
    text: "#3E2723",       // Dark Text
    buttonHover: "#8B5E3C"
  };

  const fetchNotifications = async () => {
    if (!user) return;
    const res = await fetch(`http://localhost:5000/api/notifications/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) setNotifications(data.data);
  };

  const markRead = async (id) => {
    await fetch(`http://localhost:5000/api/notifications/read/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // refresh every 1 min
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div style={{ position: "fixed", top: 80, right: 20, width: 320, zIndex: 1000 }}>
      {notifications.map(n => (
        <div
          key={n.id}
          style={{
            backgroundColor: n.is_read ? colors.accent : "#FFF3C4",
            padding: "0.75rem 1rem",
            marginBottom: "0.75rem",
            borderRadius: "0.75rem",
            boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
            color: colors.text,
            transition: "all 0.2s",
          }}
        >
          <div style={{ fontWeight: n.is_read ? "400" : "600" }}>{n.message}</div>
          {!n.is_read && (
            <button
              onClick={() => markRead(n.id)}
              style={{
                marginTop: "0.5rem",
                fontSize: "0.8rem",
                fontWeight: "500",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.5rem",
                border: "none",
                backgroundColor: colors.secondary,
                color: "white",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = colors.buttonHover;
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = colors.secondary;
                e.target.style.transform = "scale(1)";
              }}
            >
              Mark as read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
