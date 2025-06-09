// src/services/adminAuctions.js
import API from './api';

export const getAllAuctions = () => API.get('/admin/auction');
export const getAuctionById = (id) => API.get(`/admin/auction/${id}`);
export const createAuction = (formData) =>
  API.post('/admin/auction/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateAuction = (id, formData) =>
  API.put(`/admin/auction/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteAuction = (id) => API.delete(`/admin/auction/${id}`);
export const getAuctionCategories = () => API.get('/admin/auction/categories');
