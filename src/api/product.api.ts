import { api } from './fetcher';

export interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    status: string;
    imageUrl: string;
}

export const productApi = {
    getProducts: (): Promise<Product[]> => api.get<Product[]>('/v1/products'),
    
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
