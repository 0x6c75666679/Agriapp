import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Register from './pages/usermanagment/Signup'
import { Toaster } from 'react-hot-toast';
import Login from './pages/usermanagment/Login';
import Dashboard from './pages/dashboard/page/Dasbboard';
import Forecast from './pages/dashboard/page/forecast';
import Taskboard from './pages/task/page/Taskboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import LandingPage from './components/LandingPage';
import { AuthProvider } from './contexts/AuthContext';
import FieldManagement from './pages/field/FieldManagement';
import Profile from './pages/profile/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          
          {/* Protected Routes */}
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path='/forecast' element={
            <ProtectedRoute>
              <Forecast />
            </ProtectedRoute>
          } />
          <Route path='/taskboard' element={
            <ProtectedRoute>
              <Taskboard />
            </ProtectedRoute>
          } />
          <Route path='/field' element={
            <ProtectedRoute>
              <FieldManagement />
            </ProtectedRoute>
          } />
          <Route path='/profile' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path='/admin' element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path='/admin/users' element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          } />
          
          {/* Landing page */}
          <Route path='/' element={<LandingPage />} />
          <Route path='*' element={<LandingPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App