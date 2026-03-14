import axios from 'axios';

const API_URL = 'http://localhost:5000/api/inventory';

// Get auth token helper
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

// Items
const getAllItems = async () => {
    const response = await axios.get(`${API_URL}/items`, getAuthHeader());
    return response.data;
};

const createItem = async (data) => {
    const response = await axios.post(`${API_URL}/items`, data, getAuthHeader());
    return response.data;
};

const updateItem = async (id, data) => {
    const response = await axios.put(`${API_URL}/items/${id}`, data, getAuthHeader());
    return response.data;
};

const deleteItem = async (id) => {
    const response = await axios.delete(`${API_URL}/items/${id}`, getAuthHeader());
    return response.data;
};

// Transactions
const getTransactions = async () => {
    const response = await axios.get(`${API_URL}/transactions`, getAuthHeader());
    return response.data;
};

const recordTransaction = async (data) => {
    const response = await axios.post(`${API_URL}/transactions`, data, getAuthHeader());
    return response.data;
};

const inventoryService = {
    getAllItems,
    createItem,
    updateItem,
    deleteItem,
    getTransactions,
    recordTransaction
};

export default inventoryService;
