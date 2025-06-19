// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL:  import.meta.env.VITE_API_BASE_URL || 'https://dev.bidbazaar.shop/api',
  withCredentials: true,
});

// Attach JWT from localStorage if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
