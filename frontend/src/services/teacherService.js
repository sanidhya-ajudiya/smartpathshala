import axios from 'axios';

const API_URL = 'http://localhost:5000/api/teachers';

// Get auth token helper
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const getAllTeachers = async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
};

const getTeacherById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
};

const createTeacher = async (teacherData) => {
    const response = await axios.post(API_URL, teacherData, getAuthHeader());
    return response.data;
};

const updateTeacher = async (id, teacherData) => {
    const response = await axios.put(`${API_URL}/${id}`, teacherData, getAuthHeader());
    return response.data;
};

const deleteTeacher = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
};

const teacherService = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
};

export default teacherService;
