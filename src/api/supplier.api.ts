import { api } from './fetcher';

export interface Supplier {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    contactPerson: string;
    trangThai: string;
}

export const supplierApi = {
    getSuppliers: (): Promise<Supplier[]> => api.get<Supplier[]>('/v1/suppliers'),
    createSupplier: (data: any): Promise<Supplier> => api.post<Supplier>('/v1/suppliers', data),
    updateSupplier: (id: number, data: any): Promise<Supplier> => api.put<Supplier>(`/v1/suppliers/${id}`, data),
    deleteSupplier: (id: number): Promise<void> => api.del(`/v1/suppliers/${id}`),
};
