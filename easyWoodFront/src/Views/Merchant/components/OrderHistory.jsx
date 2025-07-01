import React, { useState, useEffect } from "react";
import MerchantOrderService from "../../../services/MerchantOrderService";
import OrderEditModal from "../../../shared/components/OrderEditModal";
import "./OrderHistory.css";

const OrderHistory = ({ onViewOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingOrder, setEditingOrder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setIsEditModalOpen(true);
  };

  const handleOrderUpdated = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await MerchantOrderService.getOrders();
        console.log("Dados da API:", data);

        const completedOrders = data.filter((order) =>
          ["completed", "cancelled"].includes(order.status)
        );

        setOrders(completedOrders);
      } catch (err) {
        console.error("Erro ao buscar o.s:", err);
        setError("Erro ao carregar histórico de o.s");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando histórico de ordens de serviço...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="order-history-container">
      <div className="section-header">
        <h2>Ordens de Serviço Finalizadas</h2>

        <div className="filters-container">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Todas
            </button>
            <button
              className={`filter-btn ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completas
            </button>
            <button
              className={`filter-btn ${filter === "cancelled" ? "active" : ""}`}
              onClick={() => setFilter("cancelled")}
            >
              Canceladas
            </button>
          </div>

          <div className="results-count">
            {filteredOrders.length}{" "}
            {filteredOrders.length === 1
              ? "ordem de serviço"
              : "ordens de serviço"}{" "}
            encontrada(s)
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Nenhuma ordem de serviço encontrada</h3>
          <p>Não encontramos ordens de serviço no seu histórico.</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="service-cell">{order.service || "N/A"}</td>
                    <td>{order.client?.name || "N/A"}</td>
                    <td>{formatDate(order.createdAt || order.date)}</td>
                    <td className="price-cell">
                      {order.price ? formatCurrency(order.price) : "N/A"}
                    </td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status === "completed" && "Completo"}
                        {order.status === "cancelled" && "Cancelado"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditOrder(order)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
                {editingOrder && (
                  <OrderEditModal
                    order={editingOrder}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={handleOrderUpdated}
                  />
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
