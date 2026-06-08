import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

if (!baseUrl) {
  throw new Error('VITE_API_URL is required. Define it before starting the frontend.');
}

export const AUTH_TOKEN_KEY = 'lm:accessToken';

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string') {
      return message;
    }

    if (error.response?.status === 401) {
      return 'Tu sesión expiró. Inicia sesión de nuevo.';
    }

    return error.message;
  }

  return 'Ocurrió un error inesperado';
}

export const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const hadToken = Boolean(localStorage.getItem(AUTH_TOKEN_KEY));

      if (hadToken) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        window.location.assign('/');
      }
    }

    return Promise.reject(error);
  },
);
