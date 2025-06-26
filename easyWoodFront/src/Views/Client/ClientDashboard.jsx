// src/pages/ClientDashboard.jsx
import React, { useEffect, useState } from "react";
import "./ClientDashboard.css";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ProtectedRoutes } from "../../components/ProtectedRoutes.jsx";
import UserInfo from "../../services/UserService.js";
import { ModalUserInfo } from "../../shared/components/ModalUserInfo.jsx";

export const ClientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    type: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  useEffect(() => {
    setInfo();
  }, []);

  const setInfo = async () => {
    let username = localStorage.getItem("userName");
    let email = localStorage.getItem("email");
    let type = localStorage.getItem("type");

    setUserInfo((prevValue) => ({
      name: username,
      email: email,
      type: type,
    }));
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
              <h1 className="brand-title">Olá, {userInfo.name || "cliente"}</h1>
            </div>

            <div className="user-section">
              <div
                className="user-info"
                onClick={() => {
                  setModalOpen((modalOpen) => !modalOpen);
                }}
              >
                <span className="user-icon">👤</span>
                <span>{userInfo.name}</span>
              </div>

              {modalOpen && (
                <ModalUserInfo
                  userInfo={userInfo}
                  onClose={() => setModalOpen(false)}
                />
              )}

              <button
                onClick={handleLogout}
                className="logout-button"
                aria-label="Sair do sistema"
              >
                <span>Sair</span>
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
                  <span>Pedidos anteriores</span>
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
