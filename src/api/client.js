import axios from 'axios';
import router from '../router';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        "Content-Type": "application/json"
    }
})

apiClient.interceptors.request.use(config => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    })
apiClient.interceptors.response.use(response => response,
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("Session expired or unauthorized. Wiping local memory blocks.");
            localStorage.removeItem('auth_token');
            router.push('/login');
        }
        return Promise.reject(error);
    })
export default apiClient;