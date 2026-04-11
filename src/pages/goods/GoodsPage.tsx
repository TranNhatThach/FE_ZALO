import React, { useState } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { 
  MenuOutlined, 
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
    image: 'https://cdn-icons-png.flaticon.com/512/0/191.png', // Placeholder
    stock: 120, 
    category: 'ĐIỆN TỬ', 
    status: 'CÒN HÀNG' 
  },
  { 
    id: '2', 
    name: 'Herman Miller Aeron', 
    sku: 'HM-AER-GRB-B', 
    image: 'https://cdn-icons-png.flaticon.com/512/2627/2627252.png', // Placeholder
    stock: 5, 
    category: 'NỘI THẤT', 
    status: 'SẮP HẾT' 
  },
  { 
    id: '3', 
    name: 'Sony WH-1000XM5', 
    sku: 'SONY-WHXM5-B', 
    image: 'https://cdn-icons-png.flaticon.com/512/272/272365.png', // Placeholder
    stock: 0, 
    category: 'ĐIỆN TỬ', 
    status: 'HẾT HÀNG' 
  },
  { 
    id: '4', 
    name: 'Classic Wrist Watch', 
    sku: 'ACC-WAT-0922', 
    image: 'https://cdn-icons-png.flaticon.com/512/2784/2784459.png', // Placeholder
    stock: 42, 
    category: 'PHỤ KIỆN', 
    status: 'CÒN HÀNG' 
  },
];

