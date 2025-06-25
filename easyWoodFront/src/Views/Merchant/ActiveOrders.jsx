import React, { useState, useEffect } from "react";
import { getMerchantOrders } from "../../api/merchantOrders";

const ActiveOrders = ({ onViewOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMerchantOrders();
        // Filtrar apenas pedidos ativos (não completos ou cancelados)
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
                  {/* <strong>Valor:</strong> R$ {order.price.toFixed(2)} */}
                </p>
                <p>
                  <strong>Prazo:</strong>{" "}
                  {order.due_date || "Sem prazo definido"}
                </p>
              </div>

              <div className="order-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => onViewOrder(order)}
                >
                  Ver Detalhes
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActiveOrders;
