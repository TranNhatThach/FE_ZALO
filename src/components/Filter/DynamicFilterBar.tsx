import React, { useState, useEffect } from 'react';
import { Input, Select, DatePicker } from 'antd';
import { useDebounce } from '../../hooks/useDebounce';

const { RangePicker } = DatePicker;

//  cấu hình ô lọc sẽ có những gì
export type FilterField = {
  name: string; // Tên biến gửi lên server (VD: 'search', 'status')
  type: 'text' | 'select' | 'date-range'; // Loại ô nhập
  placeholder?: string; // Chữ mờ mờ gợi ý
  options?: { label: string; value: string | number }[]; // Dành riêng cho 'select'
};

interface DynamicFilterBarProps {
  fields: FilterField[]; // Nhận vào mảng các cấu hình
  onFilterChange: (filters: Record<string, any>) => void; // Hàm báo tin ra ngoài khi lọc xong
}

export const DynamicFilterBar: React.FC<DynamicFilterBarProps> = ({ fields, onFilterChange }) => {
  // Ghi nhớ tạm thời chữ khách đang gõ
  const [searchValue, setSearchValue] = useState<string>('');
  
  // Dùng công cụ "Đợi một chút" - đợi khách ngừng gõ 500ms
  const debouncedSearch = useDebounce(searchValue, 500); 

  // Mỗi khi chữ đã được chống Spam thay đổi, mới báo ra bên ngoài để gọi API
  useEffect(() => {
    onFilterChange({ search: debouncedSearch });
  }, [debouncedSearch]);

  // Hàm xử lý chung khi người dùng tương tác với các ô lọc khác (Select, DatePicker)
  const handleFieldChange = (name: string, value: any, type: string) => {
    let formattedValue = value;
    
    // Nếu là ô chọn ngày tháng, format nó sang chuẩn ISO để máy chủ đọc được
    if (type === 'date-range' && value) {
      formattedValue = {
        startDate: value[0] ? value[0].toISOString() : undefined,
        endDate: value[1] ? value[1].toISOString() : undefined,
      };
    }

    // Gửi giá trị vừa lọc ra ngoài cho component Cha (Page) gọi API
    if (name !== 'search') {
      onFilterChange({ [name]: formattedValue });
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 rounded-md">
      {/* Vòng lặp: Quét qua mảng 'fields' truyền vào, thấy loại gì thì vẽ ra loại đó */}
      {fields.map((field) => {
        if (field.type === 'text') {
          return (
            <Input
              key={field.name}
              placeholder={field.placeholder || 'Tìm kiếm...'}
              // Riêng ô Input thì không gửi ngay, mà lưu vào State tạm để dùng hàm chống Spam ở trên
              onChange={(e) => {
                if(field.name === 'search') setSearchValue(e.target.value);
                else handleFieldChange(field.name, e.target.value, field.type);
              }}
              className="w-64"
              allowClear // Hiện dấu X để xóa nhanh
            />
          );
        }
        
        if (field.type === 'select') {
          return (
            <Select
              key={field.name}
              placeholder={field.placeholder || 'Chọn...'}
              options={field.options}
              onChange={(value) => handleFieldChange(field.name, value, field.type)}
              className="w-48"
              allowClear
            />
          );
        }

        if (field.type === 'date-range') {
          return (
            <RangePicker
              key={field.name}
              onChange={(dates) => handleFieldChange(field.name, dates, field.type)}
              format="DD/MM/YYYY" // Giao diện hiện ngày Việt Nam
            />
          );
        }

        return null; // Tránh lỗi nếu truyền sai Type
      })}
    </div>
  );
};