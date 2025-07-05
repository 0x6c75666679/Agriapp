import { Api } from './apiClient';
import { authenticatedApiRequest } from './apiHelpers';
import { v4 as uuidv4 } from 'uuid';

// Get all fields for the current user
export const getFields = async () => {
    try {
        const response = await authenticatedApiRequest('/api/field/get-fields');
        console.log('getAllFields response:', response);
        console.log('Fields data:', response.fields || []);
        return response.fields || [];
    } catch (error) {
        console.error('Error fetching fields:', error);
        // Return empty array during testing - no dummy data
        return [];
    }
};

// Create a new field
export const createField = async (fieldData) => {
    return Api.post('/api/fields', fieldData);
};

// Update a field
export const updateField = async (fieldId, fieldData) => {
    return Api.put(`/api/fields/${fieldId}`, fieldData);
};

// Delete a field
export const deleteField = async (fieldId) => {
    return Api.delete(`/api/fields/${fieldId}`);
}; 