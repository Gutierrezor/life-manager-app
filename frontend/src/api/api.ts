import axios from 'axios';

const baseUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: baseUrl,
});
