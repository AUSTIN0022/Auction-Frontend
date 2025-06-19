// src/services/userAuctions.js
import API from './api';

export const browseAuctions = () => API.get('/auctions');
export const getAuctionDetails = (id) => API.get(`/auctions/${id}`);
export const registerForAuction = (id) => API.post(`/auctions/${id}/register`);
export const payEmd = (id, data) => API.post(`/auctions/${id}/emd/pay`, data);
export const getParticipatingAuctions = () => API.get('/auctions/participating');
export const closeAuction = ( data) => API.post('/auctions/close',data);