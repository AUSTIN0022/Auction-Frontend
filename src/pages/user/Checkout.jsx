// src/pages/user/Checkout.jsx
import { AlertCircle, ArrowLeft, CheckCircle, Clock, CreditCard, Info, Lock, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import UserLayout from '../../layouts/user/UserLayout';
import { createPayment, verifyPayment } from '../../services/payments';
import { getAuctionDetails } from '../../services/userAuctions';
import { formatDateTime } from '../../utils/dateUtils';
import { getUserFromToken } from '../../utils/jwtUtils';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const user = getUserFromToken();
  
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  // Get parameters from URL or location state - Fixed parameter extraction
  const urlParams = new URLSearchParams(location.search);
  const auctionId = params.auctionId || urlParams.get('auctionId') || location.state?.auctionId;
  const paymentType = urlParams.get('type') || location.state?.type || 'emd'; // 'emd' or 'final'

  console.log(`auctionID: ${auctionId} type: ${paymentType}`);
  console.log('URL params:', Object.fromEntries(urlParams));
  console.log('Route params:', params);
  console.log('Location state:', location.state);

  useEffect(() => {
    if (!auctionId || !paymentType) {
      console.error('Missing parameters:', { auctionId, paymentType });
      setError('Missing required parameters. Please return to the auction page and try again.');
      setLoading(false);
      return;
    }
    console.log('About to fetch auction details for:', auctionId);
    fetchAuctionDetails();
  }, [auctionId, paymentType]);

  const fetchAuctionDetails = async () => {
  try {
    setLoading(true);
    setError('');
    
    const response = await getAuctionDetails(auctionId);
    
    // Handle different possible response structures
    if (!response) {
      throw new Error('No response received from server');
    }

    const apiResponse = response.data;
    // Check if the API response is successful
    if (!apiResponse || !apiResponse.success) {
      throw new Error(apiResponse?.message || apiResponse?.error || 'API request failed');
    }
    
    // Extract auction data from the correct location
    const auctionData = apiResponse.auctionDetails;
        
    if (!auctionData) {
      throw new Error('No auction data found in response');
    }
    
    if (!auctionData.title) {
      console.warn('Auction title is missing');
    }

    setAuction(auctionData);
     
    // Set payment details based on type
    if (paymentType === 'emd') {
  
      if (!auctionData.emdAmount && auctionData.emdAmount !== 0) {
        console.error('EMD amount is missing or invalid:', auctionData.emdAmount);
        throw new Error('EMD amount not found for this auction');
      }
      
      const emdPaymentDetails = {
        amount: auctionData.emdAmount,
        paymentType: 'emd',
        auctionId: auctionId,
        description: `EMD Payment for ${auctionData.title || 'Auction Item'}`,
        title: 'Registration Payment',
        subtitle: 'Earnest Money Deposit (EMD)'
      };
      
      console.log('EMD Payment Details:', emdPaymentDetails);
      setPaymentDetails(emdPaymentDetails);
      
    } else if (paymentType === 'final') {
      console.log('Setting up final payment');
      
      let finalAmount = auctionData.basePrice || auctionData.startingPrice || auctionData.reservePrice;
      console.log('Initial final amount (base/starting/reserve):', finalAmount);
      
      if (auctionData.bidLog && auctionData.bidLog.length > 0) {
        console.log('Bid log found:', auctionData.bidLog);
        const bidAmounts = auctionData.bidLog.map(bid => bid.bidAmount).filter(amount => amount != null);
        console.log('Bid amounts:', bidAmounts);
        
        if (bidAmounts.length > 0) {
          const highestBid = Math.max(...bidAmounts);
          console.log('Highest bid:', highestBid);
          finalAmount = highestBid;
        }
      }
      
      console.log('Final amount calculated:', finalAmount);
      
      if (!finalAmount && finalAmount !== 0) {
        console.error('Unable to determine final payment amount');
        throw new Error('Unable to determine final payment amount');
      }
      
      const finalPaymentDetails = {
        amount: finalAmount,
        paymentType: 'final',
        auctionId: auctionId,
        description: `Final Payment for ${auctionData.title || 'Auction Item'}`,
        title: 'Final Payment',
        subtitle: 'Complete Your Purchase'
      };
      
      console.log('Final Payment Details:', finalPaymentDetails);
      setPaymentDetails(finalPaymentDetails);
    }
    
  } catch (err) {
    setError(err.message || 'Error fetching auction details. Please try again.');
  } finally {
    setLoading(false);
    console.log('=== FETCH COMPLETED (finally block) ===');
  }
};
const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.getElementById('razorpay-script');
    if (existingScript) {
      existingScript.onload = () => resolve(true);
      existingScript.onerror = () => reject(false);
      return;
    }

    // Create and load the script
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      resolve(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      reject(false);
    };
    
    document.head.appendChild(script);
  });
}

