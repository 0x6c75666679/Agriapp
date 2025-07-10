import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Register from './pages/usermanagment/Signup'
import { Toaster } from 'react-hot-toast';
import Login from './pages/usermanagment/Login';
import Dashboard from './pages/dashboard/page/Dasbboard';
import Forecast from './pages/dashboard/page/forecast';
import Dashboardv2 from './pages/dashboard/page/dash_v2';
import Taskboard from './pages/task/page/Taskboard';
import Taskboardv2 from './pages/task/page/tasv2';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './components/LandingPage';
import { AuthProvider } from './contexts/AuthContext';
import FieldManagement from './pages/field/FieldManagement';

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
          <Route path='/dashboardv2' element={
            <ProtectedRoute>
              <Dashboardv2 />
            </ProtectedRoute>
          } />
          <Route path='/taskboard' element={
            <ProtectedRoute>
              <Taskboard />
            </ProtectedRoute>
          } />
          <Route path='/taskv2' element={
            <ProtectedRoute>
              <Taskboardv2 />
            </ProtectedRoute>
          } />
          <Route path='/field' element={
            <ProtectedRoute>
              <FieldManagement />
            </ProtectedRoute>
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