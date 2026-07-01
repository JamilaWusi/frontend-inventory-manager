import axios from 'axios';

const baseURL = 'https://shop-inventory-manager-1.onrender.com'

const client = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('myToken');

        // ensure headers object exists
        config.headers = config.headers || {};

        if (token) {
            // avoid double-prefixing Bearer
            config.headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


client.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            // clear stored token and navigate to login
            try {
                sessionStorage.removeItem('myToken');
            } catch (e) {
                // ignore
            }

            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            } else {
                console.error('Unauthorized — cannot redirect (no window).');
            }
        }
        return Promise.reject(error);
    }
);

export default client;