useEffect(() => {
  // Preload Razorpay script when component mounts
  loadRazorpayScript().catch(error => {
    console.warn('Failed to preload Razorpay script:', error);
  });
}, []);

// Fixed handlePayment function with better error handling and response structure validation

const handlePayment = async () => {
  if (!window.Razorpay) {
    setError('Razorpay SDK not loaded. Please refresh the page.');
    return;
  }

  if (!paymentDetails) {
    setError('Payment details not available. Please try again.');
    return;
  }

  setPaymentLoading(true);
  setError('');
  setStatus('Creating payment order...');

  try {
    if (!window.Razorpay) {
      setStatus('Loading payment gateway...');
      
      try {
        await loadRazorpayScript();
      } catch (scriptError) {
        console.log(`ERROR: ${scriptError.message}`);
        throw new Error('Unable to load payment gateway. Please check your internet connection and try again.');
      }
    }

    setStatus('Creating payment order...');
    
    console.log('Creating payment with details:', paymentDetails);
    
    // Create payment order
    const orderResponse = await createPayment({
      auctionId: paymentDetails.auctionId,
      amount: paymentDetails.amount,
      paymentType: paymentDetails.paymentType,
      description: paymentDetails.description
    });

    console.log('Payment order response:', orderResponse);

    // Validate the response structure
    if (!orderResponse) {
      throw new Error('No response received from payment service');
    }

    // Check if the response has the expected structure
    // Handle different possible response structures
    let order, paymentId, key;

    // Case 1: Direct response structure
    if (orderResponse.order && orderResponse.payment && orderResponse.key) {
      order = orderResponse.order;
      paymentId = orderResponse.payment.id;
      key = orderResponse.key;
    }
    // Case 2: Response wrapped in data property
    else if (orderResponse.data && orderResponse.data.order && orderResponse.data.payment) {
      order = orderResponse.data.order;
      paymentId = orderResponse.data.payment.id;
      key = orderResponse.data.key;
    }
    // Case 3: Response has success property
    else if (orderResponse.success === false) {
      throw new Error(orderResponse.message || 'Failed to create payment order');
    }
    // Case 4: Order directly in response (for some API structures)
    else if (orderResponse.id && orderResponse.amount) {
      // The order is directly in the response
      order = orderResponse;
      paymentId = orderResponse.receipt || 'temp_payment_id';
      key = process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_key'; // fallback key
    }
    else {
      console.error('Unexpected response structure:', orderResponse);
      throw new Error('Invalid response structure from payment service');
    }

    // Validate required fields
    if (!order || !order.id || !order.amount) {
      console.error('Missing required order fields:', { order });
      throw new Error('Invalid order data received from payment service');
    }

    console.log('Extracted order details:', { order, paymentId, key });

    const options = {
      key: key,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Auction Platform',
      description: paymentDetails.description,
      order_id: order.id,
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.mobile || ''
      },
      notes: {
        paymentId: paymentId,
        auctionId: paymentDetails.auctionId,
        paymentType: paymentDetails.paymentType
      },
      theme: {
        color: '#3B82F6'
      },
      modal: {
        ondismiss: function() {
          setPaymentLoading(false);
          setStatus('Payment cancelled by user');
        }
      },
      handler: async function (response) {
        await handlePaymentSuccess(response, paymentId);
      }
    };

    console.log('Razorpay options:', options);

    const razorpay = new window.Razorpay(options);
    razorpay.open();

  } catch (err) {
    console.error('Payment initiation error:', err);
    setError(err.message || 'Payment initiation failed');
    setPaymentLoading(false);
    setStatus('');
  }
};

