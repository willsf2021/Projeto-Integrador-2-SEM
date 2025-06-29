import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MerchantOrderService from "../../../services/MerchantOrderService";
import OrderEditModal from "../../../shared/components/OrderEditModal";
import "./ActiveOrders.css";

const MerchantActiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  // Função para abrir o modal de edição
  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setIsEditModalOpen(true);
  };

  // Função para atualizar a lista após edição
  const handleOrderUpdated = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await MerchantOrderService.getOrders();
        const activeOrders = data.filter(
          (order) => !["completed", "cancelled"].includes(order.status)
        );
        setOrders(activeOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewOrder = (orderId) => {
    navigate(`/dashboard-prestador/pedidos/${orderId}`);
  };

  if (loading) {
    return <div className="loading">Carregando pedidos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="active-orders">
      <h2>Pedidos Ativos</h2>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum pedido ativo no momento</p>
        </div>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.id} className="order-card">
              <div className="order-header">
                <h3>{order.service}</h3>
                <span className={`status-badge ${order.status}`}>
                  {order.status === "pending" && "Pendente"}
                  {order.status === "in_progress" && "Em Andamento"}
                </span>
              </div>

              <div className="order-details">
                <p>
                  <strong>Cliente:</strong> {order.client?.name || "N/A"}
                </p>
                <p>
                  <strong>Prazo:</strong>{" "}
                  {order.due_date
                    ? new Date(order.due_date).toLocaleDateString("pt-BR")
                    : "Sem prazo definido"}
                </p>
              </div>

              <div className="order-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => handleViewOrder(order.id)}
                >
                  Ver Detalhes
                </button>
                <button
                  className="btn btn-edit"
                  onClick={() => handleEditOrder(order)}
                >
                  Editar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {editingOrder && (
        <OrderEditModal
          order={editingOrder}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleOrderUpdated}
        />
      )}
    </div>
  );
};

export default MerchantActiveOrders;
