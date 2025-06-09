// src/components/admin/AdminSidebar.jsx
import {
    ChevronLeft,
    ChevronRight,
    CreditCard,
    FileText,
    Gavel,
    HelpCircle,
    LayoutDashboard,
    LogOut,
    Settings,
    UserCheck,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';

export default function AdminSidebar({ isOpen, onClose, onCollapseChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to Logout?')) return;
    await logout();
    localStorage.clear();
    navigate('/login');
  };

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  };

  const handleNavigation = (href, event) => {
    // Prevent default link behavior
    event.preventDefault();
    
    // Don't navigate for placeholder links
    if (href === '#') return;
    
    // Navigate using React Router
    navigate(href);
    
    // Close mobile sidebar after navigation
    if (isMobile && onClose) {
      onClose();
    }
  };

  const menuItems = [
    { 
      name: 'Dashboard', 
      href: '/admin-dashboard', 
      icon: LayoutDashboard, 
      active: location.pathname === '/admin-dashboard'
    },
    { 
      name: 'User Verification', 
      href: '/user-verification', 
      icon: UserCheck, 
      active: location.pathname === '/user-verification'
    },
    { 
      name: 'User Management', 
      href: '#', 
      icon: Users, 
      active: false 
    },
    { 
      name: 'Auctions', 
      href: '/view-auctions', 
      icon: Gavel, 
      active: location.pathname === '/view-auctions'
    },
    { 
      name: 'Transactions', 
      href: '#', 
      icon: CreditCard, 
      active: false 
    },
    { 
      name: 'Reports', 
      href: '#', 
      icon: FileText, 
      active: false 
    },
    { 
      name: 'Settings', 
      href: '#', 
      icon: Settings, 
      active: false 
    },
    { 
      name: 'Support Tickets', 
      href: '#', 
      icon: HelpCircle, 
      active: false 
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed && !isMobile ? 'w-16' : 'w-64'}`}
      >
        {/* Header */}
        <div className={`relative border-b border-gray-100 ${
          isCollapsed && !isMobile ? 'p-3' : 'p-6'
        }`}>
          {isCollapsed && !isMobile ? (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Gavel className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Gavel className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
          )}
          
          {/* Toggle button - hidden on mobile */}
          <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 hover:bg-gray-50 p-1.5 rounded-full transition-colors shadow-sm hidden md:flex items-center justify-center"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3 text-gray-600" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${isCollapsed && !isMobile ? 'p-2' : 'p-4'} space-y-1`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="relative group">
                <button
                  onClick={(e) => handleNavigation(item.href, e)}
                  disabled={item.href === '#'}
                  className={`w-full flex items-center gap-3 rounded-xl transition-all duration-200 ${
                    isCollapsed && !isMobile ? 'px-3 py-3 justify-center' : 'px-3 py-2.5'
                  } ${
                    item.active
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : item.href === '#' 
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-all duration-200 ${
                    item.active 
                      ? 'text-blue-600' 
                      : item.href === '#'
                        ? 'text-gray-400'
                        : 'text-gray-500 group-hover:text-gray-700'
                  } ${isCollapsed && !isMobile ? 'flex-shrink-0' : ''}`} />
                  
                  {(!isCollapsed || isMobile) && (
                    <>
                      <span className="font-medium text-sm text-left">{item.name}</span>
                      {/* Active indicator */}
                      {item.active && (
                        <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                    </>
                  )}
                </button>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && !isMobile && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50">
                    {item.name}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className={`border-t border-gray-100 ${isCollapsed && !isMobile ? 'p-2' : 'p-4'}`}>
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 ${
                isCollapsed && !isMobile ? 'px-3 py-3 justify-center' : 'px-3 py-2.5'
              }`}
            >
              <LogOut className="w-5 h-5 transition-all duration-200" />
              {(!isCollapsed || isMobile) && <span className="font-medium text-sm">Logout</span>}
            </button>
            
            {/* Tooltip for collapsed logout */}
            {isCollapsed && !isMobile && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50">
                Logout
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}