import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with your actual API URL

export const getMachinesForLocation = async (locCod) => {
  try {
    const response = await axios.get(`${API_URL}/macchine`, {
      params: { loc_cod: locCod },
    });
    return response.data;
  } catch (error) {
    console.error('Errore nel recupero delle macchine:', error);
    throw error;
  }
};

export * from './auth';
