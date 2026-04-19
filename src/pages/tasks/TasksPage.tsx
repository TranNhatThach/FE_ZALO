import React, { useState } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import {
  SearchOutlined,
  StarFilled,
  FilterOutlined,
  PlusOutlined,
  CalendarOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  CameraOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useGetMyTasks, useGetTasksByTenant, useUpdateTaskStatusMutation } from '@/hooks/useTasks';
import { Task, TaskStatus } from '@/types/task.types';
import { ReportUploadModal } from './ReportUploadModal';
import { useNavigate } from 'zmp-ui';
import { useAuthStore } from '@/stores/auth.store';
import { CreateTaskModal } from './CreateTaskModal';

// ──────────────────────────────────────────────────────────────────────────────
// TaskCard Component
// ──────────────────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: Task;
  onReportClick?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onReportClick }) => {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const allRoles = [...(user?.roles || []), user?.roleName || ''].join(',').toUpperCase();
  const isAdmin = allRoles.includes('ADMIN');
  const { mutate: updateStatus, isPending } = useUpdateTaskStatusMutation();

  const handleAccept = () => {
    updateStatus({ taskId: task.id, status: 'IN PROGRESS' });
  };

  const handleComplete = () => {
    // Nếu là nhân viên bấm hoàn thành, chuyển sang REVIEW. Nếu admin bấm, chuyển sang DONE.
    const targetStatus = isAdmin ? 'DONE' : 'REVIEW';
    updateStatus({ taskId: task.id, status: targetStatus });
  };

  const categoryColors: Record<string, string> = {
    MARKETING: 'bg-blue-100 text-blue-600',
    TECHNICAL: 'bg-teal-100 text-teal-700',
    DESIGN: 'bg-purple-100 text-purple-600',
    DEFAULT: 'bg-gray-100 text-gray-600',
  };

  const priorityColors: Record<string, string> = {
    HIGH: 'text-red-500',
    MEDIUM: 'text-orange-500',
    LOW: 'text-gray-400',
  };

  const categoryClass = categoryColors[task.category] ?? categoryColors.DEFAULT;
  const priorityClass = priorityColors[task.priority] ?? 'text-gray-400';

  // Format ngày hiển thị: ưu tiên field date, fallback dueDate
  const displayDate = task.date ?? (task.dueDate ? task.dueDate.slice(0, 10) : null);

  return (
    <div
      className={`rounded-[20px] p-4 flex flex-col border shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-transform ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-100'
        }`}
    >
      {/* Row 1: Category Badge + Priority */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-md text-[9px] font-black tracking-widest uppercase ${categoryClass}`}>
          {task.category}
        </span>
        <span className={`text-[9px] font-black tracking-widest uppercase ${priorityClass}`}>
          {task.priority}
        </span>
      </div>

      {/* Row 2: Title */}
      <h5 className={`text-[15px] font-bold leading-snug mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        {task.title}
      </h5>

      {/* Row 3: Date + Avatar */}
      <div className="flex items-center justify-between mt-auto mb-3">
        <div className="flex items-center gap-1.5 text-gray-400">
          <CalendarOutlined className="text-[14px]" />
          <span className="text-[12px] font-semibold">{displayDate ?? '—'}</span>
        </div>
        {task.avatar ? (
          <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
            <img src={task.avatar} alt="assignee" className="w-full h-full object-cover bg-gray-50" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
            <span className="text-[9px] font-bold text-blue-600">
              {task.assigneeName ? task.assigneeName.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
        )}
      </div>

      {/* Row 4: Action Buttons */}
      <div className="flex gap-2 mt-1">
        {/* Người dùng: Nhận việc */}
        {task.status === 'TO DO' && !isAdmin && (
          <button
            onClick={handleAccept}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold border border-[#1d4ed8] text-[#1d4ed8] bg-transparent active:scale-95 transition-all disabled:opacity-50"
          >
            {isPending ? <LoadingOutlined className="text-[13px]" /> : <PlayCircleOutlined className="text-[13px]" />}
            Nhận việc
          </button>
        )}

        {/* Người dùng: Báo cáo */}
        {task.status === 'IN PROGRESS' && !isAdmin && (
          <button
            onClick={() => onReportClick && onReportClick(task)}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold border border-orange-500 text-orange-600 bg-orange-50 active:scale-95 transition-all disabled:opacity-50"
          >
            <CameraOutlined className="text-[13px]" />
            Báo cáo
          </button>
        )}

        {/* Admin: Phê duyệt (Trong bước REVIEW) */}
        {task.status === 'REVIEW' && isAdmin && (
          <button
            onClick={handleComplete}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold bg-emerald-600 text-white border-none active:scale-95 transition-all shadow-sm shadow-emerald-900/10"
          >
            {isPending ? <LoadingOutlined className="text-[13px]" /> : <CheckCircleOutlined className="text-[13px]" />}
            Phê duyệt
          </button>
        )}

        {/* Hiển thị trạng thái chờ duyệt cho nhân viên */}
        {task.status === 'REVIEW' && !isAdmin && (
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter bg-orange-50 text-orange-600 border border-orange-100">
             Đang chờ duyệt...
          </div>
        )}

        {/* Nút Hoàn thành nhanh (cho phép cả 2 nếu cần) */}
        {(task.status === 'TO DO' || task.status === 'IN PROGRESS') && (
            <button
                onClick={handleComplete}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold bg-[#1e3ba1] text-white border-none active:scale-95 transition-all disabled:opacity-50 shadow-sm shadow-blue-900/20"
            >
                {isPending ? <LoadingOutlined className="text-[13px]" /> : <CheckCircleOutlined className="text-[13px]" />}
                Xong
            </button>
        )}
      </div>

      {/* Badge khi đã DONE */}
      {task.status === 'DONE' && (
        <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 mt-1">
          <CheckCircleOutlined />
          Đã hoàn thành
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// TasksPage
// ──────────────────────────────────────────────────────────────────────────────

export const TasksPage: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const allRoles = [...(user?.roles || []), user?.roleName || ''].join(',').toUpperCase();
  const isAdmin = allRoles.includes('ADMIN');
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'KANBAN' | 'LIST'>('KANBAN');
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedTaskToReport, setSelectedTaskToReport] = useState<Task | null>(null);

  // ─── API Data ────────────────────────────────────────────────────────────────
  const myTasksQuery = useGetMyTasks();
  const tenantTasksQuery = useGetTasksByTenant(isAdmin ? user?.tenantId : undefined);

  const activeQuery = isAdmin ? tenantTasksQuery : myTasksQuery;
  const { data: tasks = [], isLoading, isError, error, refetch } = activeQuery;

  const todoTasks = tasks.filter((t) => t.status === 'TO DO');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN PROGRESS');
  const reviewTasks = tasks.filter((t) => t.status === 'REVIEW');
  const doneTasks = tasks.filter((t) => t.status === 'DONE');

  // Stats
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;

  // SVG progress circle math
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  // ─── Render ──────────────────────────────────────────────────────────────────
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
        <div className="flex items-center gap-2">
          {!isAdmin && (
            <button
              onClick={() => navigate('/checkin')}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 text-teal-600 border border-teal-200 text-[11px] font-bold active:scale-95 transition-transform"
            >
              <EnvironmentOutlined /> Chấm Công
            </button>
          )}
          <button className="w-8 h-8 rounded-full flex items-center justify-center border-none bg-transparent outline-none p-0 cursor-pointer active:scale-90 transition-transform">
            <SearchOutlined className={`text-[20px] ${isDarkMode ? 'text-gray-300' : 'text-[#1e3ba1]'}`} />
          </button>
        </div>
      </div>

      <div className="px-5 mt-10">
        {/* Title Section */}
        <div className="mb-5">
          <h2 className={`text-[22px] font-black tracking-tight mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {isAdmin ? 'Quản lý Công việc' : 'Việc của tôi'}
          </h2>
          <p className="text-[12px] text-gray-500 font-medium tracking-wide">
            {isAdmin ? 'Theo dõi tiến độ và hiệu suất công việc của hệ thống' : 'Theo dõi tiến độ và hiệu suất làm việc của bạn'}
          </p>
        </div>

        {/* 2. Progress Overview Dashboard */}
        <div className="flex gap-3 mb-6">
          {/* Progress Ring Card */}
          <div className={`flex-1 rounded-[20px] p-4 flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(30,59,161,0.04)] relative overflow-hidden ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
            <div className="absolute top-3 right-3 text-blue-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 3l-6 6" /><path d="M21 3v6" /><path d="M21 3h-6" /><path d="M14 10l-4-4-9 9" />
              </svg>
            </div>

            {isLoading ? (
              <LoadingOutlined className="text-[#1e3ba1] text-[32px]" />
            ) : (
              <div className="relative w-[100px] h-[100px] mt-2 mb-2 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={radius} stroke="#f1f5f9" strokeWidth="8" fill="none" />
                  <circle
                    cx="50" cy="50" r={radius}
                    stroke="#1e3ba1" strokeWidth="10" fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-[22px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-[#1e3ba1]'}`}>
                    {completionRate}%
                  </span>
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">Tiến độ</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 w-[140px]">
            {/* New Tasks */}
            <div className="bg-[#eef2ff] rounded-[16px] p-3 flex flex-col shadow-sm">
              <span className="text-[#1d4ed8] text-[9px] font-black uppercase tracking-wider mb-1">MỚI & ĐANG LÀM</span>
              <span className="text-[#1e3ba1] text-[24px] font-black">{todoTasks.length + inProgressTasks.length}</span>
            </div>
            {/* Completed Tasks */}
            <div className="bg-[#f8fafc] rounded-[16px] p-3 flex flex-col shadow-sm border border-gray-100">
              <span className="text-gray-500 text-[9px] font-black uppercase tracking-wider mb-1">ĐÃ XONG</span>
              <span className="text-gray-800 text-[24px] font-black">{doneTasks.length}</span>
            </div>
          </div>
        </div>

        {/* 3. Important Task Banner */}
        <div className="bg-gradient-to-br from-[#1e3ba1] to-[#2563eb] rounded-[24px] p-5 text-white mb-6 shadow-lg shadow-blue-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-10 -mr-10 pointer-events-none" />
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

        {/* ── Loading State ── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <LoadingOutlined className="text-[#1e3ba1] text-[36px]" />
            <p className={`text-[13px] font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Đang tải danh sách công việc…
            </p>
          </div>
        )}

        {/* ── Error State ── */}
        {isError && !isLoading && (
          <div className={`rounded-[20px] p-6 flex flex-col items-center gap-3 border ${isDarkMode ? 'bg-[#1a1a1c] border-red-900/40' : 'bg-red-50 border-red-100'}`}>
            <span className="text-[32px]">⚠️</span>
            <p className="text-[13px] font-bold text-red-500 text-center m-0">
              {(error as Error)?.message ?? 'Không thể tải công việc'}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-1 px-5 py-2 rounded-xl bg-[#1e3ba1] text-white text-[12px] font-bold border-none outline-none active:scale-95 transition-transform"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* ── Empty State ── */}
        {!isLoading && !isError && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-[48px]">📋</span>
            <p className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Bạn chưa có công việc nào
            </p>
          </div>
        )}

        {/* ── Board Columns (Kanban) ── */}
        {!isLoading && !isError && tasks.length > 0 && viewMode === 'KANBAN' && (
          <div
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Column TO DO */}
            <div className="flex flex-col min-w-[280px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <h4 className="text-[12px] font-black text-gray-500 uppercase tracking-widest m-0">TO DO</h4>
                <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 ml-1">
                  {todoTasks.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {todoTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* Column IN PROGRESS */}
            <div className="flex flex-col min-w-[280px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1d4ed8]" />
                <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest m-0">IN PROGRESS</h4>
                <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 ml-1">
                  {inProgressTasks.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {inProgressTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onReportClick={(t) => {
                      setSelectedTaskToReport(t);
                      setReportModalVisible(true);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Column REVIEW */}
            <div className="flex flex-col min-w-[280px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                <h4 className="text-[12px] font-black text-orange-600 uppercase tracking-widest m-0">REVIEW</h4>
                <span className="w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center text-[10px] font-bold text-orange-600 ml-1">
                  {reviewTasks.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {reviewTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* Column DONE */}
            <div className="flex flex-col min-w-[280px] pr-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h4 className="text-[12px] font-black text-emerald-600 uppercase tracking-widest m-0">DONE</h4>
                <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600 ml-1">
                  {doneTasks.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {doneTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── List View ── */}
        {!isLoading && !isError && tasks.length > 0 && viewMode === 'LIST' && (
          <div className="flex flex-col gap-3 pb-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button (+) - Admin Only */}
      {isAdmin && (
        <button
          onClick={() => setCreateModalVisible(true)}
          className="fixed right-5 bottom-[90px] w-14 h-14 rounded-full bg-[#1e3ba1] text-white shadow-lg shadow-blue-900/30 flex items-center justify-center border-none outline-none active:scale-90 transition-transform z-20 cursor-pointer"
        >
          <PlusOutlined className="text-[24px] font-bold" />
        </button>
      )}

      {/* Report Upload Modal */}
      <ReportUploadModal
        visible={reportModalVisible}
        task={selectedTaskToReport}
        onClose={() => {
          setReportModalVisible(false);
          setSelectedTaskToReport(null);
        }}
        onSuccess={() => refetch()}
      />

      {/* Create Task Modal (Admin Only) */}
      <CreateTaskModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={() => refetch()}
      />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </div>
  );
};

export default TasksPage;
