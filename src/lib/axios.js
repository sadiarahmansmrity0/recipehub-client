import axios from 'axios';

// ✅ Get the correct API URL
const getApiUrl = () => {
    // Production - use environment variable
    if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_API_URL || 'https://your-render-app.onrender.com/api';
    }
    // Development
    return 'http://localhost:5000/api';
};

const api = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout
});

// ✅ Request interceptor - log all requests
api.interceptors.request.use(
    (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// ✅ Response interceptor - log all responses
api.interceptors.response.use(
    (response) => {
        console.log(`✅ ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(`❌ ${error.response.status} ${error.config?.url}`, error.response.data);
        } else if (error.request) {
            console.error('❌ No response received:', error.request);
        } else {
            console.error('❌ Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;