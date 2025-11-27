import { Link, useLocation } from "react-router-dom"; 
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Color Palette
const colors = {
  primary: "#2F7D32",       // Deep green
  secondary: "#A4E786",     // Light green
  accent: "#F4C430",        // Yellow buttons
  success: "#4CAF50",
  danger: "#E74C3C",
  text: "white",
  hover: "rgba(255,255,255,0.15)",
  buttonHover: "#c0392b"
};

// Base link style
const baseLinkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "0.5rem",
  padding: "0.6rem 1rem",
  borderRadius: "0.5rem",
  textDecoration: "none",
  color: colors.text,
  fontWeight: 500,
  transition: "all 0.3s ease",
};

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const renderLink = (to, label) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        style={{
          ...baseLinkStyle,
          backgroundColor: isActive ? colors.hover : "transparent",
          boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.2)" : "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.hover;
          e.currentTarget.style.transform = "scale(1.02)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isActive ? colors.hover : "transparent";
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = isActive ? "0 2px 6px rgba(0,0,0,0.2)" : "none";
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: "1.5rem 1rem",
        background: `linear-gradient(to bottom, ${colors.primary}, ${colors.secondary})`,
        color: colors.text,
        width: "260px",
        justifyContent: "space-between",
        boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
      }}
    >
      <div>
        <h2 style={{
          fontSize: "1.75rem",
          fontWeight: "bold",
          marginBottom: "2rem",
          textAlign: "center",
          color: colors.text,
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
        }}>
          LibraSchool
        </h2>

        {renderLink("/", "Home")}
        {renderLink("/my-borrows", "My Borrows")}
        {renderLink("/notifications", "Notifications")}
        {renderLink("/assistant", "Alibrarian Assistant")}

        {user?.role === "admin" && (
          <>
            {renderLink("/books/add", "Add Book")}
            {renderLink("/admin", "Admin Dashboard")}
            {renderLink("/admin/borrow-records", "Borrow Records")}
          </>
        )}
      </div>

      <button
        onClick={logout}
        style={{
          ...baseLinkStyle,
          backgroundColor: colors.danger,
          textAlign: "center",
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
          marginTop: "1rem",
          transition: "all 0.3s ease",
          
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.buttonHover;
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.danger;
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        Logout
      </button>
    </nav>
  );
};

export default Sidebar;
