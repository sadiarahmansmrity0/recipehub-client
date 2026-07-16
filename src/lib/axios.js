import axios from 'axios';

// ✅ FIX: Use the correct URL
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

console.log('🔗 API URL:', API_URL);

export default api;