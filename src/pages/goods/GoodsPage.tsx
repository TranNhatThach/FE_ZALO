import React, { useState } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { 
  SearchOutlined, 
  FilterOutlined,
  WarningOutlined,
  StopOutlined,
  BellOutlined,
  ContainerOutlined,
  PlusOutlined
} from '@ant-design/icons';

// Mock Data
const productsData = [
  { 
    id: '1', 
    name: 'iPhone 15 Pro Max', 
    sku: 'AAPL-15PM-256G', 
    image: 'https://cdn-icons-png.flaticon.com/512/0/191.png', 
    stock: 120, 
    category: 'ĐIỆN TỬ', 
    status: 'CÒN HÀNG' 
  },
  { 
    id: '2', 
    name: 'Herman Miller Aeron', 
    sku: 'HM-AER-GRB-B', 
    image: 'https://cdn-icons-png.flaticon.com/512/2627/2627252.png', 
    stock: 5, 
    category: 'NỘI THẤT', 
    status: 'SẮP HẾT' 
  },
  { 
    id: '3', 
    name: 'Sony WH-1000XM5', 
    sku: 'SONY-WHXM5-B', 
    image: 'https://cdn-icons-png.flaticon.com/512/272/272365.png', 
    stock: 0, 
    category: 'ĐIỆN TỬ', 
    status: 'HẾT HÀNG' 
  },
  { 
    id: '4', 
    name: 'Classic Wrist Watch', 
    sku: 'ACC-WAT-0922', 
    image: 'https://cdn-icons-png.flaticon.com/512/2784/2784459.png', 
    stock: 42, 
    category: 'PHỤ KIỆN', 
    status: 'CÒN HÀNG' 
  },
];

