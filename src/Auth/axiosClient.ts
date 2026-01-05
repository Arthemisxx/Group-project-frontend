import axios from 'axios';


const axiosClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

const publicEndpoints = ['/auth/login', '/auth/register'];

axiosClient.interceptors.request.use(
    (config) => {
        const isPublic = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
        if(!isPublic) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use((response) => response, (error) => {
    if(error.response && error.response.status === 401){
        localStorage.removeItem('token');
        window.location.href = '/';
    }
    return Promise.reject(error);
})

export default axiosClient;