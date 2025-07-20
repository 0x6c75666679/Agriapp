import React, { useEffect, useState } from 'react';
import { getWeatherData, generateWeatherNote } from '../../../api';
import { getTasks } from '../../../api/taskApi';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import WeatherCard from '../components/WeatherCard';
import MarketPricesCard from '../components/MarketPricesCard';
import TaskManagement from '../components/TaskManagement';
import { taskEventEmitter } from '../../../utils/taskEventEmitter';



const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [weather, setWeather] = useState(null);
  const [aiWeatherNote, setAiWeatherNote] = useState('');
  const [isLoadingNote, setIsLoadingNote] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Remove sidebarItems array and references to unimplemented features

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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoadingTasks(true);
        const taskData = await getTasks();
        setTasks(taskData);
      } catch (error) {
        console.error("Task fetch error:", error);
        setTasks([]); // Set empty array if API fails
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();

    // Subscribe to task refresh events
    const unsubscribe = taskEventEmitter.subscribe(() => {
      fetchTasks();
    });

    // Cleanup subscription on unmount
    return unsubscribe;
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex">
      <Toaster />
      
      {/* Sidebar */}
      <Sidebar sidebarCollapsed={sidebarCollapsed} sidebarItems={[]} className="bg-green-100" />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <Header sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} title={"Dashboard"} className="bg-green-50"/>

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
          <div className="mb-10">
            <TaskManagement tasks={tasks} setTasks={setTasks} loading={loadingTasks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;