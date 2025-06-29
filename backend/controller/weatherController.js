const axios = require('axios');
const { getWeatherIconWithTime } = require('../utils/weatherIconMapper');
require('dotenv').config();

// Helper function to add AccuWeather icons to weather data
const addAccuWeatherIcons = (weatherData) => {
    if (!weatherData) return weatherData;
    
    // Add icon to current weather
    if (weatherData.current && weatherData.current.condition) {
        weatherData.current.accuWeatherIcon = getWeatherIconWithTime(
            weatherData.current.condition.text,
            weatherData.location?.localtime
        );
    }
    
    // Add icons to forecast days
    if (weatherData.forecast && weatherData.forecast.forecastday) {
        weatherData.forecast.forecastday.forEach(day => {
            if (day.day && day.day.condition) {
                day.day.accuWeatherIcon = getWeatherIconWithTime(
                    day.day.condition.text,
                    day.date
                );
            }
            
            // Add icons to hourly forecast
            if (day.hour) {
                day.hour.forEach(hour => {
                    if (hour.condition) {
                        hour.accuWeatherIcon = getWeatherIconWithTime(
                            hour.condition.text,
                            hour.time
                        );
                    }
                });
            }
        });
    }
    
    return weatherData;
};

// Weather API controller
const getWeatherData = async (req, res) => {
    try {
        const { city = "Kathmandu", hours = 15 } = req.query;
        const API_KEY = process.env.WEATHER_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ 
                error: "Weather API key not configured" 
            });
        }

        const response = await axios.get(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&hours=${hours}`
        );

        // Add AccuWeather icons to the response
        const weatherDataWithIcons = addAccuWeatherIcons(response.data);

        res.status(200).json({
            success: true,
            data: weatherDataWithIcons
        });

    } catch (error) {
        console.error('Weather API Error:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            return res.status(401).json({ 
                error: "Invalid API key" 
            });
        }
        
        if (error.response?.status === 400) {
            return res.status(400).json({ 
                error: "Invalid city name or parameters" 
            });
        }

        res.status(500).json({ 
            error: "Failed to fetch weather data" 
        });
    }
};

// Generate AI weather note (placeholder for now)
const generateWeatherNote = async (req, res) => {
    try {
        const { weatherData } = req.body;

        if (!weatherData) {
            return res.status(400).json({ 
                error: "Weather data is required" 
            });
        }

        // Extract weather information
        const condition = weatherData.current?.condition?.text || '';
        const temp = weatherData.current?.temp_c || 0;
        const humidity = weatherData.current?.humidity || 0;
        const windSpeed = weatherData.current?.wind_kph || 0;
        const precipitation = weatherData.current?.precip_mm || 0;

        // Generate AI weather note based on conditions
        let aiNote = '';
        const conditionLower = condition.toLowerCase();

        if (conditionLower.includes('rain') || precipitation > 5) {
            aiNote = `🌧️ Rain expected today with ${precipitation}mm precipitation. Consider postponing outdoor farming activities. Ensure proper drainage for fields and protect sensitive crops.`;
        } else if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
            aiNote = `☀️ Perfect sunny day with ${temp}°C! Excellent conditions for outdoor farming activities, crop growth, and photosynthesis. Consider irrigation if needed.`;
        } else if (conditionLower.includes('cloudy') || conditionLower.includes('partly cloudy')) {
            aiNote = `☁️ Cloudy conditions with moderate light. Good for sensitive plants that prefer indirect sunlight. Temperature at ${temp}°C is favorable for most crops.`;
        } else if (conditionLower.includes('overcast')) {
            aiNote = `⛅ Overcast skies may reduce sunlight intensity. Monitor crops for adequate light exposure. Temperature ${temp}°C is suitable for most agricultural activities.`;
        } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
            aiNote = `⛈️ Thunderstorm warning! Secure equipment, avoid outdoor activities, and protect livestock. High winds at ${windSpeed} km/h may damage crops.`;
        } else if (conditionLower.includes('snow')) {
            aiNote = `❄️ Snow expected. Protect sensitive crops with covers, ensure proper insulation for greenhouses, and avoid field work until conditions improve.`;
        } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
            aiNote = `🌫️ Foggy/misty conditions with ${humidity}% humidity. Reduced visibility - drive carefully to fields. High humidity is beneficial for certain crops.`;
        } else if (temp > 30) {
            aiNote = `🔥 High temperature alert: ${temp}°C. Ensure adequate irrigation, provide shade for sensitive crops, and avoid strenuous outdoor work during peak hours.`;
        } else if (temp < 5) {
            aiNote = `❄️ Low temperature: ${temp}°C. Protect frost-sensitive crops, consider greenhouse heating, and delay planting of warm-season crops.`;
        } else {
            aiNote = `🌤️ ${condition} with ${temp}°C. Moderate conditions suitable for most farming activities. Monitor local conditions for optimal crop management.`;
        }

        // Add farming recommendations based on weather
        if (humidity > 80) {
            aiNote += ' High humidity may increase disease risk - monitor crops for fungal issues.';
        }
        
        if (windSpeed > 20) {
            aiNote += ' Strong winds may damage crops - secure structures and protect young plants.';
        }

        res.status(200).json({
            success: true,
            note: aiNote
        });

    } catch (error) {
        console.error('AI Note Generation Error:', error);
        res.status(500).json({ 
            error: "Failed to generate weather note" 
        });
    }
};

// Get weather forecast for multiple days
const getWeatherForecast = async (req, res) => {
    try {
        const { city = "Kathmandu", days = 7 } = req.query;
        const API_KEY = process.env.WEATHER_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ 
                error: "Weather API key not configured" 
            });
        }

        const response = await axios.get(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=${days}`
        );

        // Add AccuWeather icons to the response
        const weatherDataWithIcons = addAccuWeatherIcons(response.data);

        res.status(200).json({
            success: true,
            data: weatherDataWithIcons
        });

    } catch (error) {
        console.error('Weather Forecast Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: "Failed to fetch weather forecast" 
        });
    }
};

// Get current weather only
const getCurrentWeather = async (req, res) => {
    try {
        const { city = "Kathmandu" } = req.query;
        const API_KEY = process.env.WEATHER_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ 
                error: "Weather API key not configured" 
            });
        }

        const response = await axios.get(
            `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
        );

        // Add AccuWeather icons to the response
        const weatherDataWithIcons = addAccuWeatherIcons(response.data);

        res.status(200).json({
            success: true,
            data: weatherDataWithIcons
        });

    } catch (error) {
        console.error('Current Weather Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: "Failed to fetch current weather" 
        });
    }
};

module.exports = {
    getWeatherData,
    generateWeatherNote,
    getWeatherForecast,
    getCurrentWeather
};