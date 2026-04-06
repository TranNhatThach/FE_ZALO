import React, { useState } from 'react';

export interface FilterParams {
  search: string;
  role: string;
  status: string;
}

interface UserFilterProps {
  onFilterChange: (filters: FilterParams) => void;
  onReset: () => void;
}

const UserFilter: React.FC<UserFilterProps> = ({ onFilterChange, onReset }) => {
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    role: '',
    status: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleClear = () => {
    setFilters({ search: '', role: '', status: '' });
    onReset();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Bộ lọc tìm kiếm</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Tìm kiếm từ khóa */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1" htmlFor="search">Tìm kiếm</label>
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Tên, Email hoặc SĐT..."
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>

        {/* Lọc theo Vai trò */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1" htmlFor="role">Vai trò</label>
          <select
            id="role"
            name="role"
            value={filters.role}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-white"
          >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="user">Người dùng</option>
            <option value="collaborator">Cộng tác viên</option>
          </select>
        </div>

        {/* Lọc theo Trạng thái */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1" htmlFor="status">Trạng thái</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Đã khóa</option>
            <option value="pending">Chờ duyệt</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Thiết lập lại
        </button>
        <button
          onClick={handleApply}
          // Sử dụng class btn-primary từ thư viện của bạn như trong file index.tsx
          className="btn-primary px-4 py-2 rounded-md transition-colors" 
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
};

export default UserFilter;