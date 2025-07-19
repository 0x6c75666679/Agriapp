import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Activity, Database, Server, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, Globe } from 'lucide-react';
import Sidebar from '../dashboard/components/Sidebar';
import Header from '../dashboard/components/Header';
import { getAdminStats, getSiteStatus } from '../../api/adminApi';

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    newUsersThisMonth: 0
  });
  const [siteStatus, setSiteStatus] = useState({
    database: 'online',
    server: 'online',
    api: 'online',
    uptime: '99.9%',
    lastMaintenance: '2024-01-15'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsData, statusData] = await Promise.all([
          getAdminStats(),
          getSiteStatus()
        ]);
        setStats(statsData);
        setSiteStatus(statusData);
      } catch (err) {
        setError('Failed to load admin data');
        console.error('Admin data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'offline': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <Clock className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto"></div>
            <p className="mt-4 text-green-800">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-blue-50 relative">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-10 z-0" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="#34A853" />
          <circle cx="350" cy="350" r="60" fill="#60A5FA" />
          <rect x="200" y="50" width="120" height="120" rx="60" fill="#A7F3D0" />
        </svg>
      </div>
      
      <Sidebar sidebarCollapsed={sidebarCollapsed} className="bg-green-100 z-10" />
      
      <div className="flex-1 flex flex-col z-10">
        <Header sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} title="Admin Dashboard" className="bg-green-50" />
        
        <main className="flex-1 p-6 relative z-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

                    {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Total Users */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Users</p>
                  <p className="text-3xl font-bold text-green-800">{stats.totalUsers}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Users</p>
                  <p className="text-3xl font-bold text-green-800">{stats.activeUsers}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

 
          </div>

          {/* User Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Statistics
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Active Users</span>
                </div>
                <span className="text-2xl font-bold text-green-800">{stats.activeUsers}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <UserX className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Inactive Users</span>
                </div>
                <span className="text-2xl font-bold text-yellow-800">{stats.inactiveUsers}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">New This Month</span>
                </div>
                <span className="text-2xl font-bold text-blue-800">{stats.newUsersThisMonth}</span>
              </div>
            </div>
          </div>

          {/* Site Status */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
              <Server className="w-5 h-5" />
              Site Status
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Database Status */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">Database</span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(siteStatus.database)}`}>
                    {getStatusIcon(siteStatus.database)}
                    {siteStatus.database}
                  </div>
                </div>
                <p className="text-sm text-gray-600">Main data storage</p>
              </div>

              {/* Server Status */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">Server</span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(siteStatus.server)}`}>
                    {getStatusIcon(siteStatus.server)}
                    {siteStatus.server}
                  </div>
                </div>
                <p className="text-sm text-gray-600">Application server</p>
              </div>

              {/* API Status */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">API</span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(siteStatus.api)}`}>
                    {getStatusIcon(siteStatus.api)}
                    {siteStatus.api}
                  </div>
                </div>
                <p className="text-sm text-gray-600">REST API endpoints</p>
              </div>

              {/* Uptime */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">Uptime</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
                    <CheckCircle className="w-4 h-4" />
                    {siteStatus.uptime}
                  </div>
                </div>
                <p className="text-sm text-gray-600">System availability</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4" />
                <span>Last maintenance: {siteStatus.lastMaintenance}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 