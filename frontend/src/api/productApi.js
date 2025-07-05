import { authenticatedApiRequest } from './apiHelpers';

export const getallProduct = async () => {
    try {
        const response = await authenticatedApiRequest('/api/product/get-all');
        return response.data || response;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}; 