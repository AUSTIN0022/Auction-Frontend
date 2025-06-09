// src/services/userDashboard.js
import API from './api';

export const getUserDashboardData = async () => {
  try {
    const response = await API.get('/dashboard');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    // Return mock data for development/testing
    if (import.meta.env.DEV) {
      console.warn('Using mock data for dashboard');
      return getMockDashboardData();
    }
    
    throw error;
  }
};

const getMockDashboardData = () => ({
  stats: {
    activeBids: 5,
    wonAuctions: 3,
    balance: 15000,
    watchlist: 12
  },
  bids: [
    {
      title: 'Vintage Watch Collection',
      yourBid: 12000,
      highestBid: 15000,
      status: 'Outbid',
      endsIn: '2 days',
      auctionId: '507f1f77bcf86cd799439011'
    },
    {
      title: 'Antique Furniture Set',
      yourBid: 8000,
      highestBid: 8000,
      status: 'Winning',
      endsIn: '5 hours',
      auctionId: '507f1f77bcf86cd799439012'
    },
    {
      title: 'Rare Book Collection',
      yourBid: 3500,
      highestBid: 4000,
      status: 'Outbid',
      endsIn: '1 day',
      auctionId: '507f1f77bcf86cd799439013'
    }
  ],
  won: [
    {
      title: 'Classic Car Model',
      finalBid: 25000,
      wonDate: '2024-01-15',
      paymentStatus: 'completed'
    },
    {
      title: 'Art Painting',
      finalBid: 8500,
      wonDate: '2024-01-10',
      paymentStatus: 'pending'
    },
    {
      title: 'Jewelry Set',
      finalBid: 6000,
      wonDate: '2024-01-05',
      paymentStatus: 'completed'
    }
  ],
  payments: [
    {
      id: 'TXN12345',
      type: 'final',
      amount: 25000,
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 'TXN12346',
      type: 'emd',
      amount: 2500,
      date: '2024-01-12',
      status: 'completed'
    },
    {
      id: 'TXN12347',
      type: 'deposit',
      amount: 10000,
      date: '2024-01-10',
      status: 'completed'
    },
    {
      id: 'TXN12348',
      type: 'final',
      amount: 8500,
      date: '2024-01-08',
      status: 'pending'
    }
  ],
  accountSummary: {
    available: 15000,
    pending: 8500,
    total: 47500
  },
  recommended: [
    {
      id: '507f1f77bcf86cd799439020',
      title: 'Modern Art Collection',
      currentBid: 5000,
      status: 'Active',
      endsIn: '3 days'
    },
    {
      id: '507f1f77bcf86cd799439021',
      title: 'Vintage Electronics',
      currentBid: 1200,
      status: 'Active',
      endsIn: '1 day'
    },
    {
      id: '507f1f77bcf86cd799439022',
      title: 'Collectible Coins',
      currentBid: 800,
      status: 'Active',
      endsIn: '6 hours'
    }
  ]
});