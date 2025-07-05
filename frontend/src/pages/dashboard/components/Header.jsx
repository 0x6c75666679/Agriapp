import React, { useContext } from 'react';
import { ChevronRight, User } from 'lucide-react';
import { AuthContext } from '../../../contexts/AuthContext';

const Header = ({ sidebarCollapsed, setSidebarCollapsed, title }) => {
  const { user, loading } = useContext(AuthContext);
  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-700"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>
        {title && (
          <span className="text-lg font-bold text-gray-800">{title}</span>
        )}
      </div>

      <div className="flex items-center justify-end flex-1">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#A78B61] rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm text-gray-800">
            <div className="font-medium">
              {loading ? 'Loading...' : `Hi ${user?.name || user?.username || 'User'}`}
            </div>
            <div className="text-gray-600">
              {loading ? 'Loading...' : (user?.email || 'user@email.com')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 