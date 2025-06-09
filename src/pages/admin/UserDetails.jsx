import {
    Activity,
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    FileText,
    Mail,
    Phone,
    Shield,
    TrendingDown,
    TrendingUp,
    User,
    UserCheck,
    UserX,
    Wallet,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getUserById, rejectUser, verifyUser } from '../../services/adminUsers';

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false); // Changed default to false
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');
  const [processingAction, setProcessingAction] = useState(null);


    // Check if screen is mobile and handle sidebar state
      useEffect(() => {
        const checkMobile = () => {
          const mobile = window.innerWidth < 768;
          setIsMobile(mobile);
          
          // Auto-close sidebar on mobile when resizing
          if (mobile && sidebarOpen) {
            setSidebarOpen(false);
          }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
      }, [sidebarOpen]);
    
      // Calculate margin based on sidebar state
      const getMainContentMargin = () => {
        if (isMobile) {
          return ''; // No margin on mobile
        }
        return sidebarCollapsed ? 'md:ml-16' : 'md:ml-64';
      };

  useEffect(() => {
    fetchUser();
  }, [id]);

  async function fetchUser() {
    setLoading(true);
    setErrMsg('');
    try {
      const res = await getUserById(id);
      setUser(res.data);
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      setErrMsg('Failed to load user details');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!window.confirm('Are you sure you want to approve verification for this user?')) return;
    setProcessingAction('verify');
    try {
      await verifyUser(id);
      await fetchUser();
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      alert('Failed to verify user.');
    } finally {
      setProcessingAction(null);
    }
  }

  async function handleReject() {
    if (!window.confirm('Are you sure you want to reject verification for this user?')) return;
    setProcessingAction('reject');
    try {
      await rejectUser(id);
      await fetchUser();
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      alert('Failed to reject user.');
    } finally {
      setProcessingAction(null);
    }
  }

  const formatDate = (str) =>
    new Date(str).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatCurrency = (amt = 0, curr = 'INR') =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: curr }).format(amt);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 text-lg">Loading user details...</span>
        </div>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Error Loading User</h2>
          </div>
          <p className="text-gray-600 mb-6">{errMsg}</p>
          <button
            onClick={() => navigate('/user-verification')}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to User Verification
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onCollapseChange={setSidebarCollapsed}
      />
      
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
     {/* Main Content */}
    <div className={`flex-1 transition-all duration-300 ease-in-out ${getMainContentMargin()}`}>
        <AdminHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">User Details</h1>
              <p className="text-gray-600">Complete profile and verification information</p>
            </div>
            <button
              onClick={() => navigate('/user-verification')}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Verification
            </button>
          </div>

          {/* Status Banner */}
          <div className="mb-6">
            <StatusBanner status={user.verifyStatus} isActive={user.isActive} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Personal Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InfoItem icon={<User className="w-4 h-4" />} label="Full Name" value={user.name} />
                    <InfoItem icon={<Mail className="w-4 h-4" />} label="Email Address" value={user.email} />
                    <InfoItem icon={<Phone className="w-4 h-4" />} label="Mobile Number" value={user.mobile || 'Not provided'} />
                    <InfoItem icon={<Calendar className="w-4 h-4" />} label="Registration Date" value={formatDate(user.createdAt)} />
                    <InfoItem icon={<FileText className="w-4 h-4" />} label="User ID" value={user._id} className="sm:col-span-2" />
                  </div>
                </div>
              </div>

              {/* Wallet Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-600" />
                    Wallet Information
                  </h3>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">Current Balance</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(user.wallet?.balance, user.wallet?.currency || 'INR')}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Recent Transactions
                    </h4>
                    {user.wallet?.transactions?.length > 0 ? (
                      <div className="space-y-3">
                        {user.wallet.transactions.slice(0, 5).map((txn, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${txn.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                {txn.amount > 0 ? (
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {txn.description || 'Transaction'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(txn.createdAt || user.createdAt)}
                                </p>
                              </div>
                            </div>
                            <span className={`font-semibold ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {txn.amount > 0 ? '+' : ''}
                              {formatCurrency(txn.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No transactions found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Activity Log Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    Activity Log
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <ActivityItem
                      icon={<User className="w-4 h-4 text-blue-600" />}
                      title="Account Created"
                      date={formatDate(user.createdAt)}
                      description="User registered on the platform"
                    />
                    {user.idProof && (
                      <ActivityItem
                        icon={<FileText className="w-4 h-4 text-green-600" />}
                        title="ID Proof Uploaded"
                        date={formatDate(user.createdAt)}
                        description="Identity document submitted for verification"
                      />
                    )}
                    {user.verifyStatus !== 'pending' && (
                      <ActivityItem
                        icon={user.verifyStatus === 'verified' ? 
                          <CheckCircle className="w-4 h-4 text-green-600" /> : 
                          <XCircle className="w-4 h-4 text-red-600" />
                        }
                        title={`Verification ${user.verifyStatus}`}
                        date={formatDate(user.updatedAt)}
                        description={`Account verification was ${user.verifyStatus}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - ID Proof & Actions */}
            <div className="space-y-6">
              {/* ID Proof Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    Identity Verification
                  </h3>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <StatusBadge status={user.verifyStatus} />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                    {user.idProof ? (
                      <img
                        src={user.idProof}
                        alt="ID Proof"
                        className="rounded-lg max-h-64 w-full object-contain shadow-sm"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <div className={`py-12 ${user.idProof ? 'hidden' : ''}`}>
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No ID proof uploaded</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
                </div>
                <div className="p-6 space-y-3">
                  <button
                    onClick={() => alert('Email notification feature coming soon!')}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200"
                  >
                    <Mail className="w-4 h-4" />
                    Send Email Notification
                  </button>
                  
                  {user.verifyStatus !== 'verified' && (
                    <button
                      onClick={handleVerify}
                      disabled={processingAction === 'verify'}
                      className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                      {processingAction === 'verify' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" />
                          Approve Verification
                        </>
                      )}
                    </button>
                  )}
                  
                  {user.verifyStatus !== 'rejected' && (
                    <button
                      onClick={handleReject}
                      disabled={processingAction === 'reject'}
                      className="w-full inline-flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                      {processingAction === 'reject' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <UserX className="w-4 h-4" />
                          Reject Verification
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Account Status Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <h3 className="text-lg font-semibold text-gray-900">Account Status</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {user.isActive ? (
                      <>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-600 font-medium">Active Account</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-red-600 font-medium">Inactive Account</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Account registered on {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatusBanner({ status, isActive }) {
  const getStatusConfig = () => {
    if (status === 'verified') {
      return {
        bg: 'bg-gradient-to-r from-green-50 to-green-100',
        border: 'border-green-200',
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        title: 'Verified User',
        description: 'This user has been successfully verified and can access all features.',
        textColor: 'text-green-800'
      };
    } else if (status === 'rejected') {
      return {
        bg: 'bg-gradient-to-r from-red-50 to-red-100',
        border: 'border-red-200',
        icon: <XCircle className="w-6 h-6 text-red-600" />,
        title: 'Verification Rejected',
        description: 'This user\'s verification was rejected and requires review.',
        textColor: 'text-red-800'
      };
    } else {
      return {
        bg: 'bg-gradient-to-r from-yellow-50 to-yellow-100',
        border: 'border-yellow-200',
        icon: <Clock className="w-6 h-6 text-yellow-600" />,
        title: 'Pending Verification',
        description: 'This user is awaiting verification review.',
        textColor: 'text-yellow-800'
      };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`rounded-xl border p-4 ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {config.icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${config.textColor}`}>{config.title}</h3>
          <p className={`text-sm ${config.textColor} opacity-80 mt-1`}>{config.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className={`text-xs ${config.textColor} opacity-70`}>
              Account Status: {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status = 'pending' }) {
  const config = {
    verified: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: <CheckCircle className="w-3 h-3" />
    },
    rejected: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: <XCircle className="w-3 h-3" />
    },
    pending: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      icon: <Clock className="w-3 h-3" />
    }
  };

  const statusConfig = config[status];

  return (
    <span className={`
      inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border
      ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}
    `}>
      {statusConfig.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function InfoItem({ icon, label, value, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 break-all">
        {value}
      </p>
    </div>
  );
}

function ActivityItem({ icon, title, date, description }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
      <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-medium text-gray-900 truncate">{title}</h4>
          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{date}</span>
        </div>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
}