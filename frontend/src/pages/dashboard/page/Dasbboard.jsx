import React, { useEffect, useState } from 'react';
import { getWeatherData, generateWeatherNote } from '../../../api';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import WeatherCard from '../components/WeatherCard';
import MarketPricesCard from '../components/MarketPricesCard';
import TaskManagement from '../components/TaskManagement';



const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [weather, setWeather] = useState(null);
  const [aiWeatherNote, setAiWeatherNote] = useState('');
  const [isLoadingNote, setIsLoadingNote] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Irrigate South Field', 
      description: 'Corn field needs watering',
      completed: true, 
      priority: 'high',
      field: 'South Field',
      time: '09:00 AM',
      type: 'irrigation'
    },
    { 
      id: 4, 
      title: 'Harvest ready vegetables', 
      description: 'Tomatoes and peppers ready',
      completed: false, 
      priority: 'high',
      field: 'Garden Plot',
      time: '04:00 PM',
      type: 'harvesting'
    },
  ]);

  const sidebarItems = [
    { label: 'Tasks' },
    { label: 'Rentals' },
    { label: 'Reports' },
    { label: 'Soil Testing' },
    { label: 'Marketplace' },
    { label: 'Community' },
    { label: 'Settings' },
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoadingWeather(true);
        const weatherData = await getWeatherData("Kathmandu", 13);
        setWeather(weatherData);
        
        // Generate AI weather note
        generateAINote(weatherData);
      } catch (error) {
        console.error("Weather fetch error:", error);
        // You might want to show an error message to the user here
      } finally {
        setIsLoadingWeather(false);
      }
    };

    fetchWeather();
  }, []);

  const generateAINote = async (weatherData) => {
    if (!weatherData) return;
    
    setIsLoadingNote(true);
    try {
      const note = await generateWeatherNote(weatherData);
      setAiWeatherNote(note);
    } catch (error) {
      console.error('Error generating AI note:', error);
      // Fallback to default note will be handled in the API
    } finally {
      setIsLoadingNote(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Toaster />
      
      {/* Sidebar */}
      <Sidebar sidebarCollapsed={sidebarCollapsed} sidebarItems={sidebarItems} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <Header sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} title={"Dashboard"}/>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Top Row - Weather and Market Prices */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WeatherCard 
                weather={weather}
                isLoadingWeather={isLoadingWeather}
                aiWeatherNote={aiWeatherNote}
                isLoadingNote={isLoadingNote}
              />
            </div>

            {/* Right Side Cards */}
            <div className="space-y-4">
              <MarketPricesCard />
            </div>
          </div>

          {/* Task Management Section */}
          <TaskManagement tasks={tasks} setTasks={setTasks} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;