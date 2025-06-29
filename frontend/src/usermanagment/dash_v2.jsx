import React, { useEffect, useState } from 'react';
import {
  Search,
  ChevronRight,
  Menu,
  User
} from 'lucide-react';
import { getWeatherData, generateWeatherNote } from '../api/api';

const conditionToAccuIcon = {
  "Sunny": 1,
  "Mostly Sunny": 2,
  "Partly Sunny": 3,
  "Intermittent Clouds": 4,
  "Hazy Sunshine": 5,
  "Mostly Cloudy": 6,
  "Cloudy": 7,
  "Dreary (Overcast)": 8,
  "Fog": 11,
  "Showers": 12,
  "Mostly Cloudy w/ Showers": 13,
  "Partly Sunny w/ Showers": 14,
  "Thunderstorms": 15,
  "Mostly Cloudy w/ T-Storms": 16,
  "Partly Sunny w/ T-Storms": 17,
  "Rain": 18,
  "Flurries": 19,
  "Mostly Cloudy w/ Flurries": 20,
  "Partly Sunny w/ Flurries": 21,
  "Snow": 22,
  "Mostly Cloudy w/ Snow": 23,
  "Ice": 24,
  "Sleet": 25,
  "Freezing Rain": 26,
  "Rain and Snow": 29,
  "Hot": 30,
  "Cold": 31,
  "Windy": 32,
  "Clear": 33,
  "Mostly Clear": 34,
  "Partly Cloudy": 35,
  "Intermittent Clouds (Night)": 36,
  "Hazy Moonlight": 37,
  "Mostly Cloudy (Night)": 38,
  "Partly Cloudy w/ Showers": 39,
  "Mostly Cloudy w/ Showers (Night)": 40,
  "Partly Cloudy w/ T-Storms": 41,
  "Mostly Cloudy w/ T-Storms (Night)": 42,
  "Mostly Cloudy w/ Flurries (Night)": 43,
  "Mostly Cloudy w/ Snow (Night)": 44,
  // Additional mappings for WeatherAPI conditions
  "Partly cloudy": 3,
  "Overcast": 8,
  "Mist": 11,
  "Patchy rain possible": 12,
  "Patchy snow possible": 22,
  "Patchy sleet possible": 25,
  "Patchy freezing drizzle possible": 26,
  "Thundery outbreaks possible": 15,
  "Blowing snow": 25,
  "Blizzard": 25,
  "Foggy": 11,
  "Freezing fog": 11,
  "Patchy light drizzle": 17,
  "Light drizzle": 17,
  "Freezing drizzle": 26,
  "Heavy freezing drizzle": 26,
  "Patchy light rain": 18,
  "Light rain": 18,
  "Moderate rain at times": 18,
  "Moderate rain": 18,
  "Heavy rain at times": 19,
  "Heavy rain": 19,
  "Light freezing rain": 26,
  "Moderate or heavy freezing rain": 26,
  "Light sleet": 25,
  "Moderate or heavy sleet": 25,
  "Patchy light snow": 22,
  "Light snow": 22,
  "Patchy moderate snow": 22,
  "Moderate snow": 22,
  "Patchy heavy snow": 25,
  "Heavy snow": 25,
  "Ice pellets": 24,
  "Light rain shower": 12,
  "Moderate or heavy rain shower": 12,
  "Torrential rain shower": 19,
  "Light sleet showers": 25,
  "Moderate or heavy sleet showers": 25,
  "Light snow showers": 22,
  "Moderate or heavy snow showers": 25,
  "Light showers of ice pellets": 24,
  "Moderate or heavy showers of ice pellets": 24,
  "Patchy light rain with thunder": 15,
  "Moderate or heavy rain with thunder": 15,
  "Patchy light snow with thunder": 15,
  "Moderate or heavy snow with thunder": 15
};

