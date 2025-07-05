import React from 'react';
import { getAccuWeatherIcon } from './../utils/weatherUtils';


const WeatherCard = ({ weather, isLoadingWeather, aiWeatherNote }) => {
  return (
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
                  {aiWeatherNote}
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
  );
};

export default WeatherCard; 