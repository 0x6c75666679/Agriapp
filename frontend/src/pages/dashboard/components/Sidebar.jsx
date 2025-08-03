import React from 'react';
import { Menu, LogOut, Home, Calendar, BarChart3, Users, User, Shield, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ sidebarCollapsed, sidebarItems, className = "", isMobileOpen = false, setIsMobileOpen }) => {
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
    if (setIsMobileOpen) setIsMobileOpen(false); // Close drawer on mobile nav
  };

  const handleLogout = () => {
    logout();
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  // Sidebar classes for desktop and mobile drawer
  const sidebarBase = `shadow-lg transition-all duration-300 h-screen ${sidebarCollapsed ? 'w-20' : 'w-64'} ${className || 'bg-white'}`;
  const sidebarMobile = `fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`;
  const sidebarDesktop = `hidden md:block ${sidebarBase}`;

  return (
    <>
      {/* Mobile Drawer */}
      <div className={sidebarMobile} style={{ boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
        <div className="p-4 flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between mb-8">
            <div className="w-7 h-7 bg-[#34A853] rounded-lg flex items-center justify-center" style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px' }}>
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="md:hidden p-2 ml-2 rounded hover:bg-gray-200">
              <X className="w-6 h-6 text-gray-700" />
            </button>
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
                  <IconComponent className="w-7 h-7 transition-all duration-300" />
                  <span>{item.label}</span>
                </div>
              );
            })}
            {user?.role === 'admin' && (
              <>
                <div className="pt-4 pb-2">
                  <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</div>
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
                      <IconComponent className="w-7 h-7 transition-all duration-300" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </>
            )}
          </nav>
          <div className="mt-auto">
            <div
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-red-50 text-red-600 transition-colors"
            >
              <LogOut className="w-7 h-7 transition-all duration-300" />
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>
      {/* Desktop Sidebar */}
      <div className={sidebarDesktop}>
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
                  <IconComponent className="w-7 h-7 transition-all duration-300" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>
              );
            })}
            {user?.role === 'admin' && (
              <>
                <div className="pt-4 pb-2">
                  {!sidebarCollapsed && (
                    <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</div>
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
                      <IconComponent className="w-7 h-7 transition-all duration-300" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </div>
                  );
                })}
              </>
            )}
          </nav>
          <div className="mt-auto">
            <div
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-red-50 text-red-600 transition-colors"
            >
              <LogOut className="w-7 h-7 transition-all duration-300" />
              {!sidebarCollapsed && <span>Logout</span>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 