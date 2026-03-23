import React from 'react';
import { Table, Skeleton, Empty, TableProps } from 'antd';

// Định nghĩa những thứ cần truyền vào cái Bảng này
interface BaseTableProps<T> extends TableProps<T> {
  isLoading: boolean; // Bảng có đang tải dữ liệu không?
  data?: T[];         // Danh sách dữ liệu món ăn/hóa đơn...
  total?: number;     // Tổng cộng có bao nhiêu món (để chia trang)
  currentPage?: number;
  pageSize?: number;
}

export function BaseTable<T extends object>({
  isLoading,
  data,
  total,
  currentPage = 1,
  pageSize = 10,
  columns,
  rowKey = 'id',
  onChange,
  ...rest
}: BaseTableProps<T>) {
  
  // KIỂM TRA 1: Nếu là lần tải đầu tiên (đang tải VÀ chưa có data)
  // -> Hiện cái khung xương xám xám nhấp nháy cho đẹp
  if (isLoading && (!data || data.length === 0)) {
    return <Skeleton active paragraph={{ rows: 10 }} />;
  }

  // KIỂM TRA 2: Có data, vẽ cái bảng ra
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-2">
      <Table<T>
        {...rest}
        rowKey={rowKey} // Cột nào làm ID duy nhất (VD: mã hóa đơn)
        columns={columns} // Bản vẽ các cột (Cột A hiển thị tên, cột B hiển thị giá...)
        dataSource={data || []} // Đổ data vào
        loading={isLoading}     // Nếu đang chuyển trang thì hiện cái vòng xoay xoay nhỏ
        
        // Cấu hình chữ hiện ra khi mảng data rỗng
        locale={{ emptyText: <Empty description="Không có dữ liệu" /> }} 
        
        // Truyền hàm bắt sự kiện đổi trang/sắp xếp
        onChange={onChange}
        
        // Cấu hình thanh phân trang ở dưới đáy bảng
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true, // Cho phép khách chọn xem 10, 20 hay 50 dòng/trang
          showTotal: (total) => `Tổng số ${total} bản ghi`, // Dòng chữ ở góc trái
        }}
        // Chống bể giao diện trên điện thoại: Cho phép cuộn ngang nếu bảng quá nhiều cột
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}