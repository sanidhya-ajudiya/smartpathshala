import axios from 'axios';

const API_URL = 'http://localhost:5000/api/fees';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const getAllPayments = async () => {
    const response = await axios.get(`${API_URL}/payments`, getAuthHeader());
    return response.data;
};

const getPaymentById = async (id) => {
    const response = await axios.get(`${API_URL}/payments/${id}`, getAuthHeader());
    return response.data;
};

const createPayment = async (data) => {
    const response = await axios.post(`${API_URL}/payments`, data, getAuthHeader());
    return response.data;
};

const updatePayment = async (id, data) => {
    const response = await axios.put(`${API_URL}/payments/${id}`, data, getAuthHeader());
    return response.data;
};

const deletePayment = async (id) => {
    const response = await axios.delete(`${API_URL}/payments/${id}`, getAuthHeader());
    return response.data;
};

const getFeeStructures = async () => {
    const response = await axios.get(`${API_URL}/structures`, getAuthHeader());
    return response.data;
};

const feeService = {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
    getFeeStructures
};

export default feeService;
