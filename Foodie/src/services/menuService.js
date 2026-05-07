import apiClient from './api';

export const getMenuItems = async (params) => {
  const response = await apiClient.get('/menu', { params });
  return response.data;
};

export const getMenuItem = async (id) => {
  const response = await apiClient.get(`/menu/${id}`);
  return response.data;
};
export const getCategories = async () => {
  const response = await apiClient.get('/menu/categories');
  return response.data;
};
