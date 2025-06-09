// src/components/Toast.jsx
import React from 'react';
import toast from 'react-hot-toast';
import { 
  Gavel, 
  RefreshCw, 
  Play, 
  Clock, 
  StopCircle, 
  TrendingUp, 
  TrendingDown, 
  Trophy, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  DollarSign, 
  UserPlus, 
  TestTube,
  Bell
} from 'lucide-react';

// Notification type configurations
const notificationConfig = {
  auction_created: {
    title: 'New Auction Available',
    icon: Gavel,
    style: {
      background: '#3B82F6',
      color: '#FFFFFF',
    },
    iconColor: '#FFFFFF'
  },
  auction_updated: {
    title: 'Auction Has Been Updated',
    icon: RefreshCw,
    style: {
      background: '#8B5CF6',
      color: '#FFFFFF',
    },
    iconColor: '#FFFFFF'
  },
  auction_started: {
    title: 'Auction Has Started',
    icon: Play,
    style: {
      background: '#10B981',
      color: '#FFFFFF',
    },
    iconColor: '#FFFFFF'
  },
  auction_ending_soon: {
    title: 'Auction Ending Soon',
    icon: Clock,
    style: {
      background: '#F59E0B',
      color: '#FFFFFF',
    },
    iconColor: '#FFFFFF'
  },
  auction_ended: {
    title: 'Auction Has Ended',
    icon: StopCircle,
    style: {
      background: '#6B7280',
      color: '#FFFFFF',
    },
    iconColor: '#FFFFFF'
  },
  bid_placed: {
    title: 'New Bid Placed',
    icon: TrendingUp,
    style: {
      background: '#059669',
      color: '#FFFFFF',
    },
    iconColor: '#FFFFFF'
  },
  outbid: {
    title: 'You Have Been Outbid',
    icon: TrendingDown,
    style: {
      background: '#DC2626',
      color: '#FFFFFF',
    },
    iconColor: '#FFFFFF'
  },
  auction_won: {
    title: 'You Won the Auction',
    icon: Trophy,
    style: {
      background: '#FFD700',
      color: '#1F2937',
    },
    iconColor: '#1F2937'
  },
  kyc_approved: {
    title: 'KYC Verification Approved',
    icon: CheckCircle,
    style: {
      background: '#10B981',
      color: '#FFFFFF',
    },
    iconColor: '#FFFFFF'
  },
  kyc_rejected: {
    title: 'KYC Verification Rejected',
    icon: XCircle,
    style: {
      background: '#EF4444',
      color: '#FFFFFF',
    },
    iconColor: '#FFFFFF'
  },
  payment_received: {
    title: 'Payment Received',
    icon: CreditCard,
    style: {
      background: '#10B981',
      color: '#FFFFFF',
    },
    iconColor: '#FFFFFF'
  },
  emd_refunded: {
    title: 'EMD Amount Refunded',
    icon: DollarSign,
    style: {
      background: '#3B82F6',
      color: '#FFFFFF',
    },
    iconColor: '#FFFFFF'
  },
  new_user: {
    title: 'New User Registration',
    icon: UserPlus,
    style: {
      background: '#8B5CF6',
      color: '#FFFFFF',
    },
    iconColor: '#FFFFFF'
  },
  test: {
    title: 'Test Notification',
    icon: TestTube,
    style: {
      background: '#6B7280',
      color: '#FFFFFF',
    },
    iconColor: '#FFFFFF'
  }
};

// Custom Toast Component
const CustomToast = ({ type, title, body, data }) => {
  const config = notificationConfig[type] || {
    title: title || 'Notification',
    icon: Bell,
    style: {
      background: '#374151',
      color: '#FFFFFF',
    },
    iconColor: '#FFFFFF'
  };

  const IconComponent = config.icon;

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg shadow-lg max-w-sm">
      <div 
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: config.style.background }}
      >
        <IconComponent 
          size={18} 
          color={config.iconColor}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-gray-900 mb-1">
          {title || config.title}
        </h4>
        {body && (
          <p className="text-sm text-gray-600 leading-tight">
            {body}
          </p>
        )}
        {data?.auctionId && (
          <p className="text-xs text-gray-500 mt-1">
            ID: {data.auctionId.slice(-8)}
          </p>
        )}
      </div>
    </div>
  );
};

// Toast utility functions
export const showNotificationToast = (payload) => {
  const { data } = payload;
  const type = data?.type;
  const title = data?.n_title;
  const body = data?.n_body;

  const config = notificationConfig[type];
  
  if (config) {
    toast.custom(
      <CustomToast 
        type={type}
        title={title}
        body={body}
        data={data}
      />,
      {
        duration: 6000,
        position: 'top-right',
        style: {
          boxShadow: 'none',
        }
      }
    );
  } else {
    // Fallback to regular toast
    toast(title || '📩 New Notification', {
      description: body,
      duration: 4000,
    });
  }
};

// Enhanced toast functions for different types
export const toastHelpers = {
  auctionCreated: (title, body, data) => 
    showNotificationToast({ data: { type: 'auction_created', n_title: title, n_body: body, ...data } }),
  
  auctionUpdated: (title, body, data) => 
    showNotificationToast({ data: { type: 'auction_updated', n_title: title, n_body: body, ...data } }),
  
  auctionStarted: (title, body, data) => 
    showNotificationToast({ data: { type: 'auction_started', n_title: title, n_body: body, ...data } }),
  
  auctionEndingSoon: (title, body, data) => 
    showNotificationToast({ data: { type: 'auction_ending_soon', n_title: title, n_body: body, ...data } }),
  
  auctionEnded: (title, body, data) => 
    showNotificationToast({ data: { type: 'auction_ended', n_title: title, n_body: body, ...data } }),
  
  bidPlaced: (title, body, data) => 
    showNotificationToast({ data: { type: 'bid_placed', n_title: title, n_body: body, ...data } }),
  
  outbid: (title, body, data) => 
    showNotificationToast({ data: { type: 'outbid', n_title: title, n_body: body, ...data } }),
  
  auctionWon: (title, body, data) => 
    showNotificationToast({ data: { type: 'auction_won', n_title: title, n_body: body, ...data } }),
  
  kycApproved: (title, body, data) => 
    showNotificationToast({ data: { type: 'kyc_approved', n_title: title, n_body: body, ...data } }),
  
  kycRejected: (title, body, data) => 
    showNotificationToast({ data: { type: 'kyc_rejected', n_title: title, n_body: body, ...data } }),
  
  paymentReceived: (title, body, data) => 
    showNotificationToast({ data: { type: 'payment_received', n_title: title, n_body: body, ...data } }),
  
  emdRefunded: (title, body, data) => 
    showNotificationToast({ data: { type: 'emd_refunded', n_title: title, n_body: body, ...data } }),
  
  newUser: (title, body, data) => 
    showNotificationToast({ data: { type: 'new_user', n_title: title, n_body: body, ...data } }),
  
  test: (title, body, data) => 
    showNotificationToast({ data: { type: 'test', n_title: title, n_body: body, ...data } })
};

export default CustomToast;