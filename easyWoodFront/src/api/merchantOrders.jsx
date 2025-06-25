import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Adiciona token de autenticação automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMerchantOrders = async () => {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao buscar pedidos: " + error.message);
  }
};

export const createMerchantOrder = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao criar pedido: " + error.message);
  }
};

export const updateMerchantOrder = async (orderId, updateData) => {
  try {
    const response = await api.patch(`/orders/${orderId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao atualizar pedido: " + error.message);
  }
};

export const deleteMerchantOrder = async (orderId) => {
  try {
    await api.delete(`/orders/${orderId}`);
    return true;
  } catch (error) {
    throw new Error("Erro ao excluir pedido: " + error.message);
  }
};

export const getOrderAttachments = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}/attachments`);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao buscar anexos: " + error.message);
  }
};

export const uploadAttachment = async (orderId, file) => {
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
};

export const downloadAttachment = async (orderId, attachmentId) => {
  try {
    const response = await api.get(
      `/orders/${orderId}/attachments/${attachmentId}/download`,
      { responseType: "blob" }
    );
    return response;
  } catch (error) {
    throw new Error("Erro ao baixar anexo: " + error.message);
  }
};

export const deleteAttachment = async (orderId, attachmentId) => {
  try {
    await api.delete(`/orders/${orderId}/attachments/${attachmentId}`);
    return true;
  } catch (error) {
    throw new Error("Erro ao excluir anexo: " + error.message);
  }
};
