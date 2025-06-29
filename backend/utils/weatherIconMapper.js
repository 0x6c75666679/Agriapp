// Weather Icon Mapper for AccuWeather icons
// Maps weather conditions to specific AccuWeather icon URLs

const weatherIconMap = {
    // Clear/Sunny conditions
    'clear': '1',
    'sunny': '1',
    'clear sky': '1',
    
    // Partly cloudy conditions
    'partly cloudy': '3',
    'partly cloudy day': '3',
    'scattered clouds': '3',
    
    // Cloudy conditions
    'cloudy': '7',
    'overcast': '7',
    'mostly cloudy': '4',
    'mostly cloudy day': '4',
    
    // Rain conditions
    'rain': '18',
    'light rain': '18',
    'moderate rain': '18',
    'heavy rain': '19',
    'rain showers': '18',
    'light rain showers': '18',
    'moderate rain showers': '18',
    'heavy rain showers': '19',
    'drizzle': '17',
    'light drizzle': '17',
    'moderate drizzle': '17',
    
    // Thunderstorm conditions
    'thunderstorm': '15',
    'thunder': '15',
    'storm': '15',
    'thunder and rain': '15',
    'thunderstorm with rain': '15',
    'thunderstorm with light rain': '15',
    'thunderstorm with heavy rain': '16',
    
    // Snow conditions
    'snow': '22',
    'light snow': '22',
    'moderate snow': '22',
    'heavy snow': '25',
    'snow showers': '22',
    'light snow showers': '22',
    'moderate snow showers': '22',
    'heavy snow showers': '25',
    'sleet': '24',
    'freezing rain': '24',
    
    // Fog/Mist conditions
    'fog': '11',
    'mist': '11',
    'foggy': '11',
    'haze': '5',
    'hazy': '5',
    
    // Wind conditions
    'windy': '23',
    'breezy': '23',
    'strong winds': '23',
    
    // Extreme conditions
    'tornado': '0',
    'hurricane': '0',
    'tropical storm': '0',
    
    // Night conditions
    'clear night': '33',
    'partly cloudy night': '35',
    'mostly cloudy night': '36',
    'cloudy night': '38',
    
    // Special conditions
    'blizzard': '25',
    'ice': '24',
    'freezing fog': '11',
    'dust': '6',
    'sand': '6',
    'smoke': '6',
    'ash': '6',
    'squall': '23',
    'volcanic ash': '6'
};

// Function to get AccuWeather icon URL based on weather condition
const getWeatherIcon = (condition, isNight = false) => {
    if (!condition) return 'https://www.accuweather.com/images/weathericons/1.svg';
    
    const conditionLower = condition.toLowerCase().trim();
    
    // Check for night conditions first
    if (isNight) {
        if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
            return 'https://www.accuweather.com/images/weathericons/33.svg';
        }
        if (conditionLower.includes('partly cloudy')) {
            return 'https://www.accuweather.com/images/weathericons/35.svg';
        }
        if (conditionLower.includes('mostly cloudy') || conditionLower.includes('cloudy')) {
            return 'https://www.accuweather.com/images/weathericons/36.svg';
        }
        if (conditionLower.includes('overcast')) {
            return 'https://www.accuweather.com/images/weathericons/38.svg';
        }
    }
    
    // Check exact matches first
    if (weatherIconMap[conditionLower]) {
        return `https://www.accuweather.com/images/weathericons/${weatherIconMap[conditionLower]}.svg`;
    }
    
    // Check partial matches
    for (const [key, iconNumber] of Object.entries(weatherIconMap)) {
        if (conditionLower.includes(key) || key.includes(conditionLower)) {
            return `https://www.accuweather.com/images/weathericons/${iconNumber}.svg`;
        }
    }
    
    // Default fallback icons based on general conditions
    if (conditionLower.includes('rain')) {
        return 'https://www.accuweather.com/images/weathericons/18.svg';
    }
    if (conditionLower.includes('snow')) {
        return 'https://www.accuweather.com/images/weathericons/22.svg';
    }
    if (conditionLower.includes('cloud')) {
        return 'https://www.accuweather.com/images/weathericons/7.svg';
    }
    if (conditionLower.includes('thunder')) {
        return 'https://www.accuweather.com/images/weathericons/15.svg';
    }
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
        return 'https://www.accuweather.com/images/weathericons/11.svg';
    }
    
    // Default sunny icon
    return 'https://www.accuweather.com/images/weathericons/1.svg';
};

// Function to determine if it's night time
const isNightTime = (localtime) => {
    if (!localtime) return false;
    
    const hour = new Date(localtime).getHours();
    return hour < 6 || hour >= 18; // Night time: 6 PM to 6 AM
};

// Function to get weather icon with time consideration
const getWeatherIconWithTime = (condition, localtime) => {
    const isNight = isNightTime(localtime);
    return getWeatherIcon(condition, isNight);
};

module.exports = {
    getWeatherIcon,
    getWeatherIconWithTime,
    isNightTime,
    weatherIconMap
}; 