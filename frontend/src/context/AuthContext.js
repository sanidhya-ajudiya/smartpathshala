import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Configure axios default header
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    // Check if user is already logged in on mount
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/auth/me`);
                setUser(response.data.data.user);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { username, password });
            const { token, user } = response.data.data;
            setToken(token);
            setUser(user);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    const hasPermission = (permissionName) => {
        // Implement permission checking logic here based on user roles/permissions
        // For now, simple role check or if we fetch permissions with user object
        if (!user) return false;
        if (user.role_id === 1) return true; // Super Admin bypass

        // Check if user.permissions includes permissionName (need to ensure backend sends this)
        return user.permissions?.includes(permissionName);
    };

    const value = {
        user,
        token,
        login,
        logout,
        hasPermission,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
