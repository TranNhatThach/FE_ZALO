import { api } from './fetcher';

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface Customer {
  id: number;
  name: string;
  phoneNumber?: string;
  companyName?: string;
  address?: string;
  email?: string;
  taxCode?: string;
  note?: string;
}

export const customerApi = {
  getAll: (page = 0, size = 10): Promise<PageResponse<Customer>> => 
    api.get<PageResponse<Customer>>(`/v1/customers?page=${page}&size=${size}`),
  search: (query: string, page = 0, size = 10): Promise<PageResponse<Customer>> => 
    api.get<PageResponse<Customer>>(`/v1/customers/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`),
  create: (customer: Partial<Customer>): Promise<Customer> => 
    api.post<Customer>('/v1/customers', customer),
};
