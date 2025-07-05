import { authenticatedApiRequest } from './apiHelpers';

export const getWeatherData = async (city = "Kathmandu", hours = 13) => {
    const response = await authenticatedApiRequest(`/api/weather/data?city=${encodeURIComponent(city)}&hours=${hours}`);
    return response.data;
};

export const getCurrentWeather = async (city = "Kathmandu") => {
    const response = await authenticatedApiRequest(`/api/weather/current?city=${encodeURIComponent(city)}`);
    return response.data;
};

export const getWeatherForecast = async (city = "Kathmandu", days = 7) => {
    const response = await authenticatedApiRequest(`/api/weather/forecast?city=${encodeURIComponent(city)}&days=${days}`);
    return response.data;
};

export const generateWeatherNote = async (weatherData) => {
    try {
        const response = await authenticatedApiRequest('/api/weather/generate-note', {
            method: 'POST',
            body: JSON.stringify({ weatherData })
        });
        return response.note;
    } catch (error) {
        console.error('Error generating weather note:', error);
        return '';
    }
}; 