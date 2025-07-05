import { Api } from './apiClient';

export const getallProduct = () => {
    return Api.get('/api/product/get-all');
}; 