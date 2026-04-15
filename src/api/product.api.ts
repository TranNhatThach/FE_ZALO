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
    createProduct: (data: any): Promise<Product> => api.post<Product>('/v1/products', data),
    updateProduct: (id: number, data: any): Promise<Product> => api.put<Product>(`/v1/products/${id}`, data),
    deleteProduct: (id: number): Promise<void> => api.del(`/v1/products/${id}`),
};