export const GoodsPage: React.FC = () => {
  const { setSidebarCollapsed, isSidebarCollapsed, isDarkMode } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  return (
    <div className={`flex flex-col w-full h-full relative pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f8f9fc]'}`}>
      
      {/* 1. Header Area */}
      <div className={`flex items-center justify-between px-4 pt-6 pb-2 sticky top-0 z-[100] transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f8f9fc]'}`}>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="w-8 h-8 flex items-center justify-start border-none bg-transparent outline-none p-0 cursor-pointer active:opacity-70"
          >
            <ContainerOutlined className={`text-xl ${isDarkMode ? 'text-[#60a5fa]' : 'text-[#1e3ba1]'}`} />
          </button>
          <span className={`text-[18px] font-extrabold tracking-tight ${isDarkMode ? 'text-[#60a5fa]' : 'text-[#1e3ba1]'}`}>Inventory Manager</span>
        </div>
        <button className="w-8 h-8 flex items-center justify-end border-none bg-transparent outline-none p-0 cursor-pointer active:opacity-70">
           <BellOutlined className={`text-[20px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>
      </div>

      <div className="px-4 mt-2">
        {/* 2. Search Bar */}
        <div className="mb-4">
          <div className={`flex items-center h-[44px] rounded-[14px] px-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border border-gray-800' : 'bg-white'}`}>
            <SearchOutlined className={`text-lg mr-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm, SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 bg-transparent border-none outline-none text-[14px] ${isDarkMode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-700 placeholder-gray-400'}`}
            />
          </div>
        </div>

        {/* 3. Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
           <button 
             onClick={() => setActiveFilter('ALL')}
             className={`flex-shrink-0 flex items-center px-4 py-2 rounded-full border-none font-semibold text-[13px] transition-colors ${activeFilter === 'ALL' ? (isDarkMode ? 'bg-[#3b82f6] text-white shadow-md' : 'bg-[#1e3ba1] text-white shadow-md shadow-blue-900/20') : (isDarkMode ? 'bg-[#2a2a2c] text-gray-400' : 'bg-[#eef2f9] text-[#4b5563]')}`}
           >
             <FilterOutlined className="mr-1.5" /> Tất cả
           </button>
           <button 
             onClick={() => setActiveFilter('LOW')}
             className={`flex-shrink-0 flex items-center px-4 py-2 rounded-full border font-semibold text-[13px] transition-colors ${activeFilter === 'LOW' ? (isDarkMode ? 'bg-red-900/40 border-red-800 text-red-400' : 'bg-[#fff1f2] border-red-200 text-red-600') : (isDarkMode ? 'bg-[#1a1a1c] border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-[#4b5563]')}`}
           >
             <WarningOutlined className="mr-1.5" /> Sắp hết
           </button>
           <button 
             onClick={() => setActiveFilter('HIDDEN')}
             className={`flex-shrink-0 flex items-center px-4 py-2 rounded-full border font-semibold text-[13px] transition-colors ${activeFilter === 'HIDDEN' ? (isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-800') : (isDarkMode ? 'bg-[#1a1a1c] border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-[#4b5563]')}`}
           >
             <StopOutlined className="mr-1.5" /> Đang ẩn
           </button>
        </div>

        {/* 4. Statistics Dashboard */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-4 -mx-4 px-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className={`flex-shrink-0 w-[160px] rounded-[16px] p-4 relative shadow-sm border-l-[3px] border-[#3b82f6] overflow-hidden ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
            <span className="text-gray-500 text-[11px] font-bold tracking-wider uppercase block mb-1">
              Tổng mặt hàng
            </span>
            <div className={`text-[26px] font-extrabold leading-none mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              2,450
            </div>
          </div>
          <div className={`flex-shrink-0 w-[160px] rounded-[16px] p-4 relative shadow-sm border-l-[3px] border-[#6b7280] overflow-hidden ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
            <span className="text-gray-500 text-[11px] font-bold tracking-wider uppercase block mb-1">
              Đang kinh doanh
            </span>
            <div className={`text-[26px] font-extrabold leading-none mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              2,120
            </div>
          </div>
          <div className={`flex-shrink-0 w-[160px] rounded-[16px] p-4 relative shadow-sm border-l-[3px] border-[#ef4444] overflow-hidden ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
            <span className="text-gray-500 text-[11px] font-bold tracking-wider uppercase block mb-1">
              Hết hàng
            </span>
            <div className={`text-[26px] font-extrabold leading-none mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              330
            </div>
          </div>
        </div>

        {/* 5. Product List */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className={`text-[13px] font-bold tracking-wider uppercase m-0 ${isDarkMode ? 'text-gray-400' : 'text-[#374151]'}`}>Danh sách sản phẩm</h3>
            <span className="text-gray-500 text-[11px] font-medium">
              Hiển thị 12/2,450
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {productsData.map((item) => (
              <div key={item.id} className={`rounded-[16px] p-3 flex shadow-sm relative active:opacity-80 transition-colors ${isDarkMode ? 'bg-[#1a1a1c] border border-gray-800' : 'bg-white border border-transparent active:bg-gray-50'}`}>
                
                <div className={`w-[64px] h-[64px] rounded-xl flex items-center justify-center p-2 flex-shrink-0 overflow-hidden relative ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <img src={item.image} alt={item.name} className={`w-full h-full object-contain ${isDarkMode ? 'opacity-90' : 'mix-blend-multiply opacity-80'}`} />
                </div>

                <div className="ml-3 flex-1 min-w-0 pr-2 pt-0.5 relative pb-5">
                  <h4 className={`text-[14px] font-bold m-0 truncate leading-tight mb-0.5 pr-16 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.name}
                  </h4>
                  <div className={`text-[11px] mb-1.5 uppercase font-medium tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    SKU: {item.sku}
                  </div>
                  
                  <div className={`text-[12px] font-semibold absolute bottom-0 left-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    <span className="text-gray-500 font-medium">Kho: </span>
                    <span className={`${item.stock === 0 ? 'text-gray-500' : item.stock <= 5 ? 'text-red-500 font-bold' : (isDarkMode ? 'text-gray-200' : 'text-gray-900')}`}>
                      {item.stock}
                    </span>
                  </div>
                </div>

                <div className="absolute top-3 right-3 flex flex-col items-end h-[calc(100%-24px)] justify-between">
                  {/* Category Badge */}
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wide uppercase ${isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-[#dbeafe] text-[#2563eb]'}`}>
                    {item.category}
                  </span>

                  {/* Status Tag */}
                  <div>
                    {item.status === 'CÒN HÀNG' && (
                       <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 uppercase ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-[#ecfccb] text-[#4d7c0f]'}`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-[#65a30d]'}`}></span> Còn hàng
                       </span>
                    )}
                    {item.status === 'SẮP HẾT' && (
                       <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 uppercase ${isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-[#fee2e2] text-[#b91c1c]'}`}>
                         <WarningOutlined /> Sắp hết
                       </span>
                    )}
                    {item.status === 'HẾT HÀNG' && (
                       <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 uppercase ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-[#f3f4f6] text-[#6b7280]'}`}>
                         <StopOutlined /> Hết hàng
                       </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button (+) */}
      <button className="fixed right-5 bottom-[90px] w-[56px] h-[56px] rounded-full bg-[#1e3ba1] text-white shadow-lg flex items-center justify-center border-none outline-none active:scale-95 transition-transform z-20 cursor-pointer">
        <PlusOutlined className="text-[26px]" />
      </button>

      {/* Basic inline style to hide scrollbar for webkit (Chrome/Safari) */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </div>
  );
};

export default GoodsPage;
