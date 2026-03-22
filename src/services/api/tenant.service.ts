import { axiosInstance } from './axios.instance';
import { TenantConfig } from '../../types/tenant.types';

export const tenantService = {
  getTenantConfig: async (tenantId: string): Promise<TenantConfig> => {
    const { data } = await axiosInstance.get<TenantConfig>(`/tenant/${tenantId}/config`);
    return data;
  },
};
