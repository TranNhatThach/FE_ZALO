import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/product.api';
import { QUERY_KEYS } from '../api/queryKeys';

export function useGetProducts() {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.LIST,
    queryFn: productApi.getProducts,
    retry: 1,
  });
}
