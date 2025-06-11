import {
    ArrowUpDown,
    Calendar,
    Clock,
    Eye,
    Filter,
    Grid3X3,
    Heart,
    List,
    Search,
    Share2,
    Tag
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../../layouts/user/UserLayout';
import { browseAuctions } from '../../services/userAuctions';
import { formatDate } from '../../utils/dateUtils';

const BrowseAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await browseAuctions();
        setAuctions(res.data.auctions);
        setLoading(false);
      } catch (err) {
        console.log(`ERROR: ${err.messages}`);
        setError('Failed to fetch auctions');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = auctions
    .filter((a) => {
      if (status !== 'All' && a.status.toLowerCase() !== status.toLowerCase()) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.basePrice - b.basePrice;
        case 'price-desc':
          return b.basePrice - a.basePrice;
        case 'end-date':
          return new Date(a.endDate) - new Date(b.endDate);
        default:
          return new Date(b.startDate) - new Date(a.startDate);
      }
    });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 border-green-200', icon: Clock },
      pending: { color: 'bg-yellow-100 text-blue-800 border-blue-200', icon: Calendar },
      completed: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Eye }
    };
    
    const config = statusConfig[status.toLowerCase()] || statusConfig.active;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const toggleFavorite = (auctionId, e) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (favorites.has(auctionId)) {
      newFavorites.delete(auctionId);
    } else {
      newFavorites.add(auctionId);
    }
    setFavorites(newFavorites);
  };

  const handleShare = (auction, e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: auction.title,
        text: `Check out this auction: ${auction.title}`,
        url: window.location.origin + `/auctions/${auction._id}`
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.origin + `/auctions/${auction._id}`);
      // You could show a toast notification here
    }
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filtered.map((auction) => (
        <div
          key={auction._id}
          className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer transform hover:-translate-y-1"
          onClick={() => navigate(`/auctions/${auction._id}`)}
        >
          <div className="relative">
            <img
              src={auction.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={auction.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              {getStatusBadge(auction.status)}
            </div>
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={(e) => toggleFavorite(auction._id, e)}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  favorites.has(auction._id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorites.has(auction._id) ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={(e) => handleShare(auction, e)}
                className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-blue-500 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {auction.title}
            </h3>
            
            <div className="flex items-center text-gray-500 text-sm mb-3">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Ends: {formatDate(auction.endDate)}</span>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Base Price</p>
                <p className="text-xl font-bold text-gray-900">₹{auction.basePrice.toLocaleString()}</p>
              </div>
              {auction.currentBid && (
                <div className="text-right">
                  <p className="text-sm text-green-600">Current Bid</p>
                  <p className="text-lg font-semibold text-green-700">₹{auction.currentBid.toLocaleString()}</p>
                </div>
              )}
            </div>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filtered.map((auction) => (
        <div
          key={auction._id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 p-4 cursor-pointer hover:border-blue-200"
          onClick={() => navigate(`/auctions/${auction._id}`)}
        >
          <div className="flex gap-4">
            <img
              src={auction.images?.[0] || 'https://via.placeholder.com/150x100?text=No+Image'}
              alt={auction.title}
              className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-900 truncate pr-4">
                  {auction.title}
                </h3>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => toggleFavorite(auction._id, e)}
                    className={`p-1.5 rounded-full transition-colors ${
                      favorites.has(auction._id)
                        ? 'text-red-500'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.has(auction._id) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => handleShare(auction, e)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-2">
                {getStatusBadge(auction.status)}
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Ends: {formatDate(auction.endDate)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Base Price</p>
                    <p className="text-lg font-bold text-gray-900">₹{auction.basePrice.toLocaleString()}</p>
                  </div>
                  {auction.currentBid && (
                    <div>
                      <p className="text-sm text-green-600">Current Bid</p>
                      <p className="text-lg font-semibold text-green-700">₹{auction.currentBid.toLocaleString()}</p>
                    </div>
                  )}
                </div>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <UserLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Auctions</h1>
          <p className="text-gray-600">Discover amazing items and place your bids</p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search auctions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="newest">Sort By: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="end-date">End Date</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filtered.length} auction{filtered.length !== 1 ? 's' : ''} found
            {search && ` for "${search}"`}
            {status !== 'All' && ` in ${status.toLowerCase()} status`}
          </p>
        </div>

        {/* Auctions Display */}
        {error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 text-red-600 hover:text-red-700 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-2">No auctions found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? renderGridView() : renderListView()}
          </>
        )}
      </div>
    </UserLayout>
  );
};

export default BrowseAuctions;