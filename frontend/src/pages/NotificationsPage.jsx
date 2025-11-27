import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

export default function NotificationsPage() {
  const { user, token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 10;

  // 🌈 Updated to your green–yellow palette
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

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setNotifications(data.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const markRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/read/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const indexOfLast = currentPage * notificationsPerPage;
  const indexOfFirst = indexOfLast - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

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
          My Notifications
        </h1>

        {notifications.length === 0 ? (
          <p style={{ color: colors.text }}>No notifications yet.</p>
        ) : (
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
                  {["Message", "Status", "Action"].map((th) => (
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
                {currentNotifications.map((n) => (
                  <tr
                    key={n.id}
                    style={{
                      borderBottom: `1px solid ${colors.primary}`,
                      transition: "0.2s"
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = colors.hover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td style={{ padding: "0.6rem", color: colors.text }}>
                      {n.message}
                    </td>

                    <td style={{ padding: "0.6rem" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          color: "white",
                          backgroundColor: n.is_read
                            ? colors.badgeRead
                            : colors.badgeUnread
                        }}
                      >
                        {n.is_read ? "Read" : "Unread"}
                      </span>
                    </td>

                    <td style={{ padding: "0.6rem" }}>
                      {!n.is_read && (
                        <button
                          onClick={() => markRead(n.id)}
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
                          Mark as read
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
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
                  backgroundColor:
                    currentPage === page ? colors.primary : colors.accent,
                  color: currentPage === page ? "white" : colors.text,
                  cursor: "pointer",
                  transition: "0.2s"
                }}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
