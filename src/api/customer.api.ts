import { api } from './fetcher';

export interface Customer {
  id: number;
  name: string;
  phoneNumber?: string;
  companyName?: string;
  address?: string;
  email?: string;
}

export const customerApi = {
  getAll: (): Promise<Customer[]> => api.get<Customer[]>('/v1/customers'),
  search: (query: string): Promise<Customer[]> => 
    api.get<Customer[]>(`/v1/customers/search?query=${encodeURIComponent(query)}`),
  create: (customer: Partial<Customer>): Promise<Customer> => 
    api.post<Customer>('/v1/customers', customer),
};
