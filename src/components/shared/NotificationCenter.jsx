import { Bell, Clock, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getAllNotifications } from '../../services/notification';
import { getUser } from '../../utils/jwtUtils';
import { getNotificationBg, getNotificationIcon } from '../../utils/notificationUtils';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const intervalRef = useRef(null);

  const user = getUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications immediately when component mounts and set up polling
  useEffect(() => {
    if (user?.id) {
      // Initial fetch
      fetchNotifications();
      
      // Set up polling every 30 seconds for real-time updates
      intervalRef.current = setInterval(() => {
        fetchNotifications(true); // Pass true for silent fetch (no loading state)
      }, 15000);
    }

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user?.id]);

  const fetchNotifications = async (silent = false) => {
    if (!user?.id) return;
    
    if (!silent) setLoading(true);
    
    try {
      const response = await getAllNotifications(user.id);
      const notificationsList = response.data.notifications || [];
      setNotifications(notificationsList);
      
      // Calculate unread count based on status
      const unreadNotifications = notificationsList.filter(n => n.status !== 'read');
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      if (!silent) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Manual refresh function (can be called when user clicks the bell)
  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const toggleDropdown = async () => {
    if (!isOpen) {
      // Refresh notifications when opening the dropdown
      await refreshNotifications();
    }
    setIsOpen(!isOpen);
  };

  const markAsRead = async (notificationId) => {
    // This would typically make an API call to mark as read
    // For now, we'll update the local state
    setNotifications(prev => 
      prev.map(notif => 
        notif._id === notificationId 
          ? { ...notif, status: 'read' }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Here you would make an API call:
    // try {
    //   await markNotificationAsRead(notificationId);
    // } catch (error) {
    //   console.error('Failed to mark notification as read:', error);
    // }
  };

  const clearAll = async () => {
    // This would typically make an API call to clear all notifications
    setNotifications([]);
    setUnreadCount(0);
    
    // Here you would make an API call:
    // try {
    //   await clearAllNotifications(user.id);
    // } catch (error) {
    //   console.error('Failed to clear notifications:', error);
    // }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, status: 'read' }))
    );
    setUnreadCount(0);
    
    // Here you would make an API call:
    // try {
    //   await markAllNotificationsAsRead(user.id);
    // } catch (error) {
    //   console.error('Failed to mark all as read:', error);
    // }
  };

  // Don't render if user is not logged in
  if (!user?.id) {
    return null;
  }

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button 
        ref={buttonRef}
        onClick={toggleDropdown}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell size={18} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No notifications yet</p>
                <p className="text-gray-400 text-sm">We'll notify you when something happens</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      notification.status === 'read' ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Unread indicator */}
                      {notification.status !== 'read' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      )}
                      
                      {/* Icon */}
                      <div className={`flex-shrink-0 p-2 rounded-lg ${getNotificationBg(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          {notification.status !== 'read' && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-100 p-3">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;