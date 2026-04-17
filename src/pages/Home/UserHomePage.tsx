import React from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { useAuthStore } from '@/stores/auth.store';
import { useGetMyTasks, useUpdateTaskStatusMutation } from '@/hooks/useTasks';
import {
  BellOutlined,
  ThunderboltFilled,
  ArrowRightOutlined,
  PlayCircleOutlined,
  LoadingOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'zmp-ui';
import { Spin, Skeleton } from 'antd';

export const UserHomePage: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: tasks = [], isLoading } = useGetMyTasks();
  const { mutate: updateStatus, isPending } = useUpdateTaskStatusMutation();

  // Safeguard: Nếu chưa có user (đang nạp session), hiện loading
  if (!user && !isLoading) {
    return (
      <div className="p-5">
        <Spin tip="Đang xác thực...">
          <Skeleton active paragraph={{ rows: 10 }} />
        </Spin>
      </div>
    );
  }

  // Lọc các task mới chưa nhận (TO DO)
  const todoTasks = tasks.filter(t => t.status === 'TO DO').slice(0, 3);
  const inProgressTasks = tasks.filter(t => t.status === 'IN PROGRESS');

  const handleAcceptTask = (taskId: string) => {
    updateStatus({ taskId, status: 'IN PROGRESS' }, {
      onSuccess: () => {
        // Sau khi nhận xong có thể chuyển sang trang Tasks để làm tiếp
        navigate('/tasks');
      }
    });
  };

  return (
    <div className={`flex flex-col w-full min-h-screen pb-[90px] ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f4f5f8]'}`}>
      {/* 1. Top Header Profile */}
      <div className="px-5 pt-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm overflow-hidden bg-blue-50">
            <img src={user?.avatar || 'https://i.pravatar.cc/150'} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Chào buổi sáng,</span>
            <span className={`text-[18px] font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {user?.name || 'Thành viên'} 👋
            </span>
          </div>
        </div>
        <button className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-600'}`}>
          <BellOutlined className="text-[18px]" />
        </button>
      </div>

      {/* 2. Quick Stats Card */}
      <div className="px-5 mb-8">
        <div className="bg-gradient-to-br from-[#1e3ba1] to-[#2563eb] rounded-[28px] p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-blue-100 opacity-80 uppercase tracking-wider">Việc đang thực hiện</span>
              <span className="text-[36px] font-black leading-none mt-1">{inProgressTasks.length}</span>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <ThunderboltFilled className="text-[20px] text-yellow-300" />
            </div>
          </div>
          <button
            onClick={() => navigate('/tasks')}
            className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-[13px] font-black tracking-wide border-none text-white flex items-center justify-center gap-2 transition-colors"
          >
            ĐẾN BẢNG CÔNG VIỆC <ArrowRightOutlined />
          </button>
        </div>
      </div>

      {/* 3. "Công việc mới chờ nhận" Section */}
      <div className="px-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-[17px] font-black tracking-tight m-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Công việc mới chờ nhận
          </h2>
          <span className="text-[12px] font-bold text-[#2563eb]">Xem tất cả</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </div>
        ) : todoTasks.length > 0 ? (
          <div className="flex flex-col gap-3">
            {todoTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-[22px] border shadow-sm flex flex-col gap-3 transition-colors ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-white'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-black py-0.5 px-2 rounded-md bg-blue-50 text-[#1e3ba1] w-fit uppercase tracking-tighter`}>
                      {task.category}
                    </span>
                    <h3 className={`text-[15px] font-bold m-0 leading-snug ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <ClockCircleOutlined className="text-[12px]" />
                    <span className="text-[11px] font-bold">{task.date || 'Hôm nay'}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAcceptTask(task.id)}
                  disabled={isPending}
                  className="w-full py-2.5 bg-[#f0f4ff] hover:bg-[#e0e8ff] text-[#1e3ba1] rounded-[14px] text-[13px] font-bold border-none transition-colors flex items-center justify-center gap-2"
                >
                  {isPending ? <LoadingOutlined /> : <PlayCircleOutlined />} Nhận việc ngay
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-8 rounded-[24px] border border-dashed flex flex-col items-center justify-center gap-2 ${isDarkMode ? 'border-gray-800 text-gray-600' : 'border-gray-200 text-gray-400'}`}>
            <span className="text-[32px]">✨</span>
            <span className="text-[13px] font-bold">Hiện không có công việc mới</span>
          </div>
        )}
      </div>

      {/* 4. Support Shortcut */}
      <div className="px-5 mt-8 mb-4">
        <div className={`p-4 rounded-[24px] flex items-center gap-4 ${isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50'}`}>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <img src="/icons/headphone.svg" alt="support" className="w-6 h-6 brightness-0 text-[#1e3ba1]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[#1e3ba1]">Cần hỗ trợ?</span>
            <span className="text-[11px] font-medium text-gray-500">Liên hệ admin hoặc bộ phận IT ngay.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHomePage;
