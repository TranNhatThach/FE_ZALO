import React, { useState } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { 
  MenuOutlined, 
  SearchOutlined, 
  FilterOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { Typography } from 'antd';

const { Title } = Typography;

const suppliersData = [
  { id: '1', name: 'Nhà cung cấp Nam Á', phone: '0901234567', status: 'ACTIVE' },
  { id: '2', name: 'Công ty TNHH Vật Tư A', phone: '0987654321', status: 'INACTIVE' },
  { id: '3', name: 'Đại lý Điện Công Nghiệp', phone: '0911222333', status: 'ACTIVE' },
];

export const SuppliersPage: React.FC = () => {
  const { setSidebarCollapsed, isSidebarCollapsed, isDarkMode } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className={`flex flex-col w-full h-full relative pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f8f9fa]'}`}>
      
      {/* Header Area */}
      <div className={`flex items-center justify-between px-4 pt-6 pb-4 sticky top-0 z-[100] rounded-b-2xl shadow-md transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border-b border-gray-800 shadow-xl' : 'bg-[#1e3ba1]'}`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className={`w-8 h-8 flex items-center justify-start border-none bg-transparent outline-none p-0 cursor-pointer ${isDarkMode ? 'text-gray-200' : 'text-white'}`}
          >
            <MenuOutlined className="text-[20px]" />
          </button>
          <span className={`text-[18px] font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-white'}`}>Quản lý Nhà Cung Cấp</span>
        </div>
      </div>

      <div className="px-4 mt-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className={`flex items-center h-[44px] rounded-full px-4 shadow-sm border transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-100'}`}>
            <SearchOutlined className={`text-lg mr-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input 
              type="text" 
              placeholder="Tìm nhà cung cấp..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 bg-transparent border-none outline-none text-[14px] ${isDarkMode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-700 placeholder-gray-400'}`}
            />
            <button className={`bg-transparent border-none p-1 ${isDarkMode ? 'text-[#60a5fa]' : 'text-[#1e3ba1]'}`}>
              <FilterOutlined className="text-lg" />
            </button>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="flex gap-4 mb-6">
          <div className={`flex-1 rounded-2xl p-4 shadow-md relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-blue-900 to-blue-950 border border-blue-800' : 'bg-[#1e3ba1] text-white'}`}>
            <span className={`text-[12px] font-medium tracking-wide ${isDarkMode ? 'text-blue-300' : 'text-blue-100'}`}>
              Tổng số
            </span>
            <div className={`text-[28px] font-bold mt-1 ${isDarkMode ? 'text-white' : ''}`}>
              34
            </div>
            <div className="absolute right-[-10%] top-[20%] w-[80px] h-[80px] rounded-full bg-white opacity-10"></div>
          </div>
          <div className={`flex-1 rounded-2xl p-4 shadow-sm border transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-100'}`}>
            <span className={`text-[12px] font-medium tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Đang hoạt động
            </span>
            <div className={`text-[28px] font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              30
            </div>
          </div>
        </div>

        {/* List */}
        <div>
          <h3 className={`text-[15px] font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Danh sách</h3>
          <div className="flex flex-col gap-3">
            {suppliersData.map((item) => (
              <div key={item.id} className={`rounded-2xl p-4 shadow-sm border flex items-center justify-between transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className={`font-bold m-0 text-[14px] ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.name}</h4>
                    <span className={`text-[12px] ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>LH: {item.phone}</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${item.status === 'ACTIVE' ? (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700') : (isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700')}`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button (+) */}
      <button className="fixed right-5 bottom-[90px] w-[56px] h-[56px] rounded-full bg-[#1e3ba1] text-white shadow-lg flex items-center justify-center border-none outline-none active:scale-95 transition-transform z-20 cursor-pointer hover:bg-blue-800">
        <PlusOutlined className="text-[24px]" />
      </button>

    </div>
  );
};

export default SuppliersPage;
