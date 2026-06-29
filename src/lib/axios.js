import axios from 'axios';

// ✅ Get API URL with fallback
const getApiUrl = () => {
    // Production
    if (process.env.NODE_ENV === 'production') {
        // Use environment variable or fallback
        return process.env.NEXT_PUBLIC_API_URL || 'https://your-render-app-name.onrender.com/api';
    }
    // Development
    return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

console.log('🌍 Environment:', process.env.NODE_ENV);
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