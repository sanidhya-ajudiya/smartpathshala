import axios from 'axios';

const API_URL = 'http://localhost:5000/api/attendance';

// Get auth token helper
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const getAllAttendance = async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
};

const getAttendanceById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
};

const markAttendance = async (data) => {
    const response = await axios.post(API_URL, data, getAuthHeader());
    return response.data;
};

const updateAttendance = async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeader());
    return response.data;
};

const deleteAttendance = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
};

const attendanceService = {
    getAllAttendance,
    getAttendanceById,
    markAttendance,
    updateAttendance,
    deleteAttendance
};

export default attendanceService;
