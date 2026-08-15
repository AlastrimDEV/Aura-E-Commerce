import axios from 'axios';

const API_URL = `${process.env.BACKEND_URL}/api/payments`;

const getAuthHeaders = () => {
  const storedUser = localStorage.getItem("userInfo");
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    return { headers: { Authorization: `Bearer ${token}` } };
  }
  return {};
};

export const initiateEsewaPayment = async (amount, orderId, redirectUrl) => {
  const response = await axios.post(
    `${API_URL}/esewa/initiate`,
    { amount, orderId, redirectUrl },
    getAuthHeaders()
  );
  return response.data;
};

export const verifyEsewaPayment = async (data, orderId) => {
  const response = await axios.post(
    `${API_URL}/esewa/verify`,
    { data, orderId },
    getAuthHeaders()
  );
  return response.data;
};
