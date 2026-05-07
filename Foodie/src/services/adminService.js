import apiClient from './api';

export const getDashboard = async () => {
  const response = await apiClient.get('/admin/dashboard');
  return response.data;
};

export const getAdminOrders = async (params) => {
  const response = await apiClient.get('/admin/orders', { params });
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await apiClient.put(`/admin/orders/${id}/status`, { status });
  return response.data;
};

export const getCustomers = async () => {
  const response = await apiClient.get('/admin/customers');
  return response.data;
};

export const getAdminMenu = async () => {
  const response = await apiClient.get('/admin/menu');
  return response.data;
};

export const createMenuItem = async (data) => {
  const response = await apiClient.post('/menu', data);
  return response.data;
};

export const updateMenuItem = async (id, data) => {
  const response = await apiClient.put(`/menu/${id}`, data);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await apiClient.delete(`/menu/${id}`);
  return response.data;
};
