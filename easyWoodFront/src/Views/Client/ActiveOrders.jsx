// src/pages/ActiveOrders.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import "./ActiveOrders.css";

const ActiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const access_token = localStorage.getItem("token");

        const response = await axios.get("/client/orders", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        setOrders(response.data);
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

  useEffect(() => {
    console.log(orders[0]);
  }, [orders]);

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
              <h3>Pedido #{order.id}</h3>
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
