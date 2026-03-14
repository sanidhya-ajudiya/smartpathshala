const axios = require('axios');

const testLogin = async () => {
    const API_URL = 'http://localhost:5000/api';
    const credentials = {
        username: 'superadmin',
        password: 'admin123'
    };

    try {
        console.log('Testing login with credentials:', credentials);
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        
        console.log('Response status:', response.status);
        console.log('Response content:', JSON.stringify(response.data, null, 2));

        if (response.data.success && response.data.data.token) {
            console.log('✅ Login successful! Verified response.data.data structure.');
        } else {
            console.log('❌ Login failed or unexpected structure.');
        }
    } catch (error) {
        console.error('❌ Request failed:', error.response?.data || error.message);
    }
};

testLogin();
