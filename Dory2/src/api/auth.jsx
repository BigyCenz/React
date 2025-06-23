import axios from 'axios';
import { logout } from '../context/logoutHandler';

const API_URL = 'http://localhost:5000/api';

export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    username,
    password,
  });
  return response.data; // contiene access_token + refresh_token
};

const apiClient = axios.create({ baseURL: API_URL });

// Inserisce il token access in ogni richiesta
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor 401 → prova refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh_token = localStorage.getItem('refresh_token');
      if (refresh_token) {
        try {
          const res = await axios.post(`${API_URL}/refresh`, {
            refresh_token: refresh_token,
          });
          localStorage.setItem('token', res.data.access_token);
          error.config.headers.Authorization = `Bearer ${res.data.access_token}`;
          return apiClient.request(error.config);
        } catch (refreshError) {
          logout();
        }
      } else {
        logout();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
