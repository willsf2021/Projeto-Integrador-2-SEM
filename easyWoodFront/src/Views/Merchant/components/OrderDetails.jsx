// src/components/Merchant/OrderDetail.jsx
import React, { useState, useEffect } from "react";
import MerchantOrderService from "../../../services/MerchantOrderService";

const MerchantOrderDetail = ({ order, onBack }) => {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [attachments, setAttachments] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        setLoading(true);
        const data = await MerchantOrderService.getAttachments(currentOrder.id);
        setAttachments(data);
      } catch (err) {
        setError("Erro ao carregar anexos: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttachments();
  }, [currentOrder.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updated = await MerchantOrderService.updateOrder(currentOrder.id, {
        service: currentOrder.service,
        description: currentOrder.description,
        price: currentOrder.price,
        status: currentOrder.status,
        payment_status: currentOrder.payment_status,
        due_date: currentOrder.due_date,
      });
      setCurrentOrder(updated);
      setSuccess("Pedido atualizado com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erro ao atualizar pedido: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (window.confirm("Tem certeza que deseja excluir este pedido?")) {
      try {
        setLoading(true);
        await MerchantOrderService.deleteOrder(currentOrder.id);
        onBack(); // Voltar para tela anterior
      } catch (err) {
        setError("Erro ao excluir pedido: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setLoading(true);
      const newAttachment = await MerchantOrderService.uploadAttachment(
        currentOrder.id,
        file
      );
      setAttachments([...attachments, newAttachment]);
      setFile(null);
      setSuccess("Anexo enviado com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erro ao enviar anexo: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (attachmentId, filename) => {
    try {
      const response = await MerchantOrderService.downloadAttachment(
        currentOrder.id,
        attachmentId
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Erro ao baixar anexo: " + err.message);
    }
  };

  const handleDeleteAttach = async (attachmentId) => {
    if (window.confirm("Tem certeza que deseja excluir este anexo?")) {
      try {
        await MerchantOrderService.deleteAttachment(
          currentOrder.id,
          attachmentId
        );
        setAttachments(attachments.filter((att) => att.id !== attachmentId));
        setSuccess("Anexo excluído com sucesso!");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Erro ao excluir anexo: " + err.message);
      }
    }
  };

  return (
    <div className="order-detail">
      <button className="btn btn-secondary" onClick={onBack}>
        &larr; Voltar para pedidos
      </button>

      <h2>Detalhes do Pedido</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleUpdateOrder} className="order-form">
        <div className="form-group">
          <label className="form-label">Serviço</label>
          <input
            type="text"
            name="service"
            className="form-input"
            value={currentOrder.service}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descrição</label>
          <textarea
            name="description"
            className="form-textarea"
            value={currentOrder.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Preço (R$)</label>
            <input
              type="number"
              name="price"
              className="form-input"
              value={currentOrder.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={currentOrder.status}
              onChange={handleChange}
              required
            >
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Completo</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Status de Pagamento</label>
            <select
              name="payment_status"
              className="form-select"
              value={currentOrder.payment_status}
              onChange={handleChange}
              required
            >
              <option value="pending_payment">Pendente</option>
              <option value="paid">Pago</option>
              <option value="overdue">Atrasado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Prazo de Entrega</label>
            <input
              type="date"
              name="due_date"
              className="form-input"
              value={currentOrder.due_date || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDeleteOrder}
            disabled={loading}
          >
            Excluir Pedido
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>

      <div className="attachments-section">
        <h3>Anexos</h3>

        <div className="upload-area">
          <input type="file" onChange={handleFileChange} disabled={loading} />
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? "Enviando..." : "Enviar Anexo"}
          </button>
        </div>

        {attachments.length > 0 ? (
          <ul className="attachment-list">
            {attachments.map((attachment) => (
              <li key={attachment.id} className="attachment-item">
                <div>
                  <span>{attachment.filename}</span>
                  <span className="file-size">
                    ({Math.round(attachment.size / 1024)} KB)
                  </span>
                </div>
                <div>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      handleDownload(attachment.id, attachment.filename)
                    }
                  >
                    Baixar
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleDeleteAttach(attachment.id)}
                    disabled={loading}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">Nenhum anexo encontrado</p>
        )}
      </div>
    </div>
  );
};

export default MerchantOrderDetail;
