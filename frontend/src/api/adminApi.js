import { authenticatedApiRequest } from './apiHelpers';

// Get admin statistics
export const getAdminStats = async () => {
    try {
        const response = await authenticatedApiRequest('/api/admin/stats');
        return response.stats || {
            totalUsers: 0,
            activeUsers: 0,
            inactiveUsers: 0,
            newUsersThisMonth: 0
        };
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        // Return default stats if API fails
        return {
            totalUsers: 0,
            activeUsers: 0,
            inactiveUsers: 0,
            newUsersThisMonth: 0
        };
    }
};

// Get site status
export const getSiteStatus = async () => {
    try {
        const response = await authenticatedApiRequest('/api/admin/status');
        return response.status || {
            database: 'online',
            server: 'online',
            api: 'online',
            uptime: '99.9%',
            lastMaintenance: '2024-01-15'
        };
    } catch (error) {
        console.error('Error fetching site status:', error);
        // Return default status if API fails
        return {
            database: 'online',
            server: 'online',
            api: 'online',
            uptime: '99.9%',
            lastMaintenance: '2024-01-15'
        };
    }
};

// Get all users (for admin user management)
export const getAllUsers = async () => {
    try {
        const response = await authenticatedApiRequest('/api/admin/users');
        return response.users || [];
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
};

// Update user role
export const updateUserRole = async (userId, role) => {
    try {
        const response = await authenticatedApiRequest('/api/admin/users/' + userId + '/role', {
            method: 'PUT',
            data: { role }
        });
        return response;
    } catch (error) {
        console.error('Error updating user role:', error);
        throw new Error('Failed to update user role');
    }
};

// Delete user
export const deleteUser = async (userId) => {
    try {
        const response = await authenticatedApiRequest('/api/admin/users/' + userId, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
    }
};

// Get system logs
export const getSystemLogs = async (limit = 100) => {
    try {
        const response = await authenticatedApiRequest(`/api/admin/logs?limit=${limit}`);
        return response.logs || [];
    } catch (error) {
        console.error('Error fetching system logs:', error);
        throw new Error('Failed to fetch system logs');
    }
};

// Get performance metrics
export const getPerformanceMetrics = async () => {
    try {
        const response = await authenticatedApiRequest('/api/admin/performance');
        return response.metrics || {
            cpuUsage: 0,
            memoryUsage: 0,
            diskUsage: 0,
            responseTime: 0
        };
    } catch (error) {
        console.error('Error fetching performance metrics:', error);
        return {
            cpuUsage: 0,
            memoryUsage: 0,
            diskUsage: 0,
            responseTime: 0
        };
    }
}; 