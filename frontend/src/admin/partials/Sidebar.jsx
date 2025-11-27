import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/admin/dashboard">
        <div className="sidebar-brand-icon"><i className="fas fa-book"></i></div>
        <div className="sidebar-brand-text mx-3">Library Admin</div>
      </Link>
      <hr className="sidebar-divider my-0" />
      <li className="nav-item">
        <Link className="nav-link" to="/admin/dashboard">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>
      </li>
      {/* Add more nav items here */}
    </ul>
  );
}
