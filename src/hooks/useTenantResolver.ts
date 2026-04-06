import { useQuery } from '@tanstack/react-query';
import { tenantApi } from '../api/tenant.api';
import { QUERY_KEYS } from '../api/queryKeys';
import { extractTenantId } from '../utils/tenant.utils';

export const useTenantResolver = () => {
  const tenantId = extractTenantId() || 'default';

  const {
    data: tenantConfig,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.TENANT.CONFIG(tenantId),
    queryFn: () => tenantApi.getConfig(tenantId),
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
