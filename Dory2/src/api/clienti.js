import apiClient from './auth';

export const getClienti = async () => {
  const res = await apiClient.get('/clienti');
  return res.data;
};

export const creaCliente = async (data) => {
  const res = await apiClient.post('/clienti', data);
  return res.data;
};

export const aggiornaCliente = async (id, data) => {
  const res = await apiClient.put(`/clienti/${id}`, data);
  return res.data;
};

export const eliminaCliente = async (id) => {
  const res = await apiClient.delete(`/clienti/${id}`);
  return res.data;
};
