import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
    response => response,
    error => {
        // Only log actual errors, not 401 (unauthorized)
        if (error.response?.status !== 401) {
            console.error('API Error:', error.response?.status, error.response?.data);
        }
        return Promise.reject(error);
    }
);

export default api;