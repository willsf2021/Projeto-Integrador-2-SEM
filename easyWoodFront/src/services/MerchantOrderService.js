// services/MerchantOrderService.js
import api from "./api";

class MerchantOrderService {
  async getOrders() {
    try {
      const response = await api.get("/orders");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar pedidos: " + error.message);
    }
  }

  async createOrder(orderData) {
    try {
      const response = await api.post("/orders", orderData);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao criar pedido: " + error.message);
    }
  }

  async updateOrder(orderId, updateData) {
    try {
      const response = await api.patch(`/orders/${orderId}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar pedido: " + error.message);
    }
  }

  async deleteOrder(orderId) {
    try {
      await api.delete(`/orders/${orderId}`);
      return true;
    } catch (error) {
      throw new Error("Erro ao excluir pedido: " + error.message);
    }
  }

  async getAttachments(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/attachments`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar anexos: " + error.message);
    }
  }

  async uploadAttachment(orderId, file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        `/orders/${orderId}/attachments`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data;
    } catch (error) {
      throw new Error("Erro ao enviar anexo: " + error.message);
    }
  }

  async downloadAttachment(orderId, attachmentId) {
    try {
      const response = await api.get(
        `/orders/${orderId}/attachments/${attachmentId}/download`,
        { responseType: "blob" }
      );
      return response;
    } catch (error) {
      throw new Error("Erro ao baixar anexo: " + error.message);
    }
  }

  async deleteAttachment(orderId, attachmentId) {
    try {
      await api.delete(`/orders/${orderId}/attachments/${attachmentId}`);
      return true;
    } catch (error) {
      throw new Error("Erro ao excluir anexo: " + error.message);
    }
  }
}

export default new MerchantOrderService();
