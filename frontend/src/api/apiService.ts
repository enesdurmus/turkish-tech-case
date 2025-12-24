import axios from 'axios';

const apiService = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

let errorHandler: ((message: string) => void) | null = null;

export const setErrorHandler = (handler: (message: string) => void) => {
    errorHandler = handler;
};

apiService.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An error occurred';
        console.error('API Error:', message);

        if (errorHandler) {
            errorHandler(message);
        }

        return Promise.reject(error);
    }
);

export default apiService;