// Also update the handlePaymentSuccess function for better error handling
const handlePaymentSuccess = async (response, paymentId) => {
  try {
    setStatus('Verifying payment...');
    
    console.log('Verifying payment with response:', response);
    
    const verificationResult = await verifyPayment({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      paymentId: paymentId
    });

    console.log('Payment verification result:', verificationResult);

    // Handle different response structures for verification
    const isSuccess = verificationResult?.success === true || 
                     verificationResult?.data?.success === true ||
                     (verificationResult && !verificationResult.error);

    if (isSuccess) {
      setStatus('Payment verified successfully!');
      setTimeout(() => {
        navigate(`/payment-success?auctionId=${auctionId}&type=${paymentType}`, {
          replace: true
        });
      }, 1500);
    } else {
      const errorMessage = verificationResult?.message || 
                          verificationResult?.data?.message || 
                          verificationResult?.error || 
                          'Payment verification failed';
      throw new Error(errorMessage);
    }
  } catch (err) {
    console.error('Payment verification error:', err);
    setError(err.message || 'Payment verification failed');
    setPaymentLoading(false);
    setStatus('');
    
    setTimeout(() => {
      navigate(`/payment-failure?auctionId=${auctionId}&type=${paymentType}`, {
        replace: true
      });
    }, 2000);
  }
};


  const goBack = () => {
    navigate(-1);
  };


  // Test function - you can call this from browser console
  window.testAuctionAPI = async () => {
    try {
      console.log('Testing API call...');
      const testResponse = await getAuctionDetails(auctionId);
      console.log('Test API Response:', testResponse);
      return testResponse;
    } catch (error) {
      console.error('Test API Error:', error);
      return error;
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading auction details...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error && !auction) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Checkout</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setError('');
                  setLoading(true);
                  fetchAuctionDetails();
                }}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={goBack}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={goBack}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Auction
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {paymentDetails?.title || 'Payment'}
            </h1>
            <p className="text-gray-600 mt-1">
              {paymentDetails?.subtitle || 'Complete your transaction securely'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Payment Details */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Auction Info */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Auction Details</h2>
                  <div className="flex items-start space-x-4">
                    <img
                      src={auction?.images?.[0] || '/api/placeholder/100/100'}
                      alt={auction?.title}
                      className="w-25 h-25 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/100/100';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{auction?.title}</h3>
                      {/* <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {auction?.description}
                      </p> */}
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Start: {formatDateTime(auction.startDate)}
                      </div>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Ends: {formatDateTime(auction.endDate)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Type Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Payment Type</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {paymentDetails?.subtitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">Amount</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{paymentDetails?.amount?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Information Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        {paymentType === 'emd' ? (
                          <>
                            <p className="font-medium mb-1">About EMD Payment</p>
                            <p>The Earnest Money Deposit is refundable if you do not win the auction. This payment registers your participation in the auction.</p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium mb-1">Final Payment</p>
                            <p>This payment will complete your purchase of the auction item. The amount includes your winning bid.</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Messages */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        <span className="text-red-800 text-sm">{error}</span>
                      </div>
                    </div>
                  )}

                  {status && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-green-800 text-sm">{status}</span>
                      </div>
                    </div>
                  )}

                  {/* Payment Button */}
                  <button
                    onClick={handlePayment}
                    disabled={paymentLoading || !paymentDetails}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {paymentLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Pay ₹{paymentDetails?.amount?.toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Security Info Sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  Secure Payment
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Lock className="h-5 w-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">SSL Encrypted</p>
                      <p className="text-gray-600 text-xs">Your payment information is protected with bank-level security</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Razorpay Gateway</p>
                      <p className="text-gray-600 text-xs">Processed through India's leading payment gateway</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Instant Verification</p>
                      <p className="text-gray-600 text-xs">Payment status updated immediately after confirmation</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Checkout;