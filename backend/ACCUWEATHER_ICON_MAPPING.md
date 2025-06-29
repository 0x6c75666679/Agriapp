# AccuWeather Icon Mapping System

## Overview
This system maps weather conditions from WeatherAPI.com to specific AccuWeather icon URLs, providing consistent and professional weather icons for your application.

## How It Works

### 1. **Icon Mapping Logic**
The system uses a comprehensive mapping table that converts weather condition text to specific AccuWeather icon numbers:

```javascript
const weatherIconMap = {
    'clear': '1',           // Sunny/Clear
    'partly cloudy': '3',   // Partly Cloudy
    'cloudy': '7',          // Cloudy
    'rain': '18',           // Rain
    'thunderstorm': '15',   // Thunderstorm
    'snow': '22',           // Snow
    'fog': '11',            // Fog
    // ... and many more
};
```

### 2. **Time-Aware Icons**
The system automatically detects day/night conditions and uses appropriate icons:
- **Day icons**: Clear (1), Partly Cloudy (3), Cloudy (7), etc.
- **Night icons**: Clear Night (33), Partly Cloudy Night (35), Cloudy Night (36), etc.

### 3. **Fallback System**
If an exact match isn't found, the system uses intelligent fallbacks:
1. **Exact match** → Use specific icon
2. **Partial match** → Use closest matching icon
3. **General condition** → Use category-based icon (rain, snow, cloud, etc.)
4. **Default** → Sunny icon (1)

## AccuWeather Icon Numbers

### Day Icons
- **1**: Sunny/Clear
- **3**: Partly Cloudy
- **4**: Mostly Cloudy
- **7**: Cloudy
- **11**: Fog
- **15**: Thunderstorm
- **16**: Thunderstorm with Heavy Rain
- **17**: Drizzle
- **18**: Light Rain
- **19**: Heavy Rain
- **22**: Light Snow
- **23**: Windy
- **24**: Sleet/Freezing Rain
- **25**: Heavy Snow/Blizzard

### Night Icons
- **33**: Clear Night
- **35**: Partly Cloudy Night
- **36**: Mostly Cloudy Night
- **38**: Cloudy Night

### Special Conditions
- **0**: Tornado/Hurricane
- **5**: Haze
- **6**: Dust/Sand/Smoke
- **44**: Partly Cloudy (alternative)

## Implementation

### Backend (Node.js)
```javascript
// In weatherController.js
const { getWeatherIconWithTime } = require('../utils/weatherIconMapper');

// Add icons to weather data
const addAccuWeatherIcons = (weatherData) => {
    if (weatherData.current && weatherData.current.condition) {
        weatherData.current.accuWeatherIcon = getWeatherIconWithTime(
            weatherData.current.condition.text,
            weatherData.location?.localtime
        );
    }
    return weatherData;
};
```

### Frontend (React)
```javascript
// In Dashboard component
<img 
    src={weather.current.accuWeatherIcon || `https:${weather.current.condition.icon}`} 
    alt="weather icon" 
    className="w-14 h-14" 
/>
```

## API Response Structure

The backend now returns weather data with additional `accuWeatherIcon` fields:

```json
{
  "success": true,
  "data": {
    "current": {
      "temp_c": 25,
      "condition": {
        "text": "Partly cloudy"
      },
      "accuWeatherIcon": "https://www.accuweather.com/images/weathericons/3.svg"
    },
    "forecast": {
      "forecastday": [
        {
          "day": {
            "condition": {
              "text": "Sunny"
            },
            "accuWeatherIcon": "https://www.accuweather.com/images/weathericons/1.svg"
          },
          "hour": [
            {
              "condition": {
                "text": "Clear"
              },
              "accuWeatherIcon": "https://www.accuweather.com/images/weathericons/33.svg"
            }
          ]
        }
      ]
    }
  }
}
```

## Benefits

1. **Consistency**: Same weather conditions always show the same icons
2. **Professional Look**: High-quality AccuWeather icons
3. **Time Awareness**: Different icons for day/night
4. **Fallback Safety**: Always shows an icon, even for unknown conditions
5. **Performance**: Icons are served from AccuWeather's CDN

## Customization

### Adding New Weather Conditions
To add support for new weather conditions, update the `weatherIconMap` in `utils/weatherIconMapper.js`:

```javascript
const weatherIconMap = {
    // ... existing mappings
    'your_new_condition': 'appropriate_icon_number',
    'another_condition': 'another_icon_number'
};
```

### Changing Icon URLs
If you want to use a different icon service, modify the URL pattern in the `getWeatherIcon` function:

```javascript
// Change from AccuWeather to another service
return `https://your-icon-service.com/icons/${iconNumber}.svg`;
```

## Testing

You can test the icon mapping by making requests to your weather endpoints:

```bash
# Test current weather
curl -X GET "http://localhost:9696/api/weather/current?city=London" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test forecast
curl -X GET "http://localhost:9696/api/weather/forecast?city=Tokyo&days=3" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### Common Issues

1. **Icons not showing**: Check if the `accuWeatherIcon` field is present in the API response
2. **Wrong icons**: Verify the weather condition text matches the mapping
3. **Night icons in day**: Check the `localtime` field is being passed correctly

### Debug Mode
Add console logs to see the mapping process:

```javascript
console.log('Condition:', condition);
console.log('Is Night:', isNight);
console.log('Mapped Icon:', iconUrl);
```

## Icon Reference

For a complete list of AccuWeather icon numbers and their meanings, visit:
https://www.accuweather.com/images/weathericons/

The system currently supports the most common weather conditions, but can be easily extended for additional conditions as needed. 