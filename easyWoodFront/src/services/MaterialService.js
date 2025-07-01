// services/MaterialService.js
import api from "./api";

class MaterialService {
  // Listar todos os materiais
  async getMaterials() {
    try {
      const response = await api.get("/materials");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar materiais: " + error.message);
    }
  }

  // Criar um novo material
  async createMaterial(materialData) {
    try {
      const response = await api.post("/materials", materialData);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao criar material: " + error.message);
    }
  }
  async getLowStockAlerts() {
    try {
      const response = await api.get("/low-stock-alerts");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar alertas de estoque: " + error.message);
    }
  }

  // Buscar um material específico
  async getMaterialById(materialId) {
    try {
      const response = await api.get(`/materials/${materialId}`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar material: " + error.message);
    }
  }

  // Atualizar um material
  async updateMaterial(materialId, updateData) {
    try {
      const response = await api.patch(`/materials/${materialId}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar material: " + error.message);
    }
  }

  // Excluir um material
  async deleteMaterial(materialId) {
    try {
      await api.delete(`/materials/${materialId}`);
      return true;
    } catch (error) {
      throw new Error("Erro ao excluir material: " + error.message);
    }
  }

  // Adicionar estoque
  async addStock(materialId, quantity) {
    try {
      const response = await api.post(`/materials/${materialId}/add-stock`, {
        quantity: quantity,
      });
      return response.data;
    } catch (error) {
      throw new Error("Erro ao adicionar estoque: " + error.message);
    }
  }

  // Reduzir estoque
  async reduceStock(materialId, quantity) {
    try {
      const response = await api.post(`/materials/${materialId}/reduce-stock`, {
        quantity: quantity,
      });
      return response.data;
    } catch (error) {
      throw new Error("Erro ao reduzir estoque: " + error.message);
    }
  }

  // Buscar materiais com filtros (opcional)
  async getFilteredMaterials(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Adiciona filtros válidos
      if (filters.name) params.append("name", filters.name);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.minQuantity)
        params.append("minQuantity", filters.minQuantity);
      if (filters.unit) params.append("unit", filters.unit);

      const response = await api.get(`/materials?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar materiais com filtros: " + error.message);
    }
  }
}

export default new MaterialService();
