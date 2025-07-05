import React from 'react';
import { Menu } from 'lucide-react';

const Sidebar = ({ sidebarCollapsed, sidebarItems }) => {
  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-[#34A853] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {!sidebarCollapsed && <span className="font-bold text-xl text-gray-800">Agri App</span>}
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 text-gray-700"
            >
              <Menu className="w-5 h-5" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 