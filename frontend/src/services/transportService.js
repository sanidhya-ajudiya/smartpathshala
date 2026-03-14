import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transport';

// Get auth token helper
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

// Routes
const getAllRoutes = async () => {
    const response = await axios.get(`${API_URL}/routes`, getAuthHeader());
    return response.data;
};

const createRoute = async (data) => {
    const response = await axios.post(`${API_URL}/routes`, data, getAuthHeader());
    return response.data;
};

const updateRoute = async (id, data) => {
    const response = await axios.put(`${API_URL}/routes/${id}`, data, getAuthHeader());
    return response.data;
};

const deleteRoute = async (id) => {
    const response = await axios.delete(`${API_URL}/routes/${id}`, getAuthHeader());
    return response.data;
};

// Vehicles
const getAllVehicles = async () => {
    const response = await axios.get(`${API_URL}/vehicles`, getAuthHeader());
    return response.data;
};

const createVehicle = async (data) => {
    const response = await axios.post(`${API_URL}/vehicles`, data, getAuthHeader());
    return response.data;
};

const updateVehicle = async (id, data) => {
    const response = await axios.put(`${API_URL}/vehicles/${id}`, data, getAuthHeader());
    return response.data;
};

const deleteVehicle = async (id) => {
    const response = await axios.delete(`${API_URL}/vehicles/${id}`, getAuthHeader());
    return response.data;
};

const transportService = {
    getAllRoutes,
    createRoute,
    updateRoute,
    deleteRoute,
    getAllVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle
};

export default transportService;
