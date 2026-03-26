export interface Branch {
  id: string;
  name: string;
  address: string;
  province?: string;
  district?: string;
  ward?: string;
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE';
  tenantId: string;
}
