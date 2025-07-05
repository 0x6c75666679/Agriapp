import React, { useEffect, useState } from "react";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // 👈 load key from .env
    const CITY = "Kathmandu";

    fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${CITY}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch weather data.");
        return res.json();
      })
      .then((data) => {
        setWeather(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="text-red-500 mt-10 text-center">{error}</div>;
  if (!weather) return <div className="text-gray-500 mt-10 text-center">Loading...</div>;

  const current = weather.current;
  const location = weather.location;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-300 to-blue-600 flex items-center justify-center p-4">
      <div className="w-80 p-6 rounded-2xl shadow-2xl bg-white/20 backdrop-blur-md text-white flex flex-col items-center space-y-4">
        <h2 className="text-2xl font-bold">{location.name}, {location.country}</h2>
        <div className="text-sm text-white/80">{location.localtime}</div>

        <img
          src={`https:${current.condition.icon}`}
          alt={current.condition.text}
          className="w-24 h-24"
        />

        <div className="text-5xl font-semibold">{current.temp_c}°C</div>
        <div className="text-xl">{current.condition.text}</div>

        <div className="mt-4 w-full flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span>🌡 Feels Like:</span>
            <span>{current.feelslike_c}°C</span>
          </div>
          <div className="flex justify-between">
            <span>💧 Humidity:</span>
            <span>{current.humidity}%</span>
          </div>
          <div className="flex justify-between">
            <span>🌬 Wind:</span>
            <span>{current.wind_kph} km/h</span>
          </div>
          <div className="flex justify-between">
            <span>🔆 UV Index:</span>
            <span>{current.uv}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
