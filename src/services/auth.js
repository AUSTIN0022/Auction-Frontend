// src/services/auth.js
import API from './api';

export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (formData) =>
  API.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const logout = () => API.get('/auth/logout');
