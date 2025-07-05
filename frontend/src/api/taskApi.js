import { Api } from './apiClient';
import { authenticatedApiRequest } from './apiHelpers';
import { v4 as uuidv4 } from 'uuid';

// Get all tasks for the current user
export const getTasks = async () => {
    try {
        const response = await authenticatedApiRequest('/api/task/get-tasks');
        return response.tasks || [];
    } catch (error) {
        console.error('Error fetching tasks:', error);
        // Return fallback tasks if API fails (without IDs - backend will assign)
        return [
            { 
                id: 'fallback-task-1',
                title: 'Irrigate South Field', 
                description: 'Corn field needs watering',
                status: 'Pending',
                priority: 'high',
                field: 'South Field',
                startDate: '2024-05-20',
                startTime: '09:00',
                dueDate: '2024-05-21',
                dueTime: '17:00',
                type: 'watering',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            { 
                id: 'fallback-task-2',
                title: 'Harvest ready vegetables', 
                description: 'Tomatoes and peppers ready',
                status: 'In Progress',
                priority: 'high',
                field: 'Garden Plot',
                startDate: '2024-05-22',
                startTime: '06:00',
                dueDate: '2024-05-23',
                dueTime: '12:00',
                type: 'harvesting',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }
};

// Create a new task
export const createTask = async (taskData) => {
    console.log('taskApi - createTask called with:', taskData);
    try {
        const requestOptions = {
            method: 'POST',
            data: taskData
        };
        console.log('taskApi - Request options:', requestOptions);
        
        const response = await authenticatedApiRequest('/api/task/create-task', requestOptions);
        console.log('taskApi - Response received:', response);
        return response.data || response;
    } catch (error) {
        console.error('Error creating task:', error);
        // Don't generate local ID - let backend assign it
        const newTask = {
            ...taskData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        return newTask;
    }
};

// Update a task
export const updateTask = async (taskId, taskData) => {
    console.log('taskApi - updateTask called with:', { taskId, taskData });
    try {
        const response = await authenticatedApiRequest('/api/task/update-task', {
            method: 'PUT',
            data: {
                id: taskId,
                ...taskData
            }
        });
        console.log('taskApi - Task updated successfully:', response);
        return response.data || response;
    } catch (error) {
        console.error('Error updating task:', error);
        // Return updated task with local timestamp if API fails
        return {
            ...taskData,
            id: taskId,
            updatedAt: new Date().toISOString()
        };
    }
};

// Delete a task
export const deleteTask = async (taskId) => {
    console.log('taskApi - deleteTask called with taskId:', taskId);
    try {
        await authenticatedApiRequest('/api/task/delete-task', {
            method: 'POST',
            data: { id: taskId }
        });
        console.log('taskApi - Task deleted successfully');
        return { success: true };
    } catch (error) {
        console.error('Error deleting task:', error);
        return { success: false, error: error.message };
    }
};

// Update task status
export const updateTaskStatus = async (taskId, status) => {
    console.log('taskApi - updateTaskStatus called with:', { taskId, status });
    try {
        const response = await authenticatedApiRequest('/api/task/status-update', {
            method: 'PUT',
            data: {
                id: taskId,
                status
            }
        });
        console.log('taskApi - Task status updated successfully:', response);
        return response.data || response;
    } catch (error) {
        console.error('Error updating task status:', error);
        return { id: taskId, status, updatedAt: new Date().toISOString() };
    }
};

// Delete all tasks
export const deleteAllTasks = async () => {
    try {
        await authenticatedApiRequest('/api/task/delete-all-tasks', {
            method: 'DELETE'
        });
        return { success: true };
    } catch (error) {
        console.error('Error deleting all tasks:', error);
        return { success: false, error: error.message };
    }
}; 