import axios from 'axios';

const API_URL = 'http://localhost:5000/api/staff';

// Get auth token helper
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const getAllStaff = async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
};

const getStaffById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
};

const createStaff = async (staffData) => {
    const response = await axios.post(API_URL, staffData, getAuthHeader());
    return response.data;
};

const updateStaff = async (id, staffData) => {
    const response = await axios.put(`${API_URL}/${id}`, staffData, getAuthHeader());
    return response.data;
};

const deleteStaff = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
};

const staffService = {
    getAllStaff,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff
};

export default staffService;
