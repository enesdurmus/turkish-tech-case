import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {'Content-Type': 'application/json'},
});

let errorHandler = null;

export const setErrorHandler = (handler) => {
    errorHandler = handler;
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        if (errorHandler) errorHandler(message);
        return Promise.reject(error);
    }
);

export default api;
