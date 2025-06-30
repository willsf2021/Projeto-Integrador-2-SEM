import React from "react";
import { Link, useLocation } from "react-router-dom";

export const DashboardSidebar = ({ links, userType }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <aside className="dashboard-sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${isActive(link.path) ? "active" : ""}`}
          >
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-label">{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};