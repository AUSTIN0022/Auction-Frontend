// src/pages/user/AuctionDetail.jsx
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Edit,
    Eye,
    Gavel,
    Image as ImageIcon,
    Timer,
    TrendingUp,
    Trophy,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserLayout from '../../layouts/user/UserLayout';
import { placeBid } from '../../services/bids';
import { closeAuction, getAuctionDetails } from '../../services/userAuctions';
import { formatDateTime } from '../../utils/dateUtils';
import { getCurrentUserId, getUserRole } from '../../utils/jwtUtils';

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Timer-related state
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [lastBidTime, setLastBidTime] = useState(null);
  const [winner, setWinner] = useState(null);
  const [auctionEnded, setAuctionEnded] = useState(false);

  useEffect(() => {
    // Get user role and ID from JWT
    const role = getUserRole();
    const userId = getCurrentUserId();
    setUserRole(role);
    setCurrentUserId(userId);
    console.log(`userId: ${userId}`);
    console.log(`current userId: ${currentUserId}`);

    const fetchAuction = async () => {
      try {
        const res = await getAuctionDetails(id);
        console.log('Auction bidders:', res.data?.auctionDetails?.bidders);
        
        // Fix: Access auction data from res.data.auctionDetails
        const auctionData = res.data?.auctionDetails;
        setAuction(auctionData);
        setMainImage(auctionData?.images?.[0] || 'https://via.placeholder.com/500x300');
        
        // Initialize timer if there are bids
        if (auctionData?.bidLog && auctionData.bidLog.length > 0 && auctionData.status === 'active') {
          initializeTimer(auctionData);
        }
      } catch (err) {
        console.log(`ERROR: ${err.message || err}`);
        console.error('Full error object:', err);
        setError('Failed to load auction details');
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id]);

  // Initialize timer based on last bid
  const initializeTimer = async (auctionData) => {
    if (!auctionData.bidLog || auctionData.bidLog.length === 0) return;
    
    const lastBid = auctionData.bidLog[auctionData.bidLog.length - 1];
    const lastBidTimestamp = new Date(lastBid.createdAt).getTime();
    const now = Date.now();
    const bidIntervalMs = auctionData.bidInterval * 1000; // Convert seconds to milliseconds
    const elapsed = now - lastBidTimestamp;
    const remaining = Math.max(0, bidIntervalMs - elapsed);
    
    setLastBidTime(lastBidTimestamp);
    
    if (remaining > 0) {
      setTimeRemaining(remaining);
      setIsTimerActive(true);
    } else {
      // Timer has already expired, declare winner
     await declareWinner(lastBid);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    let interval;
    
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = Math.max(0, prev - 1000);

          
          // If timer reaches 0, declare winner
          if (newTime === 0) {
            setIsTimerActive(false);
            if (auction?.bidLog && auction.bidLog.length > 0) {
              const lastBid = auction.bidLog[auction.bidLog.length - 1];
              declareWinner(lastBid);
            }
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeRemaining, auction]);

  // Declare winner function
  const declareWinner = async (winningBid) => {
    const winnerName = getBidderName(winningBid.userId);
    setWinner({
      userId: winningBid.userId,
      name: winnerName,
      bidAmount: winningBid.bidAmount,
      bidTime: winningBid.createdAt
    });
    setAuctionEnded(true);
    setIsTimerActive(false);

     // ✅ Call closeAuction only if the current user is the winner
    if (currentUserId?.toString() === winningBid.userId?.toString()) {
        try {
        await closeAuction({
            auctionId: id,
            userId: currentUserId
        });
        console.log('Auction successfully closed by winning user.');
        } catch (error) {
        console.error('Failed to close auction:', error);
        }
    }

  };

  // Helper function to check if user is registered for auction
  const isUserRegistered = () => {
    if (!auction?.bidders || !currentUserId) return false;
    return auction.bidders.some(bidder => 
      bidder._id?.toString() === currentUserId?.toString()
    );
  };

  // Helper function to check if registration is still open
  const isRegistrationOpen = () => {
    if (!auction?.registrationDeadline) return false;
    const now = new Date();
    const deadline = new Date(auction.registrationDeadline);
    return now < deadline;
  };

  // Helper function to get bidder name by userId
  const getBidderName = (userId) => {
    if (!auction?.bidders || !userId) return 'Anonymous';
    
    const bidder = auction.bidders.find(bidder => 
      bidder._id?.toString() === userId?.toString()
    );
    return bidder?.name || 'Anonymous';
  };

  // Helper function to format bid timestamp
  const formatBidTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format timer display
  const formatTimer = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle bid submission
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setBidError('');
    
    // Check if auction has ended due to timer
    if (auctionEnded || winner) {
      setBidError('Auction has ended. Winner has been declared.');
      return;
    }
    
    const bidValue = parseFloat(bidAmount);
    const currentHighestBid = auction.bidLog && auction.bidLog.length > 0 
      ? auction.bidLog[auction.bidLog.length - 1]?.bidAmount 
      : auction.basePrice;

    // Validation
    if (!bidAmount || bidValue <= 0) {
      setBidError('Please enter a valid bid amount');
      return;
    }

    if (bidValue <= currentHighestBid) {
      setBidError(`Bid must be higher than current bid of ₹${currentHighestBid.toLocaleString()}`);
      return;
    }

    setIsPlacingBid(true);
    
    try {
      // Prepare bid data
      const bidData = {
        bidAmount: bidValue,
        userId: currentUserId
      };

      // Call the API to place bid
      const response = await placeBid(id, bidData);
      
      if (response.data && response.data.success) {
        // Reset form
        setBidAmount('');
        
        // Create optimistic update first for immediate UI feedback
        const newBid = {
          _id: Date.now().toString(), // Temporary ID
          bidAmount: bidValue,
          userId: currentUserId,
          createdAt: new Date().toISOString(),
          ...response.data.bid // Override with actual bid data if available
        };

        // Update auction state immediately for responsive UI
        setAuction(prevAuction => ({
          ...prevAuction,
          bidLog: [...(prevAuction.bidLog || []), newBid]
        }));
        
        // Restart timer with full bid interval
        const bidIntervalMs = auction.bidInterval * 1000;
        setTimeRemaining(bidIntervalMs);
        setIsTimerActive(true);
        setLastBidTime(Date.now());
        setWinner(null);
        setAuctionEnded(false);
        
        // Show success message
        alert('Bid placed successfully! Timer restarted.');
        
        // Force refresh auction data to ensure accuracy
        await refreshAuctionData();
        
      } else {
        setBidError(response.data?.message || 'Failed to place bid. Please try again.');
      }
      
    } catch (error) {
      console.error('Error placing bid:', error);
      
      // Handle different types of errors
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            'Failed to place bid. Please try again.';
        setBidError(errorMessage);
      } else if (error.request) {
        setBidError('Network error. Please check your connection and try again.');
      } else {
        setBidError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsPlacingBid(false);
    }
  };

  // Separate function to refresh auction data
  const refreshAuctionData = async () => {
    try {
      const res = await getAuctionDetails(id);
      const auctionData = res.data?.auctionDetails;
      
      if (auctionData) {
        setAuction(auctionData);
        // Update main image if needed
        if (auctionData.images && auctionData.images.length > 0) {
          setMainImage(auctionData.images[0]);
        }
        
        // Update timer if there are new bids
        if (auctionData.bidLog && auctionData.bidLog.length > 0 && auctionData.status === 'active' && !auctionEnded) {
          const lastBid = auctionData.bidLog[auctionData.bidLog.length - 1];
          const lastBidTimestamp = new Date(lastBid.createdAt).getTime();
          
          // Only update timer if this is a newer bid
          if (!lastBidTime || lastBidTimestamp > lastBidTime) {
            initializeTimer(auctionData);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to refresh auction data:', error);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    let refreshInterval;
    
    // Only auto-refresh for active auctions
    if (auction?.status === 'active' && !auctionEnded) {
      refreshInterval = setInterval(() => {
        refreshAuctionData();
      }, 10000); // Refresh every 10 seconds for real-time updates
    }
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [auction?.status, id, auctionEnded, lastBidTime]);

  // Refresh button component
  const RefreshButton = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const handleManualRefresh = async () => {
      setIsRefreshing(true);
      await refreshAuctionData();
      setIsRefreshing(false);
    };
    
    return (
      <button
        onClick={handleManualRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        <svg 
          className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>
    );
  };

  // Timer component
  const BidTimer = () => {
    if (!isTimerActive || timeRemaining <= 0) return null;
    
    const isUrgent = timeRemaining <= 30000; // Last 30 seconds
    
    return (
      <div className={`bg-gradient-to-r ${isUrgent ? 'from-red-500 to-red-600' : 'from-orange-500 to-orange-600'} text-white rounded-xl p-4 mb-4 shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ${isUrgent ? 'animate-pulse' : ''}`}>
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-90">Time Remaining</p>
              <p className={`text-2xl font-bold ${isUrgent ? 'animate-pulse' : ''}`}>
                {formatTimer(timeRemaining)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Bid Interval</p>
            <p className="text-lg font-semibold">{auction?.bidInterval}s</p>
          </div>
        </div>
        {isUrgent && (
          <p className="text-sm mt-2 bg-white/10 rounded-lg p-2 text-center font-medium animate-pulse">
            ⚠️ Hurry! Less than 30 seconds left!
          </p>
        )}
      </div>
    );
  };

  // Winner announcement component
  const WinnerAnnouncement = () => {
    if (!winner || !auctionEnded) return null;
    
    const isCurrentUserWinner = winner.userId?.toString() === currentUserId?.toString();
    
    return (
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl p-6 mb-4 shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2">🎉 Auction Won! 🎉</h3>
          <p className="text-lg mb-2">
            {isCurrentUserWinner ? 'Congratulations! You won this auction!' : `Winner: ${winner.name}`}
          </p>
          <p className="text-xl font-bold">
            Winning Bid: ₹{winner.bidAmount?.toLocaleString()}
          </p>
          <p className="text-sm mt-2 opacity-90">
            Won at: {formatBidTime(winner.bidTime)}
          </p>
        </div>
      </div>
    );
  };

  // Handle registration for auction
  const handleRegisterForAuction = () => {
    navigate(`/checkout?auctionId=${id}&type=emd`);
  };

  // Handle edit auction (admin only)
  const handleEditAuction = () => {
    navigate(`/auctions/edit/${id}`);
  };

  const getStatusConfig = (status) => {
    // Override status if auction ended due to timer
    if (auctionEnded && winner) {
      return {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Trophy,
        label: 'Winner Declared'
      };
    }
    
    switch (status) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          label: 'Live Auction'
        };
      case 'upcoming':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Timer,
          label: 'Upcoming'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          label: 'Upcoming'
        };
      case 'ended':
      case 'completed':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertCircle,
          label: 'Ended'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
          label: status || 'Unknown'
        };
    }
  };

  const getActionButton = (status) => {
    const isRegistered = isUserRegistered();
    const registrationOpen = isRegistrationOpen();
    
    // If auction ended due to timer, disable bidding
    if (auctionEnded && winner) {
      return (
        <button className="w-full bg-yellow-400 text-white font-semibold py-3 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2" disabled>
          <Trophy className="w-5 h-5" />
          Winner Declared
        </button>
      );
    }
    
    switch (status) {
      case 'active':
        if (isRegistered) {
          // User is registered, show bid form
          return (
            <div className="space-y-4">
              <form onSubmit={handlePlaceBid} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Bid Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="Enter bid amount"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                      min={0}
                      step="1"
                      disabled={auctionEnded}
                    />
                  </div>
                  {bidError && (
                    <p className="text-red-500 text-sm mt-1">{bidError}</p>
                  )}
                </div>
                <button 
                  type="submit"
                  disabled={isPlacingBid || auctionEnded}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
                >
                  <Gavel className="w-5 h-5" />
                  {isPlacingBid ? 'Placing Bid...' : auctionEnded ? 'Auction Ended' : 'Place Bid'}
                </button>
              </form>
            </div>
          );
        } else {
          // User not registered, show registration closed message
          return (
            <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-semibold py-3 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2" disabled>
              <Clock className="w-5 h-5" />
              Registration Closed
            </button>
          );
        }
        
      case 'upcoming':
        if (registrationOpen) {
          if (isRegistered) {
            return (
              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2" disabled>
                <CheckCircle className="w-5 h-5" />
                Already Registered
              </button>
            );
          } else {
            return (
              <button 
                onClick={handleRegisterForAuction}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Register for Auction
              </button>
            );
          }
        } else {
          return (
            <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2" disabled>
              <Clock className="w-5 h-5" />
              Registration Closed
            </button>
          );
        }
        
      case 'pending':
        if (registrationOpen) {
          if (isRegistered) {
            return (
              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2" disabled>
                <CheckCircle className="w-5 h-5" />
                Already Registered
              </button>
            );
          } else {
            return (
              <button 
                onClick={handleRegisterForAuction}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Register for Auction
              </button>
            );
          }
        } else {
          return (
            <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-semibold py-3 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2" disabled>
              <Clock className="w-5 h-5" />
              Awaiting Approval
            </button>
          );
        }
        
      case 'ended':
      case 'completed':
        return (
          <button className="w-full bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2" disabled>
            <Eye className="w-5 h-5" />
            Auction Ended
          </button>
        );
        
      default:
        return (
          <button className="w-full bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2" disabled>
            <Eye className="w-5 h-5" />
            View Only
          </button>
        );
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading auction details...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-lg font-medium">{error}</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  // Debug: Log auction data when component renders
  console.log('Current auction state:', auction);
  
  if (!auction) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">No auction data available...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  const statusConfig = getStatusConfig(auction.status);
  const StatusIcon = statusConfig.icon;

  // Get current highest bid
  const currentBid = auction.bidLog && auction.bidLog.length > 0 
    ? auction.bidLog[auction.bidLog.length - 1]?.bidAmount 
    : auction.basePrice;

  // Get unique bidders count
  const uniqueBidders = auction.bidLog 
    ? [...new Set(auction.bidLog.map(bid => bid.userId?.toString()))].length
    : 0;


  return (
  <UserLayout>
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-screen mx-auto px-1 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{auction.title}</h1>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.color}`}>
                <StatusIcon className="w-4 h-4" />
                <span className="font-medium text-sm">{statusConfig.label}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Admin Edit Button */}
              {userRole === 'admin' && auction.status !== 'active' && (
                <button
                  onClick={handleEditAuction}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Auction
                </button>
              )}
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Auction ID</p>
                <p className="font-mono text-sm font-semibold text-gray-900">{auction._id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Winner Announcement - Show at top for visibility */}
            <WinnerAnnouncement />
            
            {/* Bid Timer - Show prominently when active */}
            <BidTimer />

            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative">
                <img 
                  src={mainImage} 
                  alt="Main auction item" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm">{auction.images?.length || 1}</span>
                </div>
              </div>
              
              {auction.images?.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {auction.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        onClick={() => setMainImage(img)}
                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 hover:scale-105 ${
                          mainImage === img ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auction Details Table */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Auction Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-semibold text-gray-900">{formatDateTime(auction.startDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-semibold text-gray-900">{formatDateTime(auction.endDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">EMD Amount</p>
                    <p className="font-semibold text-gray-900">₹{auction.emdAmount?.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Timer className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registration Ends</p>
                    <p className="font-semibold text-gray-900">{formatDateTime(auction.registrationDeadline)}</p>
                  </div>
                </div>
              </div>
            </div>
          
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{auction.description}</p>
            </div>
          </div>
          
          {/* Right Column - Bidding Summary */}
          <div className="space-y-6">
            {/* Timer and Winner announcement in sidebar for mobile/smaller screens */}
            <div className="lg:hidden space-y-4">

            </div>

            {/* Bidding Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Bidding Summary
                </h3>
                
                {/* Add refresh button for active auctions */}
                {auction.status === 'active' && <RefreshButton />}
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-semibold text-lg text-gray-900">
                    ₹{auction.basePrice ? auction.basePrice.toLocaleString() : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Current Bid</span>
                  <div className="text-right">
                    <span className="font-bold text-xl text-green-600">
                      ₹{currentBid ? currentBid.toLocaleString() : auction.basePrice ? auction.basePrice.toLocaleString() : 'N/A'}
                    </span>
                    {/* Show last updated time */}
                    <p className="text-xs text-gray-400 mt-1">
                      Last updated: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Bids</span>
                  <span className="font-semibold text-lg text-gray-900">{auction.bidLog?.length || 0}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Registered Bidders</span>
                  <span className="font-semibold text-lg text-gray-900">{auction.bidders?.length || 0}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Active Bidders</span>
                  <span className="font-semibold text-lg text-gray-900">{uniqueBidders}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mb-6">
                {getActionButton(auction.status)}
              </div>

              {/* Bid History with live updates indicator */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-600" />
                    Bid History
                  </h4>
                  
                  {/* Live indicator for active auctions */}
                  {auction.status === 'active' && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">Live</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  <div className="max-h-80 overflow-y-auto">
                    {auction.bidLog && auction.bidLog.length > 0 ? (
                      <div className="divide-y divide-gray-200">
                        {[...auction.bidLog].reverse().map((bid, idx) => {
                          const bidderName = getBidderName(bid.userId);
                          const isWinning = idx === 0; // First item after reverse is the latest/winning bid
                          const isCurrentUser = bid.userId?.toString() === currentUserId?.toString();
                          
                          return (
                            <div key={bid._id || idx} className={`flex justify-between items-center p-4 hover:bg-gray-100 transition-colors duration-150 ${
                              isWinning ? 'bg-green-50 border-l-4 border-green-500' : ''
                            } ${isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isWinning ? 'bg-green-100' : isCurrentUser ? 'bg-blue-100' : 'bg-gray-100'
                                }`}>
                                  <span className={`text-xs font-semibold ${
                                    isWinning ? 'text-green-600' : isCurrentUser ? 'text-blue-600' : 'text-gray-600'
                                  }`}>
                                    {bidderName[0].toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">
                                      {isCurrentUser ? 'You' : bidderName}
                                    </span>
                                    {isWinning && (
                                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                                        Leading
                                      </span>
                                    )}
                                    {isCurrentUser && !isWinning && (
                                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                                        Your Bid
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500">{formatBidTime(bid.createdAt)}</span>
                                </div>
                              </div>
                              <span className={`font-bold ${
                                isWinning ? 'text-green-600' : isCurrentUser ? 'text-blue-600' : 'text-gray-600'
                              }`}>
                                ₹{bid.bidAmount?.toLocaleString()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Gavel className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No bids yet</p>
                        <p className="text-gray-400 text-sm mt-1">Be the first to place a bid!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
);
};

export default AuctionDetail;