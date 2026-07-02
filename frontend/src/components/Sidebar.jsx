import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const studentLinks = [
  { to: "/student/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/student/drives", icon: "🚀", label: "Upcoming Drives" },
  { to: "/student/applications", icon: "📋", label: "My Applications" },
  { to: "/student/profile", icon: "👤", label: "My Profile" },
];

const adminLinks = [
  { to: "/admin/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/admin/students", icon: "🎓", label: "Students" },
  { to: "/admin/companies", icon: "🏢", label: "Companies" },
  { to: "/admin/drives", icon: "🚀", label: "Drives" },
  { to: "/admin/create-drive", icon: "➕", label: "Create Drive" },
  { to: "/admin/eligibility", icon: "🎯", label: "Eligibility" },
];


const companyLinks = [
  { to: "/company/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/company/drives", icon: "🚀", label: "Our Drives" },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links =
    user?.role === "ADMIN"
      ? adminLinks
      : user?.role === "COMPANY"
      ? companyLinks
      : studentLinks;

  const sectionLabel =
    user?.role === "ADMIN"
      ? "Administration"
      : user?.role === "COMPANY"
      ? "Company Portal"
      : "Student Portal";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img
              src="/HierVo.png"
              alt="HireVo Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                mixBlendMode: "multiply"
              }}
            />
          </div>
          <div className="sidebar-brand">
            <span className="sidebar-brand-name">HireVo</span>
            <span className="sidebar-brand-sub">Smart Placement</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">{sectionLabel}</div>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initial}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.email}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
            <button
              className="sidebar-logout"
              onClick={handleLogout}
              title="Logout"
            >
              ⏻
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
