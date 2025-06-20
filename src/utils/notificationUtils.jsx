 
 import { AlertCircle, Bell, Clock, Gavel, Shield, Trophy, User, X } from 'lucide-react';
 
 // Get icon based on notification type
  export const getNotificationIcon = (type) => {
    switch (type) {
      case 'auction_created':
        return <Bell className="w-5 h-5 text-blue-600" />;
      case 'auction_updated':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'auction_started':
        return <Clock className="w-5 h-5 text-green-600" />;
      case 'auction_ending_soon':
        return <Clock className="w-5 h-5 text-red-600" />;
      case 'auction_ended':
        return <Clock className="w-5 h-5 text-gray-600" />;
      case 'bid_placed':
        return <Gavel className="w-5 h-5 text-blue-600" />;
      case 'outbid':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'auction_won':
        return <Trophy className="w-5 h-5 text-yellow-600" />;
      case 'kyc_approved':
        return <Shield className="w-5 h-5 text-green-600" />;
      case 'kyc_rejected':
        return <X className="w-5 h-5 text-red-600" />;
      case 'payment_received':
        return <Trophy className="w-5 h-5 text-green-600" />;
      case 'emd_refunded':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'new_user':
        return <User className="w-5 h-5 text-purple-600" />;
      case 'test':
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  // Get background color based on notification type
  export const getNotificationBg = (type) => {
    switch (type) {
      case 'auction_created':
        return 'bg-blue-50 border-blue-100';
      case 'auction_updated':
        return 'bg-orange-50 border-orange-100';
      case 'auction_started':
        return 'bg-green-50 border-green-100';
      case 'auction_ending_soon':
        return 'bg-red-50 border-red-100';
      case 'auction_ended':
        return 'bg-gray-50 border-gray-100';
      case 'bid_placed':
        return 'bg-blue-50 border-blue-100';
      case 'outbid':
        return 'bg-red-50 border-red-100';
      case 'auction_won':
        return 'bg-yellow-50 border-yellow-100';
      case 'kyc_approved':
        return 'bg-green-50 border-green-100';
      case 'kyc_rejected':
        return 'bg-red-50 border-red-100';
      case 'payment_received':
        return 'bg-green-50 border-green-100';
      case 'emd_refunded':
        return 'bg-blue-50 border-blue-100';
      case 'new_user':
        return 'bg-purple-50 border-purple-100';
      case 'test':
        return 'bg-gray-50 border-gray-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

