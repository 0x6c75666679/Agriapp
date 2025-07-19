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
    formData.append('file', file);

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/uploadProfilePicture`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        let errorMsg = 'Upload failed';
        try {
            const error = await response.json();
            errorMsg = error.error || error.message || errorMsg;
        } catch (e) {}
        throw new Error(errorMsg);
    }

    return response.json();
};
// Update user info (name, email, etc.)
export const updateUserInfo = async (userData) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return authenticatedApiRequest('/api/user/update', {
        method: 'PUT',
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};

// Change user password
export const updateUserPassword = async (oldPassword, newPassword) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return authenticatedApiRequest('/api/user/changePassword', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
}; 

export const deleteUser = async (password) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return authenticatedApiRequest('/api/user/delete', {
        method: 'DELETE',
        body: JSON.stringify({ password }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};