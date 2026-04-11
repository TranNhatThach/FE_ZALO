import React, { useState } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import {
  SearchOutlined,
  StarFilled,
  FilterOutlined,
  PlusOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  BarsOutlined
} from '@ant-design/icons';

// Mock Data
const tasksData = [
  {
    id: '1',
    title: 'Thiết kế Campaign Social Media cho sự kiện Tech-Day',
    category: 'MARKETING',
    priority: 'HIGH',
    date: '15 Oct',
    status: 'TO DO',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Annie'
  },
  {
    id: '2',
    title: 'Fix lỗi hiển thị trên Zalo Mini App phiên bản iOS',
    category: 'TECHNICAL',
    priority: 'MEDIUM',
    date: '12 Oct',
    status: 'TO DO',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Bob'
  },
  {
    id: '3',
    title: 'UI/UX Review Dashboard mới',
    category: 'DESIGN',
    priority: 'LOW',
    date: '10 Oct',
    status: 'IN PROGRESS',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Cindy'
  }
];

export const TasksPage: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [viewMode, setViewMode] = useState<'KANBAN' | 'LIST'>('KANBAN');

  const todoTasks = tasksData.filter(t => t.status === 'TO DO');
  const inProgressTasks = tasksData.filter(t => t.status === 'IN PROGRESS');

  return (
    <div className={`flex flex-col w-full h-full relative pb-[90px] ${isDarkMode ? 'bg-[#121212]' : 'bg-[#fcfdff]'}`}>
      
      {/* 1. Header Workspace */}
      <div className={`flex items-center justify-between px-5 pt-6 pb-2 sticky top-0 z-[100] ${isDarkMode ? 'bg-[#121212]' : 'bg-[#fcfdff]'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ffe4e6] flex items-center justify-center border border-red-100">
            <span className="text-[#e11d48] font-bold text-lg">H</span>
          </div>
          <div>
            <h1 className="text-[17px] font-extrabold text-[#1e3ba1] m-0 tracking-tight leading-tight">Workspace</h1>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider m-0 mt-0.5">Quản lý Công việc</p>
          </div>
        </div>
        <button className="w-8 h-8 rounded-full flex items-center justify-center border-none bg-transparent outline-none p-0 cursor-pointer active:scale-90 transition-transform">
           <SearchOutlined className={`text-[20px] ${isDarkMode ? 'text-gray-300' : 'text-[#1e3ba1]'}`} />
        </button>
      </div>

      <div className="px-5 mt-4">
        {/* Title Section */}
        <div className="mb-5">
          <h2 className={`text-[22px] font-black tracking-tight mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quản lý Công việc</h2>
          <p className="text-[12px] text-gray-500 font-medium tracking-wide">Theo dõi tiến độ và hiệu suất làm việc của bạn</p>
        </div>

        {/* 2. Progress Overview Dashboard */}
        <div className="flex gap-3 mb-6">
          {/* Progress Ring Card */}
          <div className={`flex-1 rounded-[20px] p-4 flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(30,59,161,0.04)] relative overflow-hidden ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
             <div className="absolute top-3 right-3 text-blue-200">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3l-6 6"/><path d="M21 3v6"/><path d="M21 3h-6"/><path d="M14 10l-4-4-9 9"/></svg>
             </div>
             
             {/* Simple CSS Circular Progress */}
             <div className="relative w-[100px] h-[100px] mt-2 mb-2 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="#1e3ba1" strokeWidth="10" fill="none" strokeDasharray="251.2" strokeDashoffset="37.68" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-[22px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-[#1e3ba1]'}`}>85%</span>
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">Tiến độ</span>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-3 w-[140px]">
            {/* New Tasks */}
            <div className="bg-[#eef2ff] rounded-[16px] p-3 flex flex-col shadow-sm">
              <span className="text-[#1d4ed8] text-[9px] font-black uppercase tracking-wider mb-1">MỚI TẠO</span>
              <span className="text-[#1e3ba1] text-[24px] font-black">12</span>
            </div>
            {/* Completed Tasks */}
            <div className="bg-[#f8fafc] rounded-[16px] p-3 flex flex-col shadow-sm border border-gray-100">
              <span className="text-gray-500 text-[9px] font-black uppercase tracking-wider mb-1">ĐÃ XONG</span>
              <span className="text-gray-800 text-[24px] font-black">48</span>
            </div>
          </div>
        </div>

        {/* 3. Important Task Banner */}
        <div className="bg-gradient-to-br from-[#1e3ba1] to-[#2563eb] rounded-[24px] p-5 text-white mb-6 shadow-lg shadow-blue-900/20 relative overflow-hidden">
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-10 -mr-10 pointer-events-none"></div>
          
          <div className="flex items-center gap-2 mb-3">
             <StarFilled className="text-yellow-400 text-lg" />
             <h3 className="text-[15px] font-bold m-0 tracking-wide text-white">Công việc quan trọng</h3>
          </div>
          <p className="text-[12px] font-medium text-blue-100 leading-relaxed mb-4 opacity-90">
             Hoàn thiện báo cáo quý 3 và chuẩn bị tài liệu cho cuộc họp chiến lược vào sáng thứ Hai tới.
          </p>
          <button className="bg-white text-[#1e3ba1] text-[13px] font-bold py-2 px-4 rounded-xl border-none outline-none active:scale-95 transition-transform shadow-sm">
             Xem chi tiết
          </button>
        </div>

        {/* 4. Controls (Tabs + Filter) */}
        <div className="flex items-center justify-between mb-5">
           <div className={`flex bg-gray-100 rounded-full p-1 ${isDarkMode ? 'bg-[#2a2a2c]' : 'bg-gray-100'}`}>
              <button 
                onClick={() => setViewMode('KANBAN')}
                className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold border-none transition-colors ${viewMode === 'KANBAN' ? 'bg-white text-[#1d4ed8] shadow-sm' : 'bg-transparent text-gray-500'}`}
              >
                 Kanban
              </button>
              <button 
                onClick={() => setViewMode('LIST')}
                className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold border-none transition-colors ${viewMode === 'LIST' ? 'bg-white text-[#1d4ed8] shadow-sm' : 'bg-transparent text-gray-500'}`}
              >
                 Danh sách
              </button>
           </div>
           
           <button className={`flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-full bg-transparent border-none active:opacity-70 ${isDarkMode ? 'text-gray-300' : 'text-[#1e3ba1]'}`}>
             <FilterOutlined /> Lọc
           </button>
        </div>

        {/* 5. Board Columns (Scrollable horizontally) */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
           
           {/* Column TO DO */}
           <div className="flex flex-col min-w-[280px]">
              <div className="flex items-center gap-2 mb-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                 <h4 className="text-[12px] font-black text-gray-500 uppercase tracking-widest m-0">TO DO</h4>
                 <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 ml-1">{todoTasks.length}</span>
              </div>
              
              <div className="flex flex-col gap-3">
                 {todoTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                 ))}
              </div>
           </div>

           {/* Column IN PROGRESS */}
           <div className="flex flex-col min-w-[280px] pr-5">
              <div className="flex items-center gap-2 mb-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#1d4ed8]"></div>
                 <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest m-0">IN PROGRESS</h4>
                 <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 ml-1">{inProgressTasks.length}</span>
              </div>
              
              <div className="flex flex-col gap-3">
                 {inProgressTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                 ))}
              </div>
           </div>

        </div>
      </div>

      {/* Floating Action Button (+) */}
      <button className="fixed right-5 bottom-[90px] w-14 h-14 rounded-full bg-[#1e3ba1] text-white shadow-lg shadow-blue-900/30 flex items-center justify-center border-none outline-none active:scale-90 transition-transform z-20 cursor-pointer">
        <PlusOutlined className="text-[24px] font-bold" />
      </button>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </div>
  );
};

