import axios from 'axios';

// ✅ HARDCODE YOUR RENDER URL
const API_URL = 'https://recipehub-server-dr3a.onrender.com/api';

console.log('🔗 API URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default api;