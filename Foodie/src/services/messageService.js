import api from './api';

export const submitMessage = async (messageData) => {
  const res = await api.post('/messages', messageData);
  return res.data;
};

export const getMessages = async () => {
  const res = await api.get('/messages');
  return res.data;
};

export const markMessageAsRead = async (id) => {
  const res = await api.put(`/messages/${id}/read`);
  return res.data;
};

export const deleteMessage = async (id) => {
  const res = await api.delete(`/messages/${id}`);
  return res.data;
};
