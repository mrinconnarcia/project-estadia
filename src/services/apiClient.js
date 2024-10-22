import axios from 'axios';
import authService from './authService';

const createApiClient = (baseURL) => {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.request.use((config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.log('Token expirado o inválido');
        // authService.logout();
        // window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createApiClient;
