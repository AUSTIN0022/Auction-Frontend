// src/services/notification.js
import API from './api';

export const registerToken = (credentials) => API.post('/register-token', credentials);

