import React, { useState } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { 
  MenuOutlined, 
  SearchOutlined, 
  CheckCircleFilled, 
  EllipsisOutlined,
  RightOutlined,
  PlusOutlined,
  BankFilled,
  UserOutlined
} from '@ant-design/icons';

// Mock Data
const suppliersData = [
  { id: '1', short: 'HS', name: 'Hitech Solutions Co.', contact: 'Nguyễn Văn An', status: 'ACTIVE', color: 'bg-blue-100 text-blue-700' },
  { id: '2', short: 'VL', name: 'Việt Long Logistics', contact: 'Trần Minh Long', status: 'INACTIVE', color: 'bg-teal-700 text-white' },
  { id: '3', short: 'MP', name: 'Minh Phát Trading', contact: 'Lê Thị Mai', status: 'PENDING', color: 'bg-red-50 text-red-600' },
  { id: '4', short: 'TC', name: 'Thành Công Group', contact: 'Phạm Thành Công', status: 'ACTIVE', color: 'bg-blue-100 text-blue-700' },
];

export const SuppliersPage: React.FC = () => {
  const { setSidebarCollapsed, isSidebarCollapsed } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col w-full h-full bg-[#f8f9fa] relative pb-20">
      
      {/* 1. Header Area (trắng) */}
      <div className="bg-white flex items-center justify-between px-4 h-[56px] fixed top-0 left-0 right-0 z-10 border-b border-gray-100/50 max-w-[500px] mx-auto">
        <button 
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="w-10 h-10 flex items-center justify-start border-none bg-transparent outline-none rounded-full active:bg-gray-100"
        >
          <MenuOutlined className="text-xl text-[#3b4b8a]" />
        </button>
        <span className="text-[17px] font-bold text-[#2a3a7c]">Nhà cung cấp</span>
        <button className="w-8 h-8 rounded-full bg-[#fcd4c7] flex items-center justify-center border-none outline-none active:opacity-80">
           <div className="w-5 h-5 rounded-[4px] border-[1.5px] border-white relative">
             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/40" />
           </div>
        </button>
      </div>

      <div className="pt-[56px] px-4">
        {/* 2. Search Bar */}
        <div className="mt-4 mb-5">
          <div className="flex items-center bg-white h-[44px] rounded-full px-4 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <SearchOutlined className="text-gray-400 text-lg mr-2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhà cung cấp..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[14px] text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* 3. Statistics Dashboard */}
        <div className="mb-6">
          {/* Main Card (Blue) */}
          <div className="bg-[#1e3ba1] rounded-[16px] p-5 relative overflow-hidden shadow-sm mb-3">
            <div className="relative z-10">
              <span className="text-white/80 text-[11px] font-medium tracking-wider uppercase block mb-1">
                TỔNG NHÀ CUNG CẤP
              </span>
              <div className="text-white text-[32px] font-extrabold leading-none mb-3">
                1,284
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-medium">
                +12% tháng này
              </span>
            </div>
            
            {/* Building Icon Decoration */}
            <div className="absolute right-4 top-4 w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
              <BankFilled className="text-white/70 text-xl" />
            </div>
          </div>

          {/* Sub Cards Row */}
          <div className="flex gap-3">
            {/* Active Card */}
            <div className="flex-1 bg-white rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
               <div className="w-6 h-6 rounded-full bg-slate-500 flex items-center justify-center mb-2">
                 <CheckCircleFilled className="text-white text-[14px]" />
               </div>
               <span className="text-[#4b5563] text-[13px] font-medium block mb-1">Đang hoạt động</span>
               <div className="text-[20px] font-bold text-gray-900">1,120</div>
            </div>

            {/* Pending Card */}
            <div className="flex-1 bg-white rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
               <div className="w-6 h-6 rounded-full bg-[#005a8d] flex items-center justify-center mb-2">
                 <EllipsisOutlined className="text-white text-[14px] font-bold" />
               </div>
               <span className="text-[#4b5563] text-[13px] font-medium block mb-1">Chờ duyệt</span>
               <div className="text-[20px] font-bold text-gray-900">164</div>
            </div>
          </div>
        </div>

        {/* 4. Supplier List */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[#4b5563] text-[12px] font-bold tracking-wider uppercase m-0">Danh sách nhà cung cấp</h3>
            <button className="text-[#1e3ba1] text-[12px] font-bold border-none bg-transparent outline-none m-0 p-0">
              Xem tất cả
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {suppliersData.map((item) => (
              <div key={item.id} className="bg-white rounded-[16px] p-4 flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative active:bg-gray-50 transition-colors">
                
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-[16px] flex-shrink-0 ${item.color}`}>
                  {item.short}
                </div>

                {/* Info */}
                <div className="ml-3 flex-1 min-w-0 pr-8">
                  <h4 className="text-[15px] font-bold text-gray-900 m-0 truncate leading-tight mb-1">
                    {item.name}
                  </h4>
                  <div className="flex items-center text-gray-500 text-[12px]">
                    <UserOutlined className="mr-1 text-[10px]" />
                    <span className="truncate">{item.contact}</span>
                  </div>
                </div>

                {/* Arrow */}
                <RightOutlined className="text-gray-400 text-[12px] absolute right-4 bottom-4" />

                {/* Badge */}
                <div className="absolute top-4 right-4">
                  {item.status === 'ACTIVE' && (
                    <span className="px-2 py-0.5 rounded bg-[#e1e7f5] text-[#4b65a4] text-[9px] font-bold tracking-wide uppercase">Active</span>
                  )}
                  {item.status === 'INACTIVE' && (
                    <span className="px-2 py-0.5 rounded bg-[#e5e7eb] text-[#6b7280] text-[9px] font-bold tracking-wide uppercase">Inactive</span>
                  )}
                  {item.status === 'PENDING' && (
                    <span className="px-2 py-0.5 rounded bg-[#dbeafe] text-[#1e3ba1] text-[9px] font-bold tracking-wide uppercase">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button (+) */}
      <button className="fixed right-5 bottom-[80px] w-[52px] h-[52px] rounded-full bg-[#1e3ba1] text-white shadow-[0_4px_14px_rgba(30,59,161,0.4)] flex items-center justify-center border-none outline-none active:scale-95 transition-transform z-20">
        <PlusOutlined className="text-2xl" />
      </button>

    </div>
  );
};

export default SuppliersPage;
