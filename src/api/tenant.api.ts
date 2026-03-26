import { api } from './fetcher';
import { TenantConfig } from '../types/tenant.types';

export const tenantApi = {
  /**
   * GET /tenant/:tenantId/config
   * Returns the branding/configuration for a given tenant.
   */
  getConfig: (tenantId: string): Promise<TenantConfig> =>
    api.get<TenantConfig>(`/tenant/${tenantId}/config`),
};
