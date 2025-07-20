import React from 'react';
import { Menu, LogOut, Home, Calendar, BarChart3, TestTube, ShoppingCart, Users, User, Shield, Settings } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ sidebarCollapsed, sidebarItems, className = "" }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Home', icon: Home, path: '/dashboard' },
    { label: 'Task Manager', icon: Calendar, path: '/taskboard' },
    { label: 'Field Manager', icon: BarChart3, path: '/field' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  // Admin menu items - only show if user is admin
  const adminMenuItems = [
    { label: 'Admin Dashboard', icon: Shield, path: '/admin' },
    { label: 'User Management', icon: Users, path: '/admin/users' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`shadow-lg transition-all duration-300 h-screen ${sidebarCollapsed ? 'w-20' : 'w-64'} ${className || 'bg-white'}`}>
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

          {/* Admin Section - only show if user is admin */}
          {user?.role === 'admin' && (
            <>
              <div className="pt-4 pb-2">
                {!sidebarCollapsed && (
                  <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin
                  </div>
                )}
              </div>
              {adminMenuItems.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <div
                    key={`admin-${index}`}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isActive 
                        ? 'bg-red-100 text-red-800 border-l-4 border-red-600' 
                        : 'hover:bg-red-50 text-gray-700'
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
            </>
          )}
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