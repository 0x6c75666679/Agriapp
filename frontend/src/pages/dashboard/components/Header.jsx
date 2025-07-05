import React from 'react';
import { Search, ChevronRight, User } from 'lucide-react';

const Header = ({ sidebarCollapsed, setSidebarCollapsed, title }) => {
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

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input className="pl-10 w-64 p-2 border border-gray-200 rounded-lg bg-gray-50" placeholder="Search" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#A78B61] rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm text-gray-800">
            <div className="font-medium">Hi John Doe</div>
            <div className="text-gray-600">johndoe@email.com</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 