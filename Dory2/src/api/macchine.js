import apiClient from './auth';

export const getMacchine = async (params) => {
  const response = await apiClient.get('/macchine', { params });
  return response.data;
};

export const createMacchina = async (data) => {
  const response = await apiClient.post('/macchine', data);
  return response.data;
};

export const updateMacchina = async (macCod, data) => {
  const response = await apiClient.put(`/macchine/${macCod}`, data);
  return response.data;
};

export const deleteMacchina = async (macCod) => {
  const response = await apiClient.delete(`/macchine/${macCod}`);
  return response.data;
};

export const getCategorie = async () => {
  const response = await apiClient.get('/categorie');
  return response.data;
};

export const getClienti = async () => {
  const response = await apiClient.get('/clienti');
  return response.data;
};

export const getLocationByCliente = async (clienteId) => {
  const response = await apiClient.get(`/location?cliente=${clienteId}`);
  return response.data;
};
