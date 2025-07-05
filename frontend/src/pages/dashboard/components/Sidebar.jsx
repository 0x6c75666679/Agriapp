import React from 'react';
import { Menu, LogOut, Home, Calendar, BarChart3, TestTube, ShoppingCart, Users, User } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ sidebarCollapsed, sidebarItems }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Home', icon: Home, path: '/dashboard' },
    { label: 'Task Manager', icon: Calendar, path: '/taskboard' },
    { label: 'Reports', icon: BarChart3, path: '/reports' },
    { label: 'Soil Testing', icon: TestTube, path: '/soil-testing' },
    { label: 'Marketplace', icon: ShoppingCart, path: '/marketplace' },
    { label: 'Community', icon: Users, path: '/community' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 h-screen ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center mb-8">
          <div className="w-7 h-7 bg-[#34A853] rounded-lg flex items-center justify-center" style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px' }}>
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {!sidebarCollapsed && <span className="font-bold text-xl text-gray-800 ml-3">Agri App</span>}
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <div
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  isActive 
                    ? 'bg-green-100 text-green-800 border-l-4 border-green-600' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <IconComponent 
                  className="w-7 h-7 transition-all duration-300"
                  style={{ 
                    width: '28px', 
                    height: '28px',
                    minWidth: '28px',
                    minHeight: '28px'
                  }}
                />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto">
          <div
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-red-50 text-red-600 transition-colors"
          >
            <LogOut 
              className="w-7 h-7 transition-all duration-300"
              style={{ 
                width: '28px', 
                height: '28px',
                minWidth: '28px',
                minHeight: '28px'
              }}
            />
            {!sidebarCollapsed && <span>Logout</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 