// Extracted Task Card Component
const TaskCard = ({ task }: { task: any }) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className={`rounded-[20px] p-4 flex flex-col border shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-transform ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-100'}`}>
      
      <div className="flex items-center justify-between mb-3">
         <span className={`px-2 py-1 rounded-md text-[9px] font-black tracking-widest uppercase ${task.category === 'MARKETING' ? 'bg-blue-100 text-blue-600' : task.category === 'TECHNICAL' ? 'bg-teal-100 text-teal-700' : 'bg-purple-100 text-purple-600'}`}>
           {task.category}
         </span>
         <span className={`text-[9px] font-black tracking-widest uppercase ${task.priority === 'HIGH' ? 'text-red-500' : task.priority === 'MEDIUM' ? 'text-orange-500' : 'text-gray-400'}`}>
           {task.priority}
         </span>
      </div>

      <h5 className={`text-[15px] font-bold leading-snug mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
         {task.title}
      </h5>

      <div className="flex items-center justify-between mt-auto">
         <div className="flex items-center gap-1.5 text-gray-400">
           <CalendarOutlined className="text-[14px]" />
           <span className="text-[12px] font-semibold">{task.date}</span>
         </div>
         <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
           <img src={task.avatar} alt="assignee" className="w-full h-full object-cover bg-gray-50" />
         </div>
      </div>

    </div>
  );
};

export default TasksPage;
