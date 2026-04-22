import { api } from './fetcher';

export enum InvoiceType {
    SELL = 'SELL',
    BUY = 'BUY'
}

export interface Invoice {
    id: number;
    invoiceNumber: string;
    totalAmount: number;
    taxRate: number;
    taxAmount: number;
    finalAmount: number;
    invoiceDate: string;
    photoUrl: string;
    description: string;
    type: InvoiceType;
    createdAt: string;
}

export interface CreateInvoiceRequest {
    invoiceNumber: string;
    totalAmount: number;
    taxRate: number;
    invoiceDate: string;
    description: string;
    type: InvoiceType;
}

export const invoiceApi = {
    getInvoices: (): Promise<Invoice[]> => api.get<Invoice[]>('/v1/invoices'),
    createInvoice: (data: CreateInvoiceRequest, file?: File): Promise<Invoice> => {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        if (file) {
            formData.append('file', file);
        }
        return api.post<Invoice>('/v1/invoices', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    deleteInvoice: (id: number): Promise<void> => api.del(`/v1/invoices/${id}`),
};
