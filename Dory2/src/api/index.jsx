import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with your actual API URL

// User Authentication
export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};


export const logoutUser = async (credentials) => {
    const response = await axios.post(`${API_URL}/logout`, credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/registrazione`, userData);
    return response.data;
};

// Client Management
export const createClient = async (clientData) => {
    const response = await axios.post(`${API_URL}/crea/cliente`, clientData);
    return response.data;
};

// Location Management
export const createLocation = async (locationData) => {
    const response = await axios.post(`${API_URL}/crea/location`, locationData);
    return response.data;
};

// Panel Management
export const createPanel = async (panelData) => {
    const response = await axios.post(`${API_URL}/crea/pannello`, panelData);
    return response.data;
};

// Category Management
export const createCategory = async (categoryData) => {
    const response = await axios.post(`${API_URL}/crea/categoria`, categoryData);
    return response.data;
};

// Machine Management
export const createMachine = async (machineData) => {
    const response = await axios.post(`${API_URL}/crea/macchina`, machineData);
    return response.data;
};

// Sensor Associations
export const addSensorAssociation = async (associationData) => {
    const response = await axios.post(`${API_URL}/associazioni`, associationData);
    return response.data;
};

export const deleteSensorAssociation = async (panCod, portCod) => {
    const response = await axios.delete(`${API_URL}/associazioni/${panCod}/${portCod}`);
    return response.data;
};

// Free Ports
export const getFreePorts = async (panCod) => {
    const response = await axios.get(`${API_URL}/porte/${panCod}`);
    return response.data;
};

// Machines and Sensors
export const getMachinesByPanel = async (panCod) => {
    const response = await axios.get(`${API_URL}/macchine/${panCod}`);
    return response.data;
};

export const getSensorsForMachine = async (macCod, panCod) => {
    const response = await axios.get(`${API_URL}/sensori/${macCod}/${panCod}`);
    return response.data;
};

// Reports
export const getReports = async () => {
    const response = await axios.get(`${API_URL}/reports`);
    return response.data;
};

// Users
export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/utenti`);
    return response.data;
};