import apiClient from './api';

export const placeOrder = async (data) => {
  const response = await apiClient.post('/orders', data);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await apiClient.get('/orders/my-orders');
  return response.data;
};

export const getOrder = async (id) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};
