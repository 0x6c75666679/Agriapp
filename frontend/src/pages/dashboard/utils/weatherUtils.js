// Weather condition to AccuWeather icon mapping
export const conditionToAccuIcon = {
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
export const getAccuWeatherIcon = (condition, localtime) => {
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

// Helper function to get weather note based on condition
export const getWeatherNote = (weather) => {
  if (!weather?.current?.condition?.text) return '';
  
  const condition = weather.current.condition.text;
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
}; 