// src/services/bids.js
import API from './api';

export const placeBid = (auctionId, bidData) =>
  API.post(`/bids/auction/${auctionId}`, bidData);
export const getAuctionBids = (auctionId) =>
  API.post(`/bids/auction/${auctionId}`);
