# Weather API Documentation

## Overview
This API acts as a middleware between your frontend and the WeatherAPI.com service to protect your API key. All endpoints require JWT authentication.

## Base URL
```
http://localhost:9696/api/weather
```

## Authentication
All endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

## Environment Variables
Add your WeatherAPI.com key to your `.env` file:
```
WEATHER_API_KEY=your_weather_api_key_here
```

## Endpoints

### 1. Get Current Weather
**GET** `/api/weather/current`

**Query Parameters:**
- `city` (optional): City name (default: "Kathmandu")

**Example Request:**
```bash
curl -X GET "http://localhost:9696/api/weather/current?city=London" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "location": {
      "name": "London",
      "region": "City of London, Greater London",
      "country": "United Kingdom",
      "lat": 51.52,
      "lon": -0.11,
      "localtime": "2024-01-01 12:00"
    },
    "current": {
      "temp_c": 15,
      "condition": {
        "text": "Partly cloudy",
        "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png"
      },
      "humidity": 65,
      "wind_kph": 12,
      "precip_mm": 0
    }
  }
}
```

### 2. Get Weather Forecast
**GET** `/api/weather/forecast`

**Query Parameters:**
- `city` (optional): City name (default: "Kathmandu")
- `days` (optional): Number of days (default: 7, max: 14)

**Example Request:**
```bash
curl -X GET "http://localhost:9696/api/weather/forecast?city=Tokyo&days=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "location": { ... },
    "current": { ... },
    "forecast": {
      "forecastday": [
        {
          "date": "2024-01-01",
          "day": {
            "maxtemp_c": 20,
            "mintemp_c": 10,
            "avgtemp_c": 15,
            "condition": { ... }
          },
          "hour": [ ... ]
        }
      ]
    }
  }
}
```

### 3. Get Detailed Weather Data (with hourly forecast)
**GET** `/api/weather/data`

**Query Parameters:**
- `city` (optional): City name (default: "Kathmandu")
- `hours` (optional): Number of hours (default: 13, max: 24)

**Example Request:**
```bash
curl -X GET "http://localhost:9696/api/weather/data?city=New%20York&hours=24" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "location": { ... },
    "current": { ... },
    "forecast": {
      "forecastday": [
        {
          "hour": [
            {
              "time": "2024-01-01 00:00",
              "temp_c": 12,
              "condition": { ... },
              "humidity": 70,
              "wind_kph": 8
            }
          ]
        }
      ]
    }
  }
}
```

### 4. Generate AI Weather Note
**POST** `/api/weather/generate-note`

**Request Body:**
```json
{
  "weatherData": {
    "current": {
      "temp_c": 25,
      "condition": {
        "text": "Sunny"
      },
      "humidity": 60,
      "wind_kph": 15,
      "precip_mm": 0
    }
  }
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:9696/api/weather/generate-note" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "weatherData": {
      "current": {
        "temp_c": 25,
        "condition": {"text": "Sunny"},
        "humidity": 60,
        "wind_kph": 15,
        "precip_mm": 0
      }
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "note": "☀️ Perfect sunny day with 25°C! Excellent conditions for outdoor farming activities, crop growth, and photosynthesis. Consider irrigation if needed."
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid city name or parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid API key"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch weather data"
}
```

## Frontend Integration

### Update your frontend API calls:

**Before (exposing API key):**
```javascript
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${CITY}&hours=13`)
```

**After (secure):**
```javascript
// Get weather data
const getWeatherData = async (city = "Kathmandu", hours = 13) => {
  const response = await fetch(
    `http://localhost:9696/api/weather/data?city=${city}&hours=${hours}`,
    {
      headers: {
        'Authorization': `Bearer ${token}` // Your JWT token
      }
    }
  );
  const data = await response.json();
  return data.data; // The actual weather data
};

// Generate AI note
const generateWeatherNote = async (weatherData) => {
  const response = await fetch(
    'http://localhost:9696/api/weather/generate-note',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ weatherData })
    }
  );
  const data = await response.json();
  return data.note;
};
```

## Security Features

1. **API Key Protection**: Your WeatherAPI.com key is never exposed to the frontend
2. **JWT Authentication**: All weather endpoints require valid JWT tokens
3. **Error Handling**: Proper error responses without exposing sensitive information
4. **Rate Limiting**: Can be easily added to prevent abuse

## Usage Examples

### Complete Frontend Integration:
```javascript
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [aiWeatherNote, setAiWeatherNote] = useState('');
  const [isLoadingNote, setIsLoadingNote] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'http://localhost:9696/api/weather/data?city=Kathmandu&hours=13',
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        const data = await response.json();
        setWeather(data.data);
        
        // Generate AI note
        generateAINote(data.data);
      } catch (error) {
        console.error('Weather fetch error:', error);
      }
    };

    fetchWeather();
  }, []);

  const generateAINote = async (weatherData) => {
    setIsLoadingNote(true);
    try {
      const response = await fetch(
        'http://localhost:9696/api/weather/generate-note',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ weatherData })
        }
      );
      const data = await response.json();
      setAiWeatherNote(data.note);
    } catch (error) {
      console.error('Error generating AI note:', error);
    } finally {
      setIsLoadingNote(false);
    }
  };

  // Rest of your component...
};
```

## Testing

You can test the endpoints using curl or Postman:

1. **First, get a JWT token by logging in:**
```bash
curl -X POST "http://localhost:9696/api/user/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

2. **Use the token to access weather data:**
```bash
curl -X GET "http://localhost:9696/api/weather/current?city=London" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
``` 