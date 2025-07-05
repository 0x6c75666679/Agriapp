import { Api } from './apiClient';
import { authenticatedApiRequest } from './apiHelpers';

export const loginUserAPI = (data) => {
    return Api.post('/api/user/login', data);
};

export const createUserAPI = (data) => {
    return Api.post('/api/user/register', data);
};

export const getUserProfile = async () => {
    const response = await authenticatedApiRequest('/api/user/profile');
    return response.user;
};

export const uploadProfilePicture = async (file) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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