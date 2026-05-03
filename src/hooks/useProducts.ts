import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/product.api';
import { QUERY_KEYS } from '../api/queryKeys';

export function useGetProducts(page = 0, size = 20, search = '', category = '', status = '') {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS.LIST, page, size, search, category, status],
    queryFn: () => productApi.getProducts(page, size, search, category, status),
    retry: 1,
  });
}
