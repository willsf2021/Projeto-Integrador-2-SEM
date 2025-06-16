import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const access_token = localStorage.getItem("token");

        const response = await axios.get("/client/orders/history", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        setOrders(response.data);
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

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="history-container">
      <h2>Histórico de Pedidos</h2>
      {orders.length === 0 ? (
        <p>Nenhum pedido no histórico</p>
      ) : (
        <div className="orders-table">
          <table>
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
