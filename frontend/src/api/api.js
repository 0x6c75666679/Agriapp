import axios from "axios";

const ApiFormData = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers:{
        'Content-Type':'multipart/form-data'
    }
})

const Api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers:{
        'Content-Type':'application/json'
    }
})

// AI API for weather notes (keeping for backup, but we'll use our backend now)
const AIApi = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
    }
})

// Helper function to get JWT token
const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper function for authenticated API requests
const authenticatedApiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        }
    };

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        ...defaultOptions,
        ...options
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
    }

    return response.json();
};

// User API functions
export const loginUserAPI = (data) => {
    return Api.post('/api/user/login',data);
}

export const createUserAPI = (data) => {
   return Api.post('/api/user/register',data);
}

export const getallProduct = () => {
    return Api.get('/api/product/get-all');
}

// NEW: Secure Weather API functions using backend middleware
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

// Updated: Use backend AI weather note generation instead of OpenAI
export const generateWeatherNote = async (weatherData) => {
    try {
        const response = await authenticatedApiRequest('/api/weather/generate-note', {
            method: 'POST',
            body: JSON.stringify({ weatherData })
        });
        return response.note;
    } catch (error) {
        console.error('Error generating weather note:', error);
        // Fallback to default weather notes
        return getDefaultWeatherNote(weatherData.current.condition.text);
    }
}

// Fallback function for default weather notes
const getDefaultWeatherNote = (condition) => {
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
        return '🌫️ Foggy conditions. ReducedtoLowerCase visibility, drive carefully to fields.';
    } else if (conditionLower.includes('mist')) {
        return '🌫️ Misty weather. High humidity good for certain crops.';
    } else {
        return `🌤️ ${condition}. Check local conditions for farming activities.`;
    }
}

// Additional user profile functions
export const getUserProfile = async () => {
    const response = await authenticatedApiRequest('/api/user/profile');
    return response.user;
};

export const uploadProfilePicture = async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/uploadProfilePicture`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
    }

    return response.json();
};

