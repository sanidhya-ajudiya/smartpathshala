import axios from 'axios';

const API_URL = 'http://localhost:5000/api/exams';

// Get auth token helper
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const getAllExams = async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
};

const getExamById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
};

const createExam = async (examData) => {
    const response = await axios.post(API_URL, examData, getAuthHeader());
    return response.data;
};

const updateExam = async (id, examData) => {
    const response = await axios.put(`${API_URL}/${id}`, examData, getAuthHeader());
    return response.data;
};

const deleteExam = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
};

const examService = {
    getAllExams,
    getExamById,
    createExam,
    updateExam,
    deleteExam
};

export default examService;
