import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {'Content-Type': 'application/json'},
});

let errorHandler = null;

export const setErrorHandler = (handler: any) => {
    errorHandler = handler;
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.detail || error.message || 'Something went wrong';
        if (errorHandler) errorHandler(message);
        return Promise.reject(error);
    }
);

export default api;
