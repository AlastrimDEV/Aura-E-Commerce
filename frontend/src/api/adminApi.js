import axios from 'axios';

const API_BASE = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const storedUser = localStorage.getItem("userInfo");
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    return { headers: { Authorization: `Bearer ${token}` } };
  }
  return {};
};

export const getAdminStats = async () => {
  const response = await axios.get(`${API_BASE}/analytics`, getAuthHeaders());
  return response.data;
};

export const getAllOrders = async () => {
  const response = await axios.get(`${API_BASE}/orders`, getAuthHeaders());
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await axios.put(`${API_BASE}/orders/${id}/status`, { status }, getAuthHeaders());
  return response.data;
};

export const createProductAdmin = async (productData) => {
  const response = await axios.post(`${API_BASE}/products`, productData, getAuthHeaders());
  return response.data;
};

export const updateProductAdmin = async (id, productData) => {
  const response = await axios.put(`${API_BASE}/products/${id}`, productData, getAuthHeaders());
  return response.data;
};

export const deleteProductAdmin = async (id) => {
  const response = await axios.delete(`${API_BASE}/products/${id}`, getAuthHeaders());
  return response.data;
};
