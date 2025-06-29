import  { useEffect, useState } from 'react';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const useWeather = () => {
    const API_KEY = import.meta.env.WEATHER_API_KEY;
    const CITY = "Kathmandu";
    const HOURS = 13;
    const [weatherNote, setWeatherNote] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchWeather = async () => {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${CITY}&hours=${HOURS}`);
            const data = await response.json();
            setWeather(data);
            setWeatherNote(data);
        } catch (error) {
            console.error("Weather fetch error:", error);
        }
    };

    fetchWeather();
  }, []);

  return { weather, weatherNote, loading, error };
};