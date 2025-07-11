// src/pages/OrderDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClientOrderService from "../../../services/ClientOrderService";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await ClientOrderService.getOrderById(id);
        setOrderInfo(data);
      } catch (err) {
        console.log(err);
        if (err.response?.status === 403) {
          setError("Acesso não autorizado");
        } else if (err.response?.status === 404) {
          setError("Pedido não encontrado");
        } else {
          setError("Erro ao carregar pedido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const setOrderInfo = (data) => {
    let order = data;
    let status = "";

    switch (data.status) {
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
    setOrder(order);
  };

  const handleDownload = async (attachmentId, filename) => {
    try {
      const service = new ClientOrderService();
      const response = await service.downloadAttachment(id, attachmentId);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Acesso não autorizado");
      } else if (err.response?.status === 404) {
        alert("Anexo não encontrado");
      } else {
        alert("Falha ao baixar o arquivo");
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!order) return null;

  return (
    <div className="order-detail">
      <button onClick={() => navigate(-1)} className="btn-back">
        &larr; Voltar
      </button>

      <h2>Detalhes do Pedido</h2>

      <div className="order-info">
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Descrição do pedido:</strong> {order.description}
        </p>
        <p>
          <strong>Criado em:</strong>{" "}
          {new Date(order.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Atualizado em:</strong>{" "}
          {new Date(order.updated_at).toLocaleString()}
        </p>
      </div>

      <div className="attachments-section">
        <h3>Anexos</h3>
        {order.attachments?.length > 0 ? (
          <ul className="attachments-list">
            {order.attachments.map((attachment) => (
              <li key={attachment.id}>
                <button
                  onClick={() =>
                    handleDownload(attachment.id, attachment.original_name)
                  }
                  className="btn-download"
                >
                  Baixar: {attachment.original_name}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum anexo disponível</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
