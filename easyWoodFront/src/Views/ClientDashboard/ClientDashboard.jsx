// src/pages/ClientDashboard.jsx
import React from "react";
import "./ClientDashboard.css";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ProtectedRoutes } from "../../components/ProtectedRoutes.jsx";

export const ClientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem("userName") || "Cliente";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <ProtectedRoutes allowedRoles={["client"]}>
      <div className="client-dashboard">
        <header className="client-header">
          <div className="header-container">
            <div className="brand-section">
              <img
                src="/easy-wood-system.png"
                alt="Easy Wood System"
                className="brand-logo"
              />
              <h1 className="brand-title">Dashboard do Cliente</h1>
            </div>

            <div className="user-section">
              <div className="user-info">
                <span className="user-icon">👤</span>
                <span>{userName}</span>
              </div>
              <button onClick={handleLogout} className="logout-button">
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="dashboard-grid">
            <aside className="sidebar">
              <h2 className="sidebar-title">Menu</h2>
              <nav className="sidebar-nav">
                <Link
                  to="/dashboard-cliente/pedidos"
                  className={`nav-link ${
                    isActive("/dashboard-cliente/pedidos") ? "active" : ""
                  }`}
                >
                  <span className="nav-icon">📦</span>
                  <span>Pedidos Ativos</span>
                </Link>
                <Link
                  to="/dashboard-cliente/historico"
                  className={`nav-link ${
                    isActive("/dashboard-cliente/historico") ? "active" : ""
                  }`}
                >
                  <span className="nav-icon">🕒</span>
                  <span>Histórico de Pedidos</span>
                </Link>
              </nav>
            </aside>

            <div className="content-area">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoutes>
  );
};
