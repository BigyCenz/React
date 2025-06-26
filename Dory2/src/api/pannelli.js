import apiClient from './auth';

// Recupera i pannelli con filtri cliente/location
export const getPannelli = async (params) => {
  const response = await apiClient.get('/pannelli', { params });
  return response.data;
};

// Crea un nuovo pannello
export const createPannello = async ({ nome, cliente, location }) => {
  const response = await apiClient.post('/pannelli', {
    nome,
    cliente,
    location
  });
  return response.data;
};

// Modifica un pannello esistente
export const updatePannello = async (id, { nome, cliente, location }) => {
  const response = await apiClient.put(`/pannelli/${id}`, {
    nome,
    cliente,
    location
  });
  return response.data;
};

// Elimina un pannello
export const deletePannello = async (id) => {
  const response = await apiClient.delete(`/pannelli/${id}`);
  return response.data;
};

// Recupera le associazioni sensori/macchine/porte per un pannello
export const getAssociazioni = async (panId) => {
  const response = await apiClient.get(`/pannelli/${panId}/associazioni`);
  return response.data;
};

// Salva tutte le associazioni (sovrascrive le esistenti)
export const saveAssociazioni = async (panId, data) => {
  const response = await apiClient.post(`/pannelli/${panId}/associazioni`, data);
  return response.data;
};

// Recupera porte disponibili per un pannello
export const getPorteDisponibili = async (panId) => {
  const response = await apiClient.get(`/pannelli/${panId}/porte_disponibili`);
  return response.data;
};



// Recupera sensori associabili a una macchina
export const getSensoriPerMacchina = async (macId) => {
  const response = await apiClient.get(`/macchine/${macId}/sensori_disponibili`);
  return response.data;
};
