import React, { useEffect, useState } from "react";
import ClientOrderService from "../../../services/ClientOrderService";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await ClientOrderService.getOrderHistory();
        setOrderInfo(data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("Acesso não autorizado");
        } else {
          setError("Erro ao carregar histórico");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const setOrderInfo = (data) => {
    let orders = data.map((order) => {
      let status = "";
      switch (order.status) {
        case "pending":
          status = "Pendente";
          break;
        case "canceled":
          status = "Cancelado";
          break;
        case "completed":
          status = "Concluído";
          break;
        case "in_progress":
          status = "Em andamento";
          break;
      }
      order.status = status;
      return order;
    });
    setOrders(orders);
  };

  if (loading)
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Carregando histórico de pedidos...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-state">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="history-container">
      <div className="orders-header">
        <h2>Histórico de Pedidos concluídos ou cancelados</h2>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>Sem pedidos finalizados ainda</h3>
          <p>Quando seus pedidos forem concluídos, eles aparecerão aqui.</p>
        </div>
      ) : (
        <div className="orders-table">
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Criação</th>
                <th>Atualização</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{new Date(order.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
