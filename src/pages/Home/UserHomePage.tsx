import React from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { useAuthStore } from '@/stores/auth.store';
import { useGetMyTasks, useUpdateTaskStatusMutation } from '@/hooks/useTasks';
import { useGetMyProgress } from '@/hooks/useReports';
import {
  BellOutlined,
  ThunderboltFilled,
  ArrowRightOutlined,
  PlayCircleOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
  CameraOutlined,
  CheckCircleFilled,
  StarFilled,
  TrophyFilled
} from '@ant-design/icons';
import { useNavigate, Page } from 'zmp-ui';
import { Spin, Skeleton, Progress } from 'antd';

export const UserHomePage: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: tasks = [], isLoading } = useGetMyTasks();
  const { data: progress } = useGetMyProgress();
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
    <Page className={`flex flex-col w-full min-h-screen pb-[90px] ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f4f5f8]'}`}>
      {/* 1. Top Header Profile */}
      <div className="px-5 pt-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm overflow-hidden bg-blue-50">
            <img src={user?.avatar || 'https://i.pravatar.cc/150'} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Chào buổi sáng,</span>
            <span className={`text-[18px] font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {user?.fullName || user?.name || user?.username || 'Thành viên'} 👋
            </span>
          </div>
        </div>
        <button className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-600'}`}>
          <BellOutlined className="text-[18px]" />
        </button>
      </div>

      {/* 2. Face Registration CTA (Only if not registered) */}
      {!user?.isFaceRegistered && (
        <div className="px-5 mb-6">
          <div className={`p-5 rounded-[28px] flex items-center justify-between gap-4 border-2 border-dashed border-blue-400 bg-blue-50/50 shadow-sm transition-all hover:bg-blue-50`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                <CameraOutlined className="text-2xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-black text-[#1e3ba1] leading-tight">Đăng ký khuôn mặt</span>
                <span className="text-[11px] font-medium text-blue-600/70">Để bắt đầu chấm công nhanh hơn</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/register-face')}
              className="px-5 py-2.5 bg-blue-600 text-white text-[12px] font-black rounded-xl border-none shadow-md active:scale-90 transition-transform"
            >
              ĐĂNG KÝ NGAY
            </button>
          </div>
        </div>
      )}

      {/* 3. Quick Stats Card */}
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

      {/* 4. Personal Performance Dashboard */}
      <div className="px-5 mb-8">
        <div className={`p-6 rounded-[28px] border shadow-sm ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-white'}`}>
          <div className="flex justify-between items-center mb-5">
            <h2 className={`text-[17px] font-black tracking-tight m-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Bảng thành tích
            </h2>
            <StarFilled className="text-yellow-400 text-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-blue-50/50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircleFilled className="text-green-500 text-xs" />
                <span className="text-[11px] font-bold text-gray-500 uppercase">Hoàn thành</span>
              </div>
              <span className={`text-[20px] font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{progress?.doneTasks || 0}</span>
              <span className="text-[12px] text-gray-400 ml-1">/ {progress?.totalTasks || 0}</span>
            </div>

            <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-orange-50/50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <TrophyFilled className="text-orange-400 text-xs" />
                <span className="text-[11px] font-bold text-gray-500 uppercase">Hiệu suất</span>
              </div>
              <span className={`text-[20px] font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{Math.round(progress?.completionPercentage || 0)}%</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[12px] font-bold">
              <span className="text-gray-500 uppercase tracking-tighter">Tiến độ tháng này</span>
              <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{Math.round(progress?.completionPercentage || 0)}%</span>
            </div>
            <Progress 
               percent={progress?.completionPercentage || 0} 
               showInfo={false} 
               strokeColor={{ '0%': '#1e3ba1', '100%': '#2563eb' }}
               trailColor={isDarkMode ? '#333' : '#f0f4ff'}
               strokeWidth={10}
            />
          </div>
        </div>
      </div>

      {/* 5. "Công việc mới chờ nhận" Section */}
      <div className="px-5 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-[17px] font-black tracking-tight m-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Đang chờ bạn
          </h2>
          <span className="text-[12px] font-bold text-[#2563eb]" onClick={() => navigate('/tasks')}>Xem tất cả</span>
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

      {/* 6. Quick Actions Grid */}
      <div className="px-5 mb-8">
        <h2 className={`text-[17px] font-black tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Tiện ích nhanh
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: '/icons/attendance.svg', label: 'Chấm công', path: '/checkin', color: 'bg-orange-100 text-orange-600' },
            { icon: '/icons/leave.svg', label: 'Nghỉ phép', path: '/settings', color: 'bg-green-100 text-green-600' },
            { icon: '/icons/payroll.svg', label: 'Bảng lương', path: '/finance', color: 'bg-purple-100 text-purple-600' },
            { icon: '/icons/news.svg', label: 'Tin tức', path: '/user-home', color: 'bg-blue-100 text-blue-600' },
          ].map((action, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2" onClick={() => navigate(action.path)}>
              <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center shadow-sm active:scale-90 transition-transform`}>
                 <img src={action.icon} alt={action.label} className="w-7 h-7" style={{ filter: 'brightness(1)' }} 
                  onError={(e) => {
                     (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/icons/svg?seed=' + action.label;
                  }}
                 />
              </div>
              <span className="text-[11px] font-bold text-gray-500 text-center">{action.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Company News / Announcements */}
      <div className="px-5 mb-4">
        <div className={`p-5 rounded-[28px] overflow-hidden relative ${isDarkMode ? 'bg-gray-800' : 'bg-gray-900'} text-white`}>
           <div className="flex flex-col gap-1 relative z-10">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Tin công ty</span>
              <h3 className="text-[16px] font-black leading-tight mb-2">Thông báo lịch nghỉ lễ Quốc khánh 02/09</h3>
              <p className="text-[12px] opacity-70 line-clamp-2">Toàn thể cán bộ nhân viên được nghỉ 02 ngày từ ngày 01/09 đến hết...</p>
           </div>
           <div className="absolute top-0 right-0 p-4 opacity-20">
              <ThunderboltFilled className="text-4xl" />
           </div>
           <div className="mt-4 flex items-center justify-between relative z-10">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-gray-900 bg-gray-700 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                 </div>)}
                 <div className="w-6 h-6 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-[8px] font-bold">+12</div>
              </div>
              <span className="text-[11px] font-bold text-blue-400">Xem chi tiết</span>
           </div>
        </div>
      </div>

      {/* 8. Support Shortcut */}
      <div className="px-5 mt-4 mb-4">
        <div className={`p-4 rounded-[24px] flex items-center gap-4 ${isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50'}`}>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Support" alt="support" className="w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[#1e3ba1]">Trung tâm trợ giúp</span>
            <span className="text-[11px] font-medium text-gray-500">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.</span>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default UserHomePage;
