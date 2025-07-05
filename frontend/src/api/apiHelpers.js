// Helper function to get JWT token
export const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper function for authenticated API requests
export const authenticatedApiRequest = async (endpoint, options = {}) => {
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