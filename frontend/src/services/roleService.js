import axios from 'axios';

const API_URL = 'http://localhost:5000/api/roles';

// Get all roles with permissions
export const getAllRoles = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Update permissions for a role
export const updateRolePermissions = async (roleId, permissionIds) => {
    const response = await axios.put(`${API_URL}/${roleId}/permissions`, { permissionIds });
    return response.data;
};

// Search users to assign roles
export const searchUsers = async (query) => {
    const response = await axios.get(`${API_URL}/users/search`, { params: { query } });
    return response.data;
};

// Update user role
export const updateUserRole = async (userId, roleId) => {
    const response = await axios.put(`${API_URL}/users/${userId}/role`, { roleId });
    return response.data;
};

// Create a new role
export const createRole = async (name, description) => {
    const response = await axios.post(`${API_URL}`, { name, description });
    return response.data;
};

// Delete a role
export const deleteRole = async (roleId) => {
    const response = await axios.delete(`${API_URL}/${roleId}`);
    return response.data;
};

const roleService = {
    getAllRoles,
    updateRolePermissions,
    searchUsers,
    updateUserRole,
    createRole,
    deleteRole
};

export default roleService;
