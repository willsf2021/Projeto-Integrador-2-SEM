// src/components/shared/OrderEditModal.jsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import MerchantOrderService from "../../services/MerchantOrderService";
import "./OrderEditModal.css";

const OrderEditModal = ({ order, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({ ...order });
  const [statusOnly, setStatusOnly] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fecha modal com ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Bloqueia scroll do fundo
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setStatusOnly(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updateData =
        activeTab === "status"
          ? { status: statusOnly }
          : { ...formData, price: parseFloat(formData.price) };

      const updatedOrder = await MerchantOrderService.updateOrder(
        order.id,
        updateData
      );

      onUpdate(updatedOrder);
      onClose();
    } catch (err) {
      setError("Erro ao atualizar pedido: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h3 id="modal-title">Editar Pedido #{order.id}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">
            &times;
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            Editar Informações
          </button>
          <button
            className={`tab-btn ${activeTab === "status" ? "active" : ""}`}
            onClick={() => setActiveTab("status")}
          >
            Alterar Status
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {activeTab === "general" ? (
            <div className="form-content">
              <div className="form-group">
                <label>Serviço</label>
                <input
                  type="text"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Preço (R$)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Prazo</label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="form-content">
              <div className="form-group">
                <label>Status Atual</label>
                <div className="current-status">
                  <span className={`status-badge ${order.status}`}>
                    {order.status === "pending" && "Pendente"}
                    {order.status === "in_progress" && "Em Andamento"}
                    {order.status === "completed" && "Completo"}
                    {order.status === "cancelled" && "Cancelado"}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Novo Status</label>
                <select
                  value={statusOnly}
                  onChange={handleStatusChange}
                  className="form-select"
                >
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Completo</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>
          )}

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default OrderEditModal;
