import React, { useEffect, useState } from "react";
import MerchantOrderService from "../../../services/MerchantOrderService";
import UserInfo from "../../../services/UserService";

const MerchantCreateOrder = () => {
  const [formData, setFormData] = useState({
    client_id: "",
    service: "",
    description: "",
    price: "",
    due_date: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clients, setClients] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const order = await MerchantOrderService.createOrder({
        ...formData,
        price: parseFloat(formData.price),
      });

      if (file) {
        await MerchantOrderService.uploadAttachment(order.id, file);
      }

      alert("Pedido registrado com sucesso!");
      setFormData({
        client_id: "",
        service: "",
        description: "",
        price: "",
        due_date: "",
      });
      setFile(null);
    } catch (err) {
      setError("Erro ao criar pedido: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const usersClass = new UserInfo();
    const response = await usersClass.getUsers();
    setClients(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="create-order">
      <h2>Criar Novo Pedido</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label className="form-label">Cliente</label>
          <select
            name="client_id"
            className="form-select"
            value={formData.client_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Serviço</label>
          <input
            type="text"
            name="service"
            className="form-input"
            value={formData.service}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descrição</label>
          <textarea
            name="description"
            className="form-textarea"
            value={formData.description}
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
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Prazo de Entrega</label>
            <input
              type="date"
              name="due_date"
              className="form-input"
              value={formData.due_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Anexo (jpg, png, pdf)</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="form-input"
            onChange={handleFileChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Criando..." : "Criar Pedido"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MerchantCreateOrder;