// Helper function to get AccuWeather icon URL
const getAccuWeatherIcon = (condition, localtime) => {
  if (!condition) return 'https://www.accuweather.com/images/weathericons/1.svg';
  
  // Check if it's night time (between 6 PM and 6 AM)
  const isNight = localtime ? (() => {
    const hour = new Date(localtime).getHours();
    return hour < 6 || hour >= 18;
  })() : false;
  
  // Try exact match first
  if (conditionToAccuIcon[condition]) {
    const iconNumber = conditionToAccuIcon[condition];
    return `https://www.accuweather.com/images/weathericons/${iconNumber}.svg`;
  }
  
  // Try partial matches for common conditions
  const conditionLower = condition.toLowerCase();
  
  if (isNight) {
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return 'https://www.accuweather.com/images/weathericons/33.svg';
    }
    if (conditionLower.includes('partly cloudy')) {
      return 'https://www.accuweather.com/images/weathericons/35.svg';
    }
    if (conditionLower.includes('mostly cloudy') || conditionLower.includes('cloudy')) {
      return 'https://www.accuweather.com/images/weathericons/38.svg';
    }
  }
  
  // Day conditions
  if (conditionLower.includes('rain')) {
    if (conditionLower.includes('heavy') || conditionLower.includes('torrential')) {
      return 'https://www.accuweather.com/images/weathericons/19.svg';
    }
    return 'https://www.accuweather.com/images/weathericons/18.svg';
  }
  
  if (conditionLower.includes('snow')) {
    if (conditionLower.includes('heavy') || conditionLower.includes('blizzard')) {
      return 'https://www.accuweather.com/images/weathericons/25.svg';
    }
    return 'https://www.accuweather.com/images/weathericons/22.svg';
  }
  
  if (conditionLower.includes('thunder')) {
    return 'https://www.accuweather.com/images/weathericons/15.svg';
  }
  
  if (conditionLower.includes('cloud')) {
    if (conditionLower.includes('partly')) {
      return 'https://www.accuweather.com/images/weathericons/3.svg';
    }
    if (conditionLower.includes('mostly')) {
      return 'https://www.accuweather.com/images/weathericons/6.svg';
    }
    return 'https://www.accuweather.com/images/weathericons/7.svg';
  }
  
  if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return 'https://www.accuweather.com/images/weathericons/11.svg';
  }
  
  if (conditionLower.includes('sleet') || conditionLower.includes('freezing')) {
    return 'https://www.accuweather.com/images/weathericons/25.svg';
  }
  
  // Default sunny icon
  return 'https://www.accuweather.com/images/weathericons/1.svg';
};

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [weather, setWeather] = useState(null);
  const [aiWeatherNote, setAiWeatherNote] = useState('');
  const [isLoadingNote, setIsLoadingNote] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  const sidebarItems = [
    { label: 'My Fields' },
    { label: 'Tasks' },
    { label: 'Rentals' },
    { label: 'Reports' },
    { label: 'Soil Testing' },
    { label: 'Marketplace' },
    { label: 'Community' },
    { label: 'Settings' },
  ];

  const tasks = [
    { id: 1, title: 'Today Irrigation', completed: true },
    { id: 2, title: 'Set up irrigation system', completed: false },
  ];

  const fieldData = [
    { label: 'Cumulative Height (cm)', value: 5, color: 'bg-blue-500' },
    { label: 'Cumulative Biomass (kg/ha)', value: 3, color: 'bg-green-500' },
    { label: 'Cumulative Leaf Area Index (LAI)', value: 2, color: 'bg-yellow-500' },
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
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-[#34A853] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            {!sidebarCollapsed && <span className="font-bold text-xl text-gray-800">Agri App</span>}
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 text-gray-700"
              >
                <Menu className="w-5 h-5" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-700"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>☀️ 25°</span>
              <span>Today is partly sunny day!</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input className="pl-10 w-64 p-2 border border-gray-200 rounded-lg bg-gray-50" placeholder="Search" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#A78B61] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm text-gray-800">
                <div className="font-medium">Hi John Doe</div>
                <div className="text-gray-600">johndoe@email.com</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Top Row - Weather Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-[#60A5FA] to-[#6366F1] rounded-lg shadow-md h-96 p-6 text-white flex flex-col justify-between">
                {isLoadingWeather ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <span className="ml-3 text-lg">Loading weather data...</span>
                  </div>
                ) : weather ? (
                  <>
                    <div className="flex items-center justify-start h-full px-2">
                      {/* Weather Icon - Left Side */}
                      <div className="flex flex-col items-start">
                        <img 
                          src={getAccuWeatherIcon(weather.current.condition.text, weather.location.localtime)} 
                          alt="weather icon" 
                          className="w-48 h-48 mb-4 bg-transparent filter brightness-0 invert" 
                        />
                      </div>
                      
                      {/* Weather Data - Center */}
                      <div className="flex flex-col items-center ml-12">
                        <p className="text-7xl font-bold mb-4 font-serif">{weather.current.temp_c}°C</p>
                        <h2 className="text-3xl font-semibold mb-2 font-mono">{weather.location.name}</h2>
                        <p className="text-lg opacity-90 mb-1 font-sans">
                          {new Date(weather.location.localtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <div className="flex items-center space-x-4 text-lg font-medium">
                          <span>H: {Math.round(weather.forecast.forecastday[0].day.maxtemp_c)}°</span>
                          <span>L: {Math.round(weather.forecast.forecastday[0].day.mintemp_c)}°</span>
                        </div>
                      </div>
                      
                      {/* Weather Note - Right Side */}
                      <div className="flex flex-col items-start text-left flex-1 ml-20 mr-4">
                        <div className="bg-white/20 rounded-lg p-6 w-full">
                          <h3 className="text-sm font-medium mb-3 text-white">Weather Note</h3>
                          <p className="text-sm text-white leading-relaxed">
                            {isLoadingNote ? (
                              <span className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Generating AI weather advice...
                              </span>
                            ) : aiWeatherNote ? (
                              aiWeatherNote
                            ) : (
                              // Fallback to default weather notes
                              (() => {
                                const condition = weather?.current?.condition?.text || '';
                                const conditionLower = condition.toLowerCase();
                                
                                if (conditionLower.includes('rain')) {
                                  return '🌧️ Expect rain today. Consider postponing outdoor activities and ensure proper drainage for fields.';
                                } else if (conditionLower.includes('sunny')) {
                                  return '☀️ Perfect sunny day! Great for outdoor farming activities and crop growth.';
                                } else if (conditionLower.includes('cloudy')) {
                                  return '☁️ Cloudy conditions today. Moderate light for crops, good for sensitive plants.';
                                } else if (conditionLower.includes('overcast')) {
                                  return '⛅ Overcast skies. Reduced sunlight may affect photosynthesis slightly.';
                                } else if (conditionLower.includes('thunder')) {
                                  return '⛈️ Thunderstorm warning! Secure equipment and avoid outdoor activities.';
                                } else if (conditionLower.includes('snow')) {
                                  return '❄️ Snow expected. Protect sensitive crops and ensure proper insulation.';
                                } else if (conditionLower.includes('fog')) {
                                  return '🌫️ Foggy conditions. Reduced visibility, drive carefully to fields.';
                                } else if (conditionLower.includes('mist')) {
                                  return '🌫️ Misty weather. High humidity good for certain crops.';
                                } else {
                                  return `🌤️ ${condition}. Check local conditions for farming activities.`;
                                }
                              })()
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex overflow-x-auto space-x-4 bg-white/20 rounded-xl p-3">
                        {weather.forecast.forecastday[0].hour
                          .slice(new Date().getHours(), new Date().getHours() + 13)
                          .map((hour, idx) => (
                            <div key={idx} className="min-w-[60px] text-center">
                              <p className="text-xs font-semibold">{new Date(hour.time).getHours()}</p>
                              <img 
                                src={getAccuWeatherIcon(hour.condition.text, hour.time)} 
                                className="w-8 h-8 mx-auto my-1 filter brightness-0 invert" 
                                alt="hourly weather" 
                              />
                              <p className="text-sm font-medium">{Math.round(hour.temp_c)}°</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-lg">Failed to load weather data</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Cards */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#34A853] to-[#22C55E] text-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Fields Overview</h3>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold mb-1">Good</div>
                <div className="text-sm opacity-80">Overall field condition</div>
              </div>
              <div className="bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Expenses</h3>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold mb-1">$3,134.00</div>
                <div className="text-sm opacity-80">+12% vs last month</div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Tasks and Forecast Growth */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Tasks</h3>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">90% Completed</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-800">90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#34A853] h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-gray-800">Upcoming Tasks</h4>
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} className="flex items-start space-x-3">
                      <div className={`w-4 h-4 rounded border-2 mt-1 ${
                        task.completed ? 'bg-[#34A853] border-[#34A853]' : 'border-gray-300'
                      }`}>
                        {task.completed && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Weather Forecast</h3>
                <select className="text-sm border rounded px-2 py-1 bg-gray-50">
                  <option>Days</option>
                  <option>Weeks</option>
                  <option>Months</option>
                </select>
              </div>
              <div className="space-y-4 mb-6">
                {fieldData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className="text-sm font-medium text-gray-800">{item.value}cm</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${(item.value / 10) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-32 bg-gradient-to-r from-[#60A5FA]/10 to-[#6366F1]/10 rounded-lg p-4 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="text-sm">Growth Chart</div>
                  <div className="text-xs">Visual growth data would appear here</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;