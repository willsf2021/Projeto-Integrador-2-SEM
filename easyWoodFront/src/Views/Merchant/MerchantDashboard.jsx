import { Link, Outlet, useNavigate } from "react-router-dom";
import "./MerchantDashboard.css";
import { useEffect, useState } from "react";
import { ModalUserInfo } from "../../shared/components/ModalUserInfo.jsx";

export const MerchantDashboard = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    setInfo();
  }, []);

  const setInfo = () => {
    let username = localStorage.getItem("userName");
    let email = localStorage.getItem("email");
    let type = localStorage.getItem("type");

    setUserInfo(() => ({
      name: username,
      email: email,
      type: type,
    }));
  };

  return (
    <div className="merchant-dashboard">
      <header className="merchant-header">
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
              <div className="user-icon">P</div>
              <span>Prestador</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Sair
            </button>
            {modalOpen && (
              <ModalUserInfo
                userInfo={userInfo}
                onClose={() => setModalOpen(false)}
              />
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="dashboard-grid">
          <aside className="sidebar">
            <h2 className="sidebar-title">Menu Prestador</h2>
            <nav className="sidebar-nav">
              <Link to="pedidos" className="nav-link">
                <span className="nav-icon">📋</span>
                <span>Pedidos Ativos</span>
              </Link>
              <Link to="historico" className="nav-link">
                <span className="nav-icon">🕒</span>
                <span>Histórico de Pedidos</span>
              </Link>
              <Link to="criar-pedido" className="nav-link">
                <span className="nav-icon">➕</span>
                <span>Criar Novo Pedido</span>
              </Link>
              <Link to="/estoque" className="nav-link">
                <span className="nav-icon">📦</span>
                <span>Estoque</span>
              </Link>
            </nav>
          </aside>

          <section className="content-area">
            <Outlet />
          </section>
        </div>
      </main>
    </div>
  );
};
