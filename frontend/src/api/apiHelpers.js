// Helper function to get JWT token
export const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper function for authenticated API requests
export const authenticatedApiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    
    // Extract data from options and convert to body for POST/PUT requests
    const { data, ...otherOptions } = options;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        }
    };
    
    // Add body for POST/PUT requests if data is provided
    if (data && (options.method === 'POST' || options.method === 'PUT')) {
        defaultOptions.body = JSON.stringify(data);
    }
    
    console.log('authenticatedApiRequest - Making request to:', endpoint);
    console.log('authenticatedApiRequest - Method:', options.method || 'GET');
    console.log('authenticatedApiRequest - Data being sent:', data);
    console.log('authenticatedApiRequest - Full options:', { ...defaultOptions, ...otherOptions });
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        ...defaultOptions,
        ...otherOptions
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
    }
    return response.json();
}; 