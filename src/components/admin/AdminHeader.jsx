import { Menu, User } from 'lucide-react';
import { getUser } from '../../utils/jwtUtils';
import NotificationCenter from '../shared/NotificationCenter';

export default function AdminHeader({ toggleSidebar }) {
    const user = getUser();
     
  return (
    <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-6 shadow-sm sticky top-0 z-10">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={toggleSidebar}
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 hidden sm:block">Manage your admin panel</p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">

        {/* Notifications */}
        <NotificationCenter/>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900"> {user.name}</p>
            <p className="text-xs text-gray-500"> {user.email}</p>
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <User size={16} className="text-blue-600" />
          </div>
        </div>
      </div>
    </header>
  );
}