export const GoodsPage: React.FC = () => {
  const { setSidebarCollapsed, isSidebarCollapsed } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  return (
    <div className="flex flex-col w-full h-full bg-[#f8f9fc] relative pb-20">
      
      {/* 1. Header Area */}
      <div className="bg-[#f8f9fc] flex items-center justify-between px-4 pt-6 pb-2 sticky top-0 z-[100]">
        <div className="flex items-center gap-2">
          {/* Custom Header with specific icon instead of hamburger, but user design showed Inbox icon then text. Wait, user specifically wants Sidebar functionality so we use MenuOutlined but style it like the box. However, the image shows a box icon "Inventory Manager". Then a bell. */}
          {/* In the image there is a hamburger-like icon but it looks like a Box/Drawer. I'll use ContainerOutlined and bind it to Sidebar for consistency. */}
          <button 
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="w-8 h-8 flex items-center justify-start border-none bg-transparent outline-none p-0 cursor-pointer active:opacity-70"
          >
            <ContainerOutlined className="text-xl text-[#1e3ba1]" />
          </button>
          <span className="text-[18px] font-extrabold text-[#1e3ba1] tracking-tight">Inventory Manager</span>
        </div>
        <button className="w-8 h-8 flex items-center justify-end border-none bg-transparent outline-none p-0 cursor-pointer active:opacity-70">
           <BellOutlined className="text-[20px] text-gray-500" />
        </button>
      </div>

      <div className="px-4 mt-2">
        {/* 2. Search Bar */}
        <div className="mb-4">
          <div className="flex items-center bg-white h-[44px] rounded-[14px] px-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <SearchOutlined className="text-gray-400 text-lg mr-2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm, SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[14px] text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* 3. Filter Chips (Scrollable) */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
           <button 
             onClick={() => setActiveFilter('ALL')}
             className={`flex-shrink-0 flex items-center px-4 py-2 rounded-full border-none font-semibold text-[13px] transition-colors ${activeFilter === 'ALL' ? 'bg-[#1e3ba1] text-white shadow-md shadow-blue-900/20' : 'bg-[#eef2f9] text-[#4b5563]'}`}
           >
             <FilterOutlined className="mr-1.5" /> Tất cả
           </button>
           <button 
             onClick={() => setActiveFilter('LOW')}
             className={`flex-shrink-0 flex items-center px-4 py-2 rounded-full border border-gray-200 bg-white font-semibold text-[13px] transition-colors ${activeFilter === 'LOW' ? 'bg-[#fff1f2] border-red-200 text-red-600' : 'text-[#4b5563]'}`}
           >
             <WarningOutlined className="mr-1.5" /> Sắp hết
           </button>
           <button 
             onClick={() => setActiveFilter('HIDDEN')}
             className={`flex-shrink-0 flex items-center px-4 py-2 rounded-full border border-gray-200 bg-white font-semibold text-[13px] transition-colors ${activeFilter === 'HIDDEN' ? 'bg-gray-100 text-gray-800' : 'text-[#4b5563]'}`}
           >
             <StopOutlined className="mr-1.5" /> Đang ẩn
           </button>
        </div>

        {/* 4. Statistics Dashboard */}
        {/* We use a horizontal scroll view for the cards to allow "peeking" the third card */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-4 -mx-4 px-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Card 1: Tổng */}
          <div className="flex-shrink-0 w-[160px] bg-white rounded-[16px] p-4 relative shadow-[0_4px_16px_rgba(0,0,0,0.03)] border-l-[3px] border-[#1e40af] overflow-hidden">
            <span className="text-[#6b7280] text-[11px] font-bold tracking-wider uppercase block mb-1">
              TỔNG MẶT HÀNG
            </span>
            <div className="text-gray-900 text-[26px] font-extrabold leading-none mt-2">
              2,450
            </div>
          </div>

          {/* Card 2: Đang kinh doanh */}
          <div className="flex-shrink-0 w-[160px] bg-white rounded-[16px] p-4 relative shadow-[0_4px_16px_rgba(0,0,0,0.03)] border-l-[3px] border-[#374151] overflow-hidden">
            <span className="text-[#6b7280] text-[11px] font-bold tracking-wider uppercase block mb-1 hover:whitespace-normal">
              ĐANG KINH DOANH
            </span>
            <div className="text-gray-900 text-[26px] font-extrabold leading-none mt-2">
              2,120
            </div>
          </div>

          {/* Card 3: Hết hàng (Peek) */}
          <div className="flex-shrink-0 w-[160px] bg-white rounded-[16px] p-4 relative shadow-[0_4px_16px_rgba(0,0,0,0.03)] border-l-[3px] border-[#ef4444] overflow-hidden">
            <span className="text-[#6b7280] text-[11px] font-bold tracking-wider uppercase block mb-1">
              HẾT HÀNG
            </span>
            <div className="text-gray-900 text-[26px] font-extrabold leading-none mt-2">
              330
            </div>
          </div>
        </div>

        {/* 5. Product List */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[#374151] text-[13px] font-bold tracking-wider uppercase m-0">Danh sách sản phẩm</h3>
            <span className="text-gray-500 text-[11px] font-medium">
              Hiển thị 12/2,450
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {productsData.map((item) => (
              <div key={item.id} className="bg-white rounded-[16px] p-3 flex shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative active:bg-gray-50 transition-colors">
                
                {/* Image Thumbnail */}
                <div className="w-[64px] h-[64px] rounded-xl bg-gray-100 flex items-center justify-center p-2 flex-shrink-0 overflow-hidden relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply opacity-80" />
                  {/* Subtle dark overlay for premium feel */}
                  <div className="absolute inset-0 bg-black/[0.02] rounded-xl pointer-events-none"></div>
                </div>

                {/* Info Center */}
                <div className="ml-3 flex-1 min-w-0 pr-2 pt-0.5 relative pb-5">
                  <h4 className="text-[14px] font-bold text-gray-900 m-0 truncate leading-tight mb-0.5 pr-16">
                    {item.name}
                  </h4>
                  <div className="text-gray-400 text-[11px] mb-1.5 uppercase font-medium tracking-wide">
                    SKU: {item.sku}
                  </div>
                  
                  {/* Stock */}
                  <div className="text-[12px] font-semibold text-gray-900 absolute bottom-0 left-0">
                    <span className="text-gray-500 font-medium">Kho: </span>
                    <span className={`${item.stock === 0 ? 'text-gray-400' : item.stock <= 5 ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                      {item.stock}
                    </span>
                  </div>
                </div>

                {/* Badges Column (Right) */}
                <div className="absolute top-3 right-3 flex flex-col items-end h-[calc(100%-24px)] justify-between">
                  {/* Category Badge */}
                  <span className="px-2 py-0.5 rounded bg-[#dbeafe] text-[#2563eb] text-[9px] font-extrabold tracking-wide uppercase">
                    {item.category}
                  </span>

                  {/* Status Tag */}
                  <div>
                    {item.status === 'CÒN HÀNG' && (
                       <span className="px-2 py-0.5 rounded-full bg-[#ecfccb] text-[#4d7c0f] text-[9px] font-bold flex items-center gap-1 uppercase">
                         <span className="w-1.5 h-1.5 rounded-full bg-[#65a30d]"></span> Còn hàng
                       </span>
                    )}
                    {item.status === 'SẮP HẾT' && (
                       <span className="px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#b91c1c] text-[9px] font-bold flex items-center gap-1 uppercase">
                         <WarningOutlined /> Sắp hết
                       </span>
                    )}
                    {item.status === 'HẾT HÀNG' && (
                       <span className="px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#6b7280] text-[9px] font-bold flex items-center gap-1 uppercase">
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
      <button className="fixed right-5 bottom-[80px] w-[56px] h-[56px] rounded-full bg-[#1e3ba1] text-white shadow-[0_6px_20px_rgba(30,59,161,0.35)] flex items-center justify-center border-none outline-none active:scale-95 transition-transform z-20 cursor-pointer">
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
