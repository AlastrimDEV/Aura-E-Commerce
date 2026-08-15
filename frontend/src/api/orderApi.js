import axios from 'axios';

const API_URL = "http://localhost:5000/api/orders";

const getAuthHeaders = () => {
  const storedUser = localStorage.getItem("userInfo");
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    return { headers: { Authorization: `Bearer ${token}` } };
  }
  return {};
};

export const createOrder = async (orderData) => {
  const response = await axios.post(API_URL, orderData, getAuthHeaders());
  return response.data;
};

export const getMyOrders = async () => {
  const response = await axios.get(`${API_URL}/myorders`, getAuthHeaders());
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};
