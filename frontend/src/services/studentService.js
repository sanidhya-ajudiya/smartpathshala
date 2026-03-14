import axios from 'axios';

const API_URL = 'http://localhost:5000/api/students';

// Get auth token helper
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const getAllStudents = async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
};

const getStudentById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
};

const createStudent = async (studentData) => {
    const response = await axios.post(API_URL, studentData, getAuthHeader());
    return response.data;
};

const updateStudent = async (id, studentData) => {
    const response = await axios.put(`${API_URL}/${id}`, studentData, getAuthHeader());
    return response.data;
};

const deleteStudent = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
};

const studentService = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};

export default studentService;
