import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActiveOrders from "../Merchant/ActiveOrders";
import OrderDetails from "../Merchant/OrderDetails";
import OrderHistory from "../Merchant/OrderHistory";
import CreateOrder from "../Merchant/CreateOrder"; // Importe o CreateOrder
import "./MerchantDashboard.css";

export const MerchantDashboard = () => {
  const [activeView, setActiveView] = useState("activeOrders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setActiveView("orderDetails");
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
    setActiveView("activeOrders");
  };

  const handleOrderCreated = (newOrder) => {
    setSelectedOrder(newOrder);
    setActiveView("orderDetails");
  };

  const renderContent = () => {
    switch (activeView) {
      case "activeOrders":
        return <ActiveOrders onViewOrder={handleViewOrder} />;
      case "orderHistory":
        return <OrderHistory onViewOrder={handleViewOrder} />;
      case "orderDetails":
        return (
          <OrderDetails order={selectedOrder} onBack={handleBackToOrders} />
        );
      case "createOrder": // Novo caso para criação de pedidos
        return <CreateOrder onCreated={handleOrderCreated} />;
      default:
        return <ActiveOrders onViewOrder={handleViewOrder} />;
    }
  };

  return (
    <div className="merchant-dashboard">
      <header className="merchant-header">
        <div className="header-container">
          <div className="brand-section">
            <div className="brand-logo">M</div>
            <h1 className="brand-title">ArtisanLink</h1>
          </div>
          <div className="user-section">
            <div className="user-info">
              <div className="user-icon">P</div>
              <span>Prestador</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="dashboard-grid">
          <aside className="sidebar">
            <h2 className="sidebar-title">Menu Prestador</h2>
            <nav className="sidebar-nav">
              <button
                className={`nav-link ${
                  activeView === "activeOrders" ? "active" : ""
                }`}
                onClick={() => setActiveView("activeOrders")}
              >
                <span className="nav-icon">📋</span>
                <span>Pedidos Ativos</span>
              </button>
              <button
                className={`nav-link ${
                  activeView === "orderHistory" ? "active" : ""
                }`}
                onClick={() => setActiveView("orderHistory")}
              >
                <span className="nav-icon">🕒</span>
                <span>Histórico de Pedidos</span>
              </button>
              <button
                className={`nav-link ${
                  activeView === "createOrder" ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedOrder(null);
                  setActiveView("createOrder");
                }}
              >
                <span className="nav-icon">➕</span>
                <span>Criar Novo Pedido</span>
              </button>
            </nav>
          </aside>

          <section className="content-area">{renderContent()}</section>
        </div>
      </main>
    </div>
  );
};
