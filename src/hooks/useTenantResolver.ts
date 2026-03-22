import { useQuery } from '@tanstack/react-query';
import { tenantService } from '../services/api/tenant.service';
import { extractTenantId } from '../utils/tenant.utils';

export const useTenantResolver = () => {
  const tenantId = extractTenantId() || 'default';

  const {
    data: tenantConfig,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tenantConfig', tenantId],
    queryFn: () => tenantService.getTenantConfig(tenantId),
    retry: 1, // Only retry once to fail fast
    staleTime: 1000 * 60 * 60 * 24, // 24 hours caching
  });

  return {
    tenantId,
    tenantConfig,
    isLoading,
    error,
  };
};
