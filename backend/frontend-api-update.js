// Updated API functions for your frontend
// Replace your current api.js file with these functions

const API_BASE_URL = 'http://localhost:9696/api';

// Helper function to get JWT token
const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// Weather API functions
export const getWeatherData = async (city = "Kathmandu", hours = 13) => {
  const response = await apiRequest(`/weather/data?city=${encodeURIComponent(city)}&hours=${hours}`);
  return response.data;
};

export const getCurrentWeather = async (city = "Kathmandu") => {
  const response = await apiRequest(`/weather/current?city=${encodeURIComponent(city)}`);
  return response.data;
};

export const getWeatherForecast = async (city = "Kathmandu", days = 7) => {
  const response = await apiRequest(`/weather/forecast?city=${encodeURIComponent(city)}&days=${days}`);
  return response.data;
};

export const generateWeatherNote = async (weatherData) => {
  const response = await apiRequest('/weather/generate-note', {
    method: 'POST',
    body: JSON.stringify({ weatherData })
  });
  return response.note;
};

// User API functions (if you need them)
export const login = async (email, password) => {
  const response = await apiRequest('/user/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return response;
};

export const register = async (username, email, password, role = 'user') => {
  const response = await apiRequest('/user/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password, role })
  });
  return response;
};

export const getUserProfile = async () => {
  const response = await apiRequest('/user/profile');
  return response.user;
};

export const uploadProfilePicture = async (file) => {
  const token = getToken();
  const formData = new FormData();
  formData.append('profilePicture', file);

  const response = await fetch(`${API_BASE_URL}/user/uploadProfilePicture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return response.json();
};

// Updated Dashboard component usage example:
/*
import React, { useEffect, useState } from 'react';
import { getWeatherData, generateWeatherNote } from './api';

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [aiWeatherNote, setAiWeatherNote] = useState('');
  const [isLoadingNote, setIsLoadingNote] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherData = await getWeatherData("Kathmandu", 13);
        setWeather(weatherData);
        
        // Generate AI note
        generateAINote(weatherData);
      } catch (error) {
        console.error('Weather fetch error:', error);
      }
    };

    fetchWeather();
  }, []);

  const generateAINote = async (weatherData) => {
    setIsLoadingNote(true);
    try {
      const note = await generateWeatherNote(weatherData);
      setAiWeatherNote(note);
    } catch (error) {
      console.error('Error generating AI note:', error);
    } finally {
      setIsLoadingNote(false);
    }
  };

  // Rest of your component remains the same...
};
*/ 