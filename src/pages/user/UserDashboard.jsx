import {
    AlertCircle,
    CheckCircle,
    Clock,
    CreditCard,
    Gavel,
    Heart,
    RefreshCw,
    TrendingUp,
    Trophy,
    Wallet,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import UserLayout from '../../layouts/user/UserLayout';
import { getUserDashboardData } from '../../services/userDashboard';

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      setRefreshing(true);
      const data = await getUserDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your auctions, bids, and account activity</p>
          </div>
          <button 
            onClick={fetchDashboard}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Active Bids" 
            value={dashboardData.stats.activeBids} 
            icon={Gavel}
            color="blue"
            trend="+2 this week"
          />
          <StatsCard 
            title="Won Auctions" 
            value={dashboardData.stats.wonAuctions} 
            icon={Trophy}
            color="yellow"
            trend="+1 this month"
          />
          <StatsCard 
            title="Account Balance" 
            value={`₹${dashboardData.stats.balance.toLocaleString()}`} 
            icon={Wallet}
            color="green"
            trend="Available"
          />
          <StatsCard 
            title="Watchlist Items" 
            value={dashboardData.stats.watchlist} 
            icon={Heart}
            color="purple"
            trend="Following"
          />
        </div>



        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-lg">
          <Tabs>
            <Tab label="My Bids" icon={Gavel}>
              <BidsTable data={dashboardData.bids} />
            </Tab>
            <Tab label="Won Auctions" icon={Trophy}>
              <WonAuctionsTable data={dashboardData.won} />
            </Tab>
            <Tab label="Payments" icon={CreditCard}>
              <div className="space-y-6">
                <AccountSummaryCard summary={dashboardData.accountSummary} />
                <PaymentHistoryTable data={dashboardData.payments} />
              </div>
            </Tab>
          </Tabs>
        </div>

        
      </div>
    </UserLayout>
  );
};

// Enhanced Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color = 'blue', trend }) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    yellow: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    green: 'border-green-200 bg-green-50 text-green-700',
    purple: 'border-purple-200 bg-purple-50 text-purple-700'
  };

  return (
    <div className={`rounded-lg shadow-lg  p-6 hover:shadow-md border-${colorClasses[color]} border-b-5`}>

      <div className="flex items-center justify-between ">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-gray-500 mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};


// Enhanced Tabs Component
const Tabs = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {children.map((tab, index) => {
            const Icon = tab.props.icon;
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeIndex === index 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{tab.props.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="p-6">
        {children[activeIndex]}
      </div>
    </div>
  );
};

const Tab = ({ children }) => <div>{children}</div>;

// Enhanced Tables
const BidsTable = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 font-semibold text-gray-900">Auction</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900">Your Bid</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900">Current Highest</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900">Time Left</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((bid, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="py-4 px-4">
              <div className="font-medium text-gray-900">{bid.title}</div>
              <div className="text-sm text-gray-500">#{bid.id}</div>
            </td>
            <td className="py-4 px-4 font-semibold text-blue-600">₹{bid.yourBid.toLocaleString()}</td>
            <td className="py-4 px-4 font-semibold">₹{bid.highestBid.toLocaleString()}</td>
            <td className="py-4 px-4">
              <StatusBadge status={bid.status} />
            </td>
            <td className="py-4 px-4">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{bid.endsIn}</span>
              </div>
            </td>
            <td className="py-4 px-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Bid Again
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const WonAuctionsTable = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 font-semibold text-gray-900">Item</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900">Final Bid</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900">Won Date</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900">Payment</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((item, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="py-4 px-4">
              <div className="font-medium text-gray-900">{item.title}</div>
              <div className="text-sm text-gray-500">#{item.id}</div>
            </td>
            <td className="py-4 px-4 font-semibold text-green-600">₹{item.finalBid.toLocaleString()}</td>
            <td className="py-4 px-4 text-sm text-gray-600">{item.wonDate}</td>
            <td className="py-4 px-4">
              <StatusBadge status={item.paymentStatus} />
            </td>
            <td className="py-4 px-4">
              <button className="text-blue-600 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PaymentHistoryTable = ({ data }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Transaction ID</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((txn, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="py-4 px-4 font-mono text-sm text-gray-600">{txn.id}</td>
              <td className="py-4 px-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {txn.type}
                </span>
              </td>
              <td className="py-4 px-4 font-semibold">₹{txn.amount.toLocaleString()}</td>
              <td className="py-4 px-4 text-sm text-gray-600">{txn.date}</td>
              <td className="py-4 px-4">
                <StatusBadge status={txn.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Enhanced Account Summary Card
const AccountSummaryCard = ({ summary }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <Wallet className="w-8 h-8 text-green-600" />
        <span className="text-green-600 text-sm font-medium">Available</span>
      </div>
      <h3 className="text-2xl font-bold text-green-900 mb-2">₹{summary.available.toLocaleString()}</h3>
      <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
        Add Funds
      </button>
    </div>

    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <AlertCircle className="w-8 h-8 text-yellow-600" />
        <span className="text-yellow-600 text-sm font-medium">Pending</span>
      </div>
      <h3 className="text-2xl font-bold text-yellow-900 mb-2">₹{summary.pending.toLocaleString()}</h3>
      <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors">
        Pay Now
      </button>
    </div>

    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <TrendingUp className="w-8 h-8 text-gray-600" />
        <span className="text-gray-600 text-sm font-medium">Total Spent</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">₹{summary.total.toLocaleString()}</h3>
      <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
        View Details
      </button>
    </div>
  </div>
);

// Enhanced Auction Card
const AuctionCard = ({ auction }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <StatusBadge status={auction.status} />
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{auction.endsIn}</span>
        </div>
      </div>
      
      <h3 className="font-bold text-lg text-gray-900 mb-2">{auction.title}</h3>
      <p className="text-sm text-gray-500 mb-4">#{auction.id}</p>
      
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Current Bid</p>
          <p className="font-bold text-xl text-gray-900">₹{auction.currentBid.toLocaleString()}</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Gavel className="w-4 h-4" />
          <span>Bid Now</span>
        </button>
      </div>
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      'Active': { icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-200' },
      'Winning': { icon: Trophy, color: 'bg-blue-100 text-blue-800 border-blue-200' },
      'Outbid': { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'Lost': { icon: XCircle, color: 'bg-red-100 text-red-800 border-red-200' },
      'Paid': { icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-200' },
      'Pending': { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'Failed': { icon: XCircle, color: 'bg-red-100 text-red-800 border-red-200' },
      'Completed': { icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-200' }
    };
    return configs[status] || { icon: AlertCircle, color: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  const { icon: Icon, color } = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
      <Icon className="w-3 h-3" />
      <span>{status}</span>
    </span>
  );
};

export default UserDashboard;