// src/pages/ActiveOrders.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ClientOrderService from "../../../services/ClientOrderService";
import "./ActiveOrders.css";

const ActiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ClientOrderService.getActiveOrders();
        setOrderInfo(data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("Acesso não autorizado");
        } else {
          setError("Erro ao carregar pedidos");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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
    console.log(orders)
    setOrders(orders);
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="orders-container">
      <h2>Pedidos Ativos</h2>
      {orders.length === 0 ? (
        <p>Nenhum pedido ativo</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <h3>{order.service}</h3>
              <p>Status: {order.status}</p>
              <p>
                Criado em: {new Date(order.created_at).toLocaleDateString()}
              </p>
              <Link
                to={`/dashboard-cliente/pedidos/${order.id}`}
                className="btn"
              >
                Ver Detalhes
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveOrders;
