// src/services/adminUsers.js
import API from './api';

export const getAllUsers = () => API.get('/admin/users');
export const getUserById = (id) => API.get(`/admin/users/${id}`);
export const verifyUser = (id) => API.put(`/admin/users/${id}/verify`);
export const rejectUser = (id) => API.put(`/admin/users/${id}/reject`);
export const getUserDocuments = (id) => API.get(`/admin/users/${id}/documents`);
