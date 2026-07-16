import axios from 'axios';

// ✅ FORCE USE RENDER URL
const API_URL = 'https://recipehub-server-dr3a.onrender.com/api';

console.log('🔗 FORCE API URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// ✅ Log all requests
api.interceptors.request.use((config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
});

// ✅ Log all responses and errors
api.interceptors.response.use(
    (response) => {
        console.log(`✅ ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('❌ API Error:');
        console.error('  Status:', error.response?.status);
        console.error('  Data:', error.response?.data);
        console.error('  URL:', error.config?.url);
        return Promise.reject(error);
    }
);

export default api;