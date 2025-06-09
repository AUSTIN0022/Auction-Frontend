// src/layouts/user/UserLayout.jsx
import {
    Bell,
    ChevronLeft,
    ChevronRight,
    Gavel,
    HelpCircle,
    Home,
    LogOut,
    Menu,
    User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/jwtUtils';

const UserLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  

  const user = getUser();
  
  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: Home,
      active: location.pathname === '/dashboard'
    },
    { 
      label: 'Auctions', 
      path: '/auctions', 
      icon: Gavel,
      active: location.pathname === '/auctions'
    },
    { 
      label: 'My Profile', 
      path: '#', 
      icon: User,
      active: false
    },
    { 
      label: 'Notifications', 
      path: '#', 
      icon: Bell,
      active: false
    },
    { 
      label: 'Help Center', 
      path: '#', 
      icon: HelpCircle,
      active: false
    },
  ];

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    localStorage.clear();
    navigate('/');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleNavigation = (href, event) => {
    // Prevent default link behavior
    event.preventDefault();
    
    // Don't navigate for placeholder links
    if (href === '#') return;
    
    // Navigate using React Router
    navigate(href);
    
    // Close mobile sidebar after navigation
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
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
                <h1 className="text-lg font-semibold text-gray-900">BidBazaar</h1>
                <p className="text-xs text-gray-500">User Panel</p>
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
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.path} className="relative group">
                <button
                  onClick={(e) => handleNavigation(item.path, e)}
                  disabled={item.path === '#'}
                  className={`w-full flex items-center gap-3 rounded-xl transition-all duration-200 ${
                    isCollapsed && !isMobile ? 'px-3 py-3 justify-center' : 'px-3 py-2.5'
                  } ${
                    item.active
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : item.path === '#' 
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-all duration-200 ${
                    item.active 
                      ? 'text-blue-600' 
                      : item.path === '#'
                        ? 'text-gray-400'
                        : 'text-gray-500 group-hover:text-gray-700'
                  } ${isCollapsed && !isMobile ? 'flex-shrink-0' : ''}`} />
                  
                  {(!isCollapsed || isMobile) && (
                    <>
                      <span className="font-medium text-sm text-left">{item.label}</span>
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
                    {item.label}
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

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${
        isCollapsed && !isMobile ? 'md:ml-16' : 'md:ml-64'
      }`}>
        {/* Header */}
        <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-6 shadow-sm sticky top-0 z-10">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={toggleMobileSidebar}
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">User Dashboard</h1>
              <p className="text-sm text-gray-500 hidden sm:block">Welcome to your auction portal</p>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500"> {user.email}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default UserLayout;