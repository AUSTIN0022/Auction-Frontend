import { CheckCircle, Clock, Eye, Gavel, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/admin/AdminLayout';
import { getUserFromToken } from '../../utils/jwtUtils';

const mockStats = {
  activeAuctions: 18,
  pendingVerifications: 7,
  totalUsers: 245,
  todayRevenue: 42500,
};

const mockAuctions = [
  {
    id: 'A1022',
    item: '2019 Honda City',
    basePrice: '₹5,00,000',
    currentBid: '₹5,75,000',
    status: 'ACTIVE',
    bids: 12,
    timeLeft: '2h 30m',
  },
  {
    id: 'A1023',
    item: '3BHK Apartment, Andheri',
    basePrice: '₹1,20,00,000',
    currentBid: '₹1,22,50,000',
    status: 'ACTIVE',
    bids: 8,
    timeLeft: '5h 15m',
  },
  {
    id: 'A1024',
    item: 'Royal Enfield Classic 350',
    basePrice: '₹1,25,000',
    currentBid: '-',
    status: 'UPCOMING',
    bids: 0,
    timeLeft: '1 day',
  },
  {
    id: 'A1020',
    item: 'Commercial Land, Pune',
    basePrice: '₹95,00,000',
    currentBid: '₹1,05,00,000',
    status: 'ENDED',
    bids: 24,
    timeLeft: 'Ended',
  },
];

const statusConfig = {
  ACTIVE: { 
    bg: 'bg-green-50', 
    text: 'text-green-700', 
    border: 'border-green-200',
    icon: <TrendingUp className="w-3 h-3" />
  },
  UPCOMING: { 
    bg: 'bg-blue-50', 
    text: 'text-blue-700', 
    border: 'border-blue-200',
    icon: <Clock className="w-3 h-3" />
  },
  ENDED: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-600', 
    border: 'border-gray-200',
    icon: <CheckCircle className="w-3 h-3" />
  },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user] = useState(getUserFromToken());

  const statCards = [
    {
      title: 'Active Auctions',
      value: mockStats.activeAuctions,
      color: 'blue',
      icon: <TrendingUp className="w-6 h-6" />,
      bgGradient: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Pending Verifications',
      value: mockStats.pendingVerifications,
      color: 'yellow',
      icon: <Clock className="w-6 h-6" />,
      bgGradient: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Total Users',
      value: mockStats.totalUsers,
      color: 'green',
      icon: <Users className="w-6 h-6" />,
      bgGradient: 'from-green-400 to-green-600'
    },
    {
      title: 'Revenue (Today)',
      value: `₹${mockStats.todayRevenue.toLocaleString()}`,
      color: 'purple',
      icon: <TrendingUp className="w-6 h-6" />,
      bgGradient: 'from-purple-400 to-pink-500'
    },
  ];

  return (
    <AdminLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} text-white shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
            <div className={`h-1 bg-gradient-to-r ${stat.bgGradient}`}></div>
          </div>
        ))}
      </div>

      {/* Auction Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Auctions</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Monitor and manage all auction activities</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auction ID
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">
                  Item Details
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Price
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Bid
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bids
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockAuctions.map((auction, index) => (
                <tr 
                  key={auction.id} 
                  className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                      #{auction.id}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">{auction.item}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {auction.timeLeft}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 font-medium">{auction.basePrice}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${
                      auction.currentBid !== '-' ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {auction.currentBid}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {auction.bids} bids
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border
                      ${statusConfig[auction.status].bg}
                      ${statusConfig[auction.status].text}
                      ${statusConfig[auction.status].border}
                    `}>
                      {statusConfig[auction.status].icon}
                      {auction.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <button
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-lg transition-all duration-200"
                      onClick={() => alert(`Viewing auction ${auction.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Auction Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
          onClick={() => navigate('/create-auction')}
        >
          <Gavel className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
          <span className="hidden sm:inline">Create New Auction</span>
          <span className="sm:hidden">Create</span>
        </button>
      </div>
    </AdminLayout>
  );
}