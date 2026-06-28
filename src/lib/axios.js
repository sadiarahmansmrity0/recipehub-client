import axios from 'axios';

// Determine the API URL based on environment
const API_URL = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL  // Production URL from env
    : 'http://localhost:5000/api';      // Development URL

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor for debugging
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status !== 401) {
            console.error('API Error:', error.response?.status, error.response?.data);
        }
        return Promise.reject(error);
    }
);

export default api;