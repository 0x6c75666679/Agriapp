import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUserAPI, createUserAPI, getUserProfile } from '../api/userApi';
import { getToken } from '../api/apiHelpers';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = getToken();
      
      if (token) {
        try {
          const userData = await getUserProfile();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Clear invalid token
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email, password });
      const response = await loginUserAPI({ email, password });
      console.log('Login response:', response);
      
      // Check if response has data property
      const responseData = response.data || response;
      console.log('Response data:', responseData);
      
      if (responseData.success || responseData.token || responseData.accessToken) {
        // Store token - check different possible token fields
        const token = responseData.token || responseData.accessToken || responseData.jwt;
        console.log('Token found:', token);
        
        if (token) {
          localStorage.setItem('token', token);
          console.log('Token stored in localStorage');
        }
        
        // Set user data - check different possible user fields
        const userData = responseData.user || responseData.data || responseData;
        console.log('User data:', userData);
        setUser(userData);
        
        toast.success('Login successful!');
        console.log('Navigating to dashboard...');
        
        // Try multiple navigation methods
        try {
          navigate('/dashboard');
          console.log('Navigation successful');
        } catch (navError) {
          console.error('Navigation error:', navError);
          // Fallback to window.location
          window.location.href = '/dashboard';
        }
        
        return { success: true };
      } else {
        const errorMsg = responseData.message || 'Login failed';
        console.log('Login failed:', errorMsg);
        toast.error(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await createUserAPI(userData);
      
      if (response.data.success) {
        toast.success('Registration successful! Please log in with your credentials.');
        navigate('/login');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Registration failed');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 