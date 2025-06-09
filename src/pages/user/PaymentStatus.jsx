// src/pages/user/PaymentStatus.jsx
import { AlertTriangle, ArrowLeft, CheckCircle, Clock, CreditCard, Download, Home, RefreshCw, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserLayout from '../../layouts/user/UserLayout';
import { getAuctionDetails } from '../../services/userAuctions';

const PaymentStatus = ({ status: propStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Get parameters from URL
  const urlParams = new URLSearchParams(location.search);
  const auctionId = urlParams.get('auctionId');
  const paymentType = urlParams.get('type');
  const status = propStatus || (location.pathname.includes('success') ? 'success' : 'failure');

  useEffect(() => {
    if (auctionId) {
      fetchAuctionDetails();
    } else {
      setLoading(false);
    }
  }, [auctionId]);

  const fetchAuctionDetails = async () => {
    try {
      const response = await getAuctionDetails(auctionId);
      if (response.success) {
        setAuction(response.auctionDetails);
        
        // Set payment details based on type
        if (paymentType === 'emd') {
          setPaymentDetails({
            amount: response.auctionDetails.emdAmount,
            type: 'EMD Payment',
            description: 'Earnest Money Deposit'
          });
        } else if (paymentType === 'final') {
          let finalAmount = response.auctionDetails.basePrice;
          if (response.auctionDetails.bidLog && response.auctionDetails.bidLog.length > 0) {
            const highestBid = Math.max(...response.auctionDetails.bidLog.map(bid => bid.bidAmount));
            finalAmount = highestBid;
          }
          setPaymentDetails({
            amount: finalAmount,
            type: 'Final Payment',
            description: 'Auction Purchase'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching auction details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = () => {
    if (status === 'success') {
      return {
        icon: CheckCircle,
        iconColor: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        title: 'Payment Successful!',
        subtitle: 'Your payment has been processed successfully',
        primaryAction: {
          label: paymentType === 'emd' ? 'Go to Auction' : 'View Dashboard',
          action: () => navigate(paymentType === 'emd' ? `/auctions/${auctionId}` : '/dashboard'),
          className: 'bg-green-600 hover:bg-green-700 text-white'
        },
        secondaryAction: {
          label: 'Home',
          action: () => navigate('/dashboard'),
          className: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }
      };
    } else {
      return {
        icon: XCircle,
        iconColor: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        title: 'Payment Failed',
        subtitle: 'We were unable to process your payment',
        primaryAction: {
          label: 'Try Again',
          action: () => navigate(`/checkout?auctionId=${auctionId}&type=${paymentType}`),
          className: 'bg-red-600 hover:bg-red-700 text-white'
        },
        secondaryAction: {
          label: 'Go Back',
          action: () => navigate(-1),
          className: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }
      };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </UserLayout>
    );
  }

  const getNextSteps = () => {
    if (status === 'success') {
      if (paymentType === 'emd') {
        return [
          'Your registration is confirmed',
          'You can now participate in the auction',
          'Watch the auction progress in real-time',
          'EMD will be refunded if you don\'t win'
        ];
      } else {
        return [
          'Congratulations on your purchase!',
          'You will receive confirmation via email',
          'Item delivery details will be shared soon',
          'Thank you for using our platform'
        ];
      }
    } else {
      return [
        'Check your payment method details',
        'Ensure sufficient balance in your account',
        'Try using a different payment method',
        'Contact support if the issue persists'
      ];
    }
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className={`${config.bgColor} ${config.borderColor} border-b px-6 py-8 text-center`}>
              <StatusIcon className={`h-16 w-16 ${config.iconColor} mx-auto mb-4`} />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {config.title}
              </h1>
              <p className="text-gray-600">
                {config.subtitle}
              </p>
            </div>

            {/* Payment Details */}
            {auction && paymentDetails && (
              <div className="px-6 py-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={auction.images?.[0] || '/api/placeholder/80/80'}
                      alt={auction.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{auction.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{paymentDetails.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-medium text-gray-700">
                          {paymentDetails.type}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ₹{paymentDetails.amount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="px-6 py-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {status === 'success' ? 'What\'s Next?' : 'What You Can Do'}
              </h3>
              <ul className="space-y-3">
                {getNextSteps().map((step, index) => (
                  <li key={index} className="flex items-start">
                    <div className={`w-2 h-2 rounded-full ${status === 'success' ? 'bg-green-500' : 'bg-blue-500'} mt-2 mr-3 flex-shrink-0`}></div>
                    <span className="text-gray-700 text-sm">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional Info */}
            {status === 'success' && (
              <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Transaction completed at {new Date().toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      You will receive a confirmation email shortly
                    </p>
                  </div>
                </div>
              </div>
            )}

            {status === 'failure' && (
              <div className="px-6 py-4 bg-amber-50 border-b border-gray-200">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      Need Help?
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Contact our support team if you continue to face issues
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="px-6 py-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={config.primaryAction.action}
                  className={`flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${config.primaryAction.className}`}
                >
                  {status === 'success' ? (
                    paymentType === 'emd' ? (
                      <CreditCard className="h-4 w-4 mr-2" />
                    ) : (
                      <Home className="h-4 w-4 mr-2" />
                    )
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  {config.primaryAction.label}
                </button>
                
                <button
                  onClick={config.secondaryAction.action}
                  className={`flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${config.secondaryAction.className}`}
                >
                  {status === 'success' ? (
                    <Home className="h-4 w-4 mr-2" />
                  ) : (
                    <ArrowLeft className="h-4 w-4 mr-2" />
                  )}
                  {config.secondaryAction.label}
                </button>
              </div>

              {/* Download Receipt (Success only) */}
              {status === 'success' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Support Contact */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Having trouble? {' '}
              <a href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default PaymentStatus;