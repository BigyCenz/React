import apiClient from './auth';

export const getCategorie = async () => {
  const res = await apiClient.get('/categorie');
  return res.data;
};

export const creaCategoria = async (dati) => {
  const res = await apiClient.post('/categorie', dati);
  return res.data;
};

export const eliminaCategoria = async (cod, sns) => {
  const res = await apiClient.delete(`/categorie/${cod}/${sns}`);
  return res.data;
};

export const aggiornaCategoria = async (cod, sns, dati) => {
  const res = await apiClient.put(`/categorie/${cod}/${sns}`, dati);
  return res.data;
};
