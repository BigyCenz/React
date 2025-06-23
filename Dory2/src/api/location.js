import apiClient from './auth';

export const getLocations = async () => {
  const res = await apiClient.get('/location');
  return res.data;
};

export const creaLocation = async (data) => {
  const res = await apiClient.post('/location', data);
  return res.data;
};

export const aggiornaLocation = async (id, data) => {
  const res = await apiClient.put(`/location/${id}`, data);
  return res.data;
};

export const eliminaLocation = async (id) => {
  const res = await apiClient.delete(`/location/${id}`);
  return res.data;
};
