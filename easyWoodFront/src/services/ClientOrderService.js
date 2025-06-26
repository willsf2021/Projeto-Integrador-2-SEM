// src/services/ClientOrderService.js
import axios from "./api";

class ClientOrderService {
  static async getActiveOrders() {
    const token = localStorage.getItem("token");
    const response = await axios.get("/client/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  static async getOrderById(orderId) {
    const token = localStorage.getItem("token");
    const response = await axios.get(`/client/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  static async downloadAttachment(orderId, attachmentId) {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `/client/orders/${orderId}/attachments/${attachmentId}/download`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  }

  static async getOrderHistory() {
    const token = localStorage.getItem("token");
    const response = await axios.get("/client/orders/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}

export default ClientOrderService;
