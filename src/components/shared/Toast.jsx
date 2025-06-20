// src/components/Toast.jsx
import {
    Bell,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    Gavel,
    Play,
    RefreshCw,
    StopCircle,
    TestTube,
    TrendingDown,
    TrendingUp,
    Trophy,
    UserPlus,
    XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';



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
    console.log(`\n\n ${type}: ${title}: ${body}: ${JSON.stringify(data)} \n\n`);
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

  const navigate = useNavigate();

    const renderButton = (type) => {
        switch (type) {
            case 'new_user':
            return (
            <button
                onClick={() => navigate(`${data?.link}`)}
                className="text-xs px-3 py-1 rounded bg-violet-600 text-white hover:bg-violet-700 transition"
            >
                View User
            </button>
            );

        case 'auction_won':
            return (
            <button
                onClick={() => navigate(`${data?.link}`)}
                className="text-xs px-3 py-1 rounded bg-yellow-500 text-black hover:bg-yellow-600 transition"
            >
                View Won Auction
            </button>
            );

        case 'outbid':
            return (
            <button
                onClick={() => navigate(`${data?.link}`)}
                className="text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
            >
                Place New Bid
            </button>
            );

        case 'kyc_approved':
            return (
            <button
                onClick={() => navigate(`${data?.link}`)}
                className="text-xs px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition"
            >
                View KYC
            </button>
            );

        case 'auction_created':
            return (
            <button
                onClick={() => navigate(`${data?.link}`)}
                className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
                View Auction
            </button>
            );

            default: return null;
        }
    };

    const button = renderButton(type);

  return (
  <div className="flex items-start gap-3 p-4 rounded-lg shadow-lg max-w-sm bg-white text-gray-800 border border-gray-200 ">
    <div 
      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
      style={{ backgroundColor: config.style.background }}
    >
      <IconComponent size={18} color={config.iconColor} />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-sm mb-1">{title || config.title}</h4>
      {body && (
        <p className="text-sm leading-tight">
          {body}
        </p>
      )}
      {button && (
        <div className="mt-2">
          {button}
        </div>
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
        duration: 5000,
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


export default CustomToast;