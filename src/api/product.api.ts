import { api } from './fetcher';
import { PageResponse } from './customer.api';

export interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    status: string;
    imageUrl: string;
}

export const productApi = {
    getProducts: (page = 0, size = 10, search = '', category = '', status = ''): Promise<PageResponse<Product>> => {
        let params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('size', size.toString());
        if (search) params.append('search', search);
        if (category && category !== 'Tất cả') params.append('category', category);
        if (status && status !== 'Tất cả') params.append('status', status);
        return api.get<PageResponse<Product>>(`/v1/products?${params.toString()}`);
    },
    
    createProduct: (data: any, imageFile?: File): Promise<Product> => {
        if (imageFile) {
            const formData = new FormData();
            formData.append('product', new Blob([JSON.stringify(data)], { type: 'application/json' }));
            formData.append('image', imageFile);
            return api.post<Product>('/v1/products', formData);
        }
        return api.post<Product>('/v1/products', data);
    },

    updateProduct: (id: number, data: any, imageFile?: File): Promise<Product> => {
        if (imageFile) {
            const formData = new FormData();
            formData.append('product', new Blob([JSON.stringify(data)], { type: 'application/json' }));
            formData.append('image', imageFile);
            return api.put<Product>(`/v1/products/${id}`, formData);
        }
        return api.put<Product>(`/v1/products/${id}`, data);
    },

    deleteProduct: (id: number): Promise<void> => api.del(`/v1/products/${id}`),
};
