// src/services/payments.js
import API from './api';

export const createPayment = (data) => API.post('/payments/create', data);
export const verifyPayment = (data) => API.post('/payments/verify', data);
export const getPaymentStatus = (id) => API.get(`/payments/${id}`);
export const cancelPayment = (id) => API.post(`/payments/${id}/cancel`);
// No auth needed for Razorpay webhook
export const handleWebhook = (data) => API.post('/payments/webhook', data);
