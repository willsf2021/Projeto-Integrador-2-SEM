import React, { useEffect, useState } from "react";
import MaterialService from "../../../../services/MaterialService";
import "./MaterialManager.css";
import { Link } from "react-router-dom";

const MaterialManager = () => {
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    unit: "",
    price: "",
    quantity: "",
    minimum_quantity: "", // Campo adicionado
  });

  const [filters, setFilters] = useState({
    name: "",
    unit: "",
  });
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  const fetchLowStockAlerts = async () => {
    try {
      const data = await MaterialService.getLowStockAlerts();
      setLowStockAlerts(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchLowStockAlerts();
    const interval = setInterval(fetchLowStockAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  });

  const fetchMaterials = async () => {
    try {
      const data = await MaterialService.getFilteredMaterials(filters);
      setMaterials(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateMaterial = async () => {
    try {
      await MaterialService.createMaterial(newMaterial);
      setNewMaterial({
        name: "",
        unit: "",
        price: "",
        quantity: "",
        minimum_quantity: "", // Resetar o campo
      });
      fetchMaterials();
      fetchLowStockAlerts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddStock = async (id) => {
    const qty = prompt("Quantidade a adicionar:");
    if (qty) {
      try {
        await MaterialService.addStock(id, parseInt(qty));
        fetchMaterials();
        fetchLowStockAlerts();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleReduceStock = async (id) => {
    const qty = prompt("Quantidade a remover:");
    if (qty) {
      try {
        await MaterialService.reduceStock(id, parseInt(qty));
        fetchMaterials();
        fetchLowStockAlerts();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir?")) {
      try {
        await MaterialService.deleteMaterial(id);
        fetchMaterials();
        fetchLowStockAlerts();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="material-manager">
      <Link to="/dashboard-prestador" className="nav-link">
        Voltar ao Dashboard
      </Link>
      <h2>Gerenciar Materiais</h2>
      {lowStockAlerts.length > 0 && (
        <div className="low-stock-alerts">
          <h4>⚠ Estoque Baixo</h4>
          <ul>
            {lowStockAlerts.map((alert) => (
              <li key={alert.id}>
                <strong>{alert.material?.name}</strong> — Estoque atual:{" "}
                {alert.material?.quantity}, mínimo:{" "}
                {alert.material?.minimum_quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Filtros */}
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="filter-name">Filtrar por nome</label>
          <input
            id="filter-name"
            className="filter-input"
            type="text"
            placeholder="Nome do material"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter-unit">Unidade</label>
          <input
            id="filter-unit"
            className="filter-input"
            type="text"
            placeholder="Unidade de medida"
            value={filters.unit}
            onChange={(e) => setFilters({ ...filters, unit: e.target.value })}
          />
        </div>

        <button className="filter-button" onClick={fetchMaterials}>
          Aplicar Filtros
        </button>
      </div>

      {/* Formulário para adicionar novo material */}
      <div className="new-material-section">
        <h4>Novo Material</h4>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="material-name">Nome</label>
            <input
              id="material-name"
              className="form-input"
              type="text"
              placeholder="Nome do material"
              value={newMaterial.name}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="material-unit">Unidade</label>
            <input
              id="material-unit"
              className="form-input"
              type="text"
              placeholder="Unidade de medida"
              value={newMaterial.unit}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, unit: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="material-price">Preço (R$)</label>
            <input
              id="material-price"
              className="form-input"
              type="number"
              placeholder="Preço unitário"
              value={newMaterial.price}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, price: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="material-quantity">Quantidade</label>
            <input
              id="material-quantity"
              className="form-input"
              type="number"
              placeholder="Quantidade inicial"
              value={newMaterial.quantity}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, quantity: e.target.value })
              }
            />
          </div>

          {/* Novo campo para quantidade mínima */}
          <div className="form-group">
            <label htmlFor="material-min-quantity">Quantidade Mínima</label>
            <input
              id="material-min-quantity"
              className="form-input"
              type="number"
              placeholder="Estoque mínimo"
              min="0"
              value={newMaterial.minimum_quantity}
              onChange={(e) =>
                setNewMaterial({
                  ...newMaterial,
                  minimum_quantity: e.target.value,
                })
              }
            />
          </div>
        </div>

        <button className="create-button" onClick={handleCreateMaterial}>
          Cadastrar Material
        </button>
      </div>

      {/* Lista de materiais */}
      <div className="materials-container">
        <h4>Materiais</h4>
        {materials.length === 0 ? (
          <div className="empty-message">Nenhum material encontrado</div>
        ) : (
          <table className="materials-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Unidade</th>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Qtd. Mínima</th> {/* Nova coluna */}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((mat) => (
                <tr key={mat.id}>
                  <td>{mat.name}</td>
                  <td>{mat.unit}</td>
                  <td>R$ {parseFloat(mat.price).toFixed(2)}</td>
                  <td
                    className={
                      mat.quantity < mat.minimum_quantity ? "low-stock" : ""
                    }
                  >
                    {mat.quantity}
                  </td>
                  <td>{mat.minimum_quantity}</td> {/* Nova célula */}
                  <td className="actions-cell">
                    <button
                      className="action-button add-button"
                      onClick={() => handleAddStock(mat.id)}
                    >
                      + Estoque
                    </button>
                    <button
                      className="action-button reduce-button"
                      onClick={() => handleReduceStock(mat.id)}
                    >
                      - Estoque
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDelete(mat.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MaterialManager;
