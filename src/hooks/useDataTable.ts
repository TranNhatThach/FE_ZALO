import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';

// Định nghĩa cấu trúc những gì sẽ gửi lên Server (Bếp)
interface FetchParams {
  page: number;      // Trang số mấy
  limit: number;     // Bao nhiêu món 1 trang
  [key: string]: any; // Có thể có thêm từ khóa tìm kiếm, ngày tháng...
}

interface UseDataTableProps<T> {
  queryKey: string[]; // Tên gọi của dữ liệu (VD: ['hoa-don']) để React Query quản lý
  fetchFn: (params: FetchParams) => Promise<{ data: T[]; total: number }>; // Hàm gọi API thực tế
  initialParams?: FetchParams; // Thông số mặc định ban đầu
}

export function useDataTable<T>({ queryKey, fetchFn, initialParams }: UseDataTableProps<T>) {
  
  // 1. Tạo một cái "sổ ghi chép" (state) để nhớ xem khách đang ở trang mấy, lọc những gì
  const [params, setParams] = useState<FetchParams>(() => {
    return initialParams || { page: 1, limit: 10 };
  });

  // 2. Gọi React Query (Giống như sai người phục vụ chạy đi lấy Data)
  const queryInfo = useQuery({
    // queryKey kết hợp với params: Nghĩa là hễ 'params' đổi, nó tự động gọi lại API
    queryKey: [...queryKey, params], 
    
    // Hàm thực thi chạy vào bếp lấy đồ
    queryFn: () => fetchFn(params), 
    
    // Bí quyết để không bị chớp trắng màn hình: Giữ lại data cũ cho khách xem 
    // trong lúc chờ data mới trả về.
    placeholderData: keepPreviousData, 
    
    // Lưu lại dữ liệu này 5 giây, trong 5s nếu bấm lại đúng trang này thì lấy đồ cũ ra xài luôn, không gọi bếp nữa
    staleTime: 5000, 
  });

  // 3. Hàm này gắn vào cái Bảng. Mỗi khi khách bấm "Trang tiếp theo" trên bảng
  // Nó sẽ nhận tín hiệu và cập nhật lại cái "Sổ ghi chép" (params)
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setParams((prev) => ({
      ...prev,                  // Giữ nguyên các bộ lọc cũ (nếu có)
      page: pagination.current, // Cập nhật sang trang mới
      limit: pagination.pageSize, // Cập nhật số dòng/trang mới
      
      // Nếu khách bấm sắp xếp cột, thì gửi thêm thông tin sắp xếp
      sortBy: sorter.field,
      order: sorter.order === 'ascend' ? 'ASC' : 'DESC',
    }));
  };

  // Trả về tất cả công cụ để dùng ở file giao diện
  return { ...queryInfo, params, setParams, handleTableChange };
}