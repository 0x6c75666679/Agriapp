import { Api } from './apiClient';
import { authenticatedApiRequest } from './apiHelpers';

// Helper function to map backend field names to frontend field names
const mapFieldData = (field) => {
  // Format the Last_Activity date to readable format
  let formattedLastActivity = null;
  if (field.Last_Activity || field.lastActivity) {
    try {
      const date = new Date(field.Last_Activity || field.lastActivity);
      if (!isNaN(date.getTime())) {
        formattedLastActivity = date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
      }
    } catch (error) {
      console.error('Error formatting date:', error);
    }
  }

  return {
    ...field,
    lastActivity: formattedLastActivity
  };
};

// Get all fields for the current user
export const getFields = async () => {
    try {
        const response = await authenticatedApiRequest('/api/field/get-fields');
        console.log('getFields response:', response);
        const fields = response.fields || [];
        // Map backend field names to frontend field names
        return fields.map(mapFieldData);
    } catch (error) {
        console.error('Error fetching fields:', error);
        return [];
    }
};

// Create a new field
export const createField = async (fieldData) => {
    try {
        const currentDate = new Date().toISOString().slice(0, 10);
        const fieldDataWithTimestamp = {
            ...fieldData,
            Last_Activity: currentDate
        };
        
        const response = await authenticatedApiRequest('/api/field/create-field', {
            method: 'POST',
            data: fieldDataWithTimestamp
        });
        console.log('createField response:', response);
        return response.data || response;
    } catch (error) {
        console.error('Error creating field:', error);
        throw error;
    }
};

// Update a field
export const updateField = async (fieldId, fieldData) => {
    try {
        const currentDate = new Date().toISOString().slice(0, 10);
        const fieldDataWithTimestamp = {
            ...fieldData,
            Last_Activity: currentDate
        };
        
        const response = await authenticatedApiRequest('/api/field/update-field', {
            method: 'PUT',
            data: {
                id: fieldId,
                ...fieldDataWithTimestamp
            }
        });
        console.log('updateField response:', response);
        return response.data || response;
    } catch (error) {
        console.error('Error updating field:', error);
        throw error;
    }
};

// Update field status
export const updateFieldStatus = async (fieldId, status) => {
    try {
        const currentDate = new Date().toISOString().slice(0, 10);
        console.log('Attempting to update field status:', { fieldId, status });
        const response = await authenticatedApiRequest('/api/field/update-field-status', {
            method: 'POST',
            data: {
                id: fieldId,
                status,
                Last_Activity: currentDate
            }
        });
        console.log('updateFieldStatus response:', response);
        return response.data || response;
    } catch (error) {
        console.error('Error updating field status:', error);
        console.error('Error details:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url
        });
        throw error;
    }
};

// Delete a field
export const deleteField = async (fieldId) => {
    try {
        const currentDate = new Date().toISOString().slice(0, 10);
        const response = await authenticatedApiRequest('/api/field/delete-field', {
            method: 'POST',
            data: { 
                id: fieldId,
                Last_Activity: currentDate
            }
        });
        console.log('deleteField response:', response);
        return response.data || response;
    } catch (error) {
        console.error('Error deleting field:', error);
        throw error;
    }
};

// Delete all fields
export const deleteAllFields = async () => {
    try {
        const currentDate = new Date().toISOString().slice(0, 10);
        const response = await authenticatedApiRequest('/api/field/delete-all-fields', {
            method: 'DELETE',
            data: {
                Last_Activity: currentDate
            }
        });
        console.log('deleteAllFields response:', response);
        return response.data || response;
    } catch (error) {
        console.error('Error deleting all fields:', error);
        throw error;
    }
}; 