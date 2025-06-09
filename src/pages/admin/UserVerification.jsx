import {
    Calendar,
    CheckCircle,
    Clock,
    Eye,
    FileText,
    Mail,
    Search,
    User,
    UserCheck,
    Users,
    UserX,
    X,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/admin/AdminLayout';
import {
    getAllUsers,
    getUserDocuments,
    rejectUser,
    verifyUser,
} from '../../services/adminUsers';

export default function UserVerification() {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({ pendingUsers: 0, approveUsers: 0, rejectUsers: 0 });
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingUser, setProcessingUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data.users || []);
      setCounts(res.data.counts || {});
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const filteredUsers = users.filter((user) => {
    const statusMatch =
      filter === 'pending'
        ? user.verifyStatus === 'pending' || !user.verifyStatus
        : user.verifyStatus === filter;
    const searchMatch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user._id.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  const handleVerify = async (id) => {
    if (!window.confirm('Are you sure you want to verify this user?')) return;
    setProcessingUser(id);
    try {
      await verifyUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
    setProcessingUser(null);
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this user?')) return;
    setProcessingUser(id);
    try {
      await rejectUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
    setProcessingUser(null);
  };

  const handleViewDoc = async (id) => {
    try {
      const res = await getUserDocuments(id);
      setDocumentUrl(res.data.document || '');
    } catch (err) {
      alert('Failed to load document');
    }
  };

  const statCards = [
    {
      title: 'Pending Verification',
      count: counts.pendingUsers || 0,
      color: 'yellow',
      icon: <Clock className="w-6 h-6" />,
      bgGradient: 'from-yellow-400 to-orange-500',
      description: 'Awaiting review'
    },
    {
      title: 'Verified Users',
      count: counts.approveUsers || 0,
      color: 'green',
      icon: <UserCheck className="w-6 h-6" />,
      bgGradient: 'from-green-400 to-green-600',
      description: 'Successfully verified'
    },
    {
      title: 'Rejected Users',
      count: counts.rejectUsers || 0,
      color: 'red',
      icon: <UserX className="w-6 h-6" />,
      bgGradient: 'from-red-400 to-red-600',
      description: 'Verification denied'
    }
  ];

  const filterTabs = [
    { key: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4" /> },
    { key: 'verified', label: 'Verified', icon: <CheckCircle className="w-4 h-4" /> },
    { key: 'rejected', label: 'Rejected', icon: <XCircle className="w-4 h-4" /> }
  ];

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">User Verification</h1>
        <p className="text-gray-600">Review and manage user verification requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.count}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
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

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === tab.key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-lg font-semibold text-gray-900">
            {filter.charAt(0).toUpperCase() + filter.slice(1)} Users ({filteredUsers.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading users...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No users found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Info
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr 
                    key={user._id} 
                    className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">ID: {user._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={user.verifyStatus} />
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDoc(user._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-lg transition-all duration-200"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="hidden sm:inline">View Doc</span>
                      </button>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {user.verifyStatus !== 'verified' && (
                          <button
                            onClick={() => handleVerify(user._id)}
                            disabled={processingUser === user._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:text-white hover:bg-green-600 border border-green-200 hover:border-green-600 rounded-lg transition-all duration-200 disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Verify</span>
                          </button>
                        )}
                        {user.verifyStatus !== 'rejected' && (
                          <button
                            onClick={() => handleReject(user._id)}
                            disabled={processingUser === user._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-lg transition-all duration-200 disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Reject</span>
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/user-detail/${user._id}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-white hover:bg-gray-600 border border-gray-200 hover:border-gray-600 rounded-lg transition-all duration-200"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document Modal */}
      {documentUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                User Document
              </h3>
              <button
                onClick={() => setDocumentUrl('')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <img
                src={documentUrl}
                alt="User Document"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setDocumentUrl('')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
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

  const currentStatus = status || 'pending';
  const statusConfig = config[currentStatus];

  return (
    <span className={`
      inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border
      ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}
    `}>
      {statusConfig.icon}
      {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
    </span>
  );
}