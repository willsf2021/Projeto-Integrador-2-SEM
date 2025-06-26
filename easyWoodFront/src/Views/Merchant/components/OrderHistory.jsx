import React, { useState, useEffect } from "react";
import MerchantOrderService from "../../../services/MerchantOrderService";

const OrderHistory = ({ onViewOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await MerchantOrderService.getOrders();
        const completedOrders = data.filter((order) =>
          ["completed", "cancelled"].includes(order.status)
        );
        setOrders(completedOrders);
      } catch (err) {
        setError(err.message);
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

  if (loading) {
    return <div className="loading">Carregando histórico...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="order-history">
      <div className="section-header">
        <h2>Histórico de Pedidos</h2>

        <div className="filters">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todos
          </button>
          <button
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completos
          </button>
          <button
            className={`filter-btn ${filter === "cancelled" ? "active" : ""}`}
            onClick={() => setFilter("cancelled")}
          >
            Cancelados
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="orders-table">
          <div className="table-header">
            <div>Serviço</div>
            <div>Cliente</div>
            <div>Valor</div>
            <div>Status</div>
            <div>Ações</div>
          </div>

          {filteredOrders.map((order) => (
            <div key={order.id} className="table-row">
              <div className="service-cell">{order.service}</div>
              <div>{order.client?.name || "N/A"}</div>
              {/* <div>R$ {order.price.toFixed(2)}</div> */}
              <div>
                <span className={`status-badge ${order.status}`}>
                  {order.status === "completed" && "Completo"}
                  {order.status === "cancelled" && "Cancelado"}
                </span>
              </div>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() => onViewOrder(order)}
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
