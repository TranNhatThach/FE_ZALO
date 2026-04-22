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
    retry: false, // Không retry — nếu fail thì dùng default
    staleTime: 1000 * 60 * 60 * 24,
    enabled: tenantId !== 'default', // Chỉ gọi khi có tenantId thật
  });

  return {
    tenantId,
    tenantConfig: tenantConfig || null,
    isLoading: tenantId !== 'default' ? isLoading : false,
    error,
  };
};
