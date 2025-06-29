import React, { useEffect, useState } from "react";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [error, setError] = useState(null);

  // Fetch weather data on mount
  useEffect(() => {
    const API_KEY = pro
    const CITY = "Kathmandu";

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${CITY}&days=7`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch forecast.");
        return res.json();
      })
      .then((data) => {
        setWeather(data);
        updateTime(); // Set initial time
      })
      .catch((err) => setError(err.message));
  }, []);

  // Update local time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      updateTime();
    }, 60000); // 60 seconds

    return () => clearInterval(interval); // Clean up
  }, []);

  const updateTime = () => {
    // Kathmandu time (UTC+5:45)
    const now = new Date();
    const kathmanduTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kathmandu" }));
    setCurrentTime(kathmanduTime.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }));
  };

  if (error) return <div className="text-red-500 mt-10 text-center">{error}</div>;
  if (!weather || !currentTime) return <div className="text-gray-500 mt-10 text-center">Loading...</div>;

  const { location, current, forecast } = weather;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-blueblue-700 text-white p-4">
      {/* Current Weather */}
      <div className="max-w-xl mx-auto mb-8 p-6 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl text-center">
        <h2 className="text-2xl font-bold">{location.name}, {location.country}</h2>
        <div className="text-sm text-white/80 mb-2">🕒 {currentTime}</div>
        <img src={`https:${current.condition.icon}`} alt={current.condition.text} className="mx-auto w-24 h-24" />
        <div className="text-5xl font-semibold">{current.temp_c}°C</div>
        <div className="text-xl">{current.condition.text}</div>
        <div className="mt-4 flex justify-around text-sm">
          <span>💧 {current.humidity}%</span>
          <span>🌬 {current.wind_kph} km/h</span>
          <span>🔆 UV: {current.uv}</span>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {forecast.forecastday.map((day) => (
          <div
            key={day.date}
            className="bg-white/20 backdrop-blur-md rounded-xl p-4 shadow flex flex-col items-center"
          >
            <div className="font-bold">{new Date(day.date).toLocaleDateString("en-US", { weekday: 'short' })}</div>
            <img src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} className="w-14 h-14" />
            <div className="text-lg">{day.day.avgtemp_c}°C</div>
            <div className="text-sm text-white/80 text-center">{day.day.condition.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
