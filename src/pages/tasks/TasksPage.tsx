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
  RocketOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { 
  useGetMyTasks, 
  useGetTasksByTenant, 
  useGetUnassignedTasks,
  useClaimTaskMutation,
  useUpdateTaskStatusMutation 
} from '@/hooks/useTasks';
import { Task, TaskStatus } from '@/types/task.types';
import { TaskWorkflowModal } from './TaskWorkflowModal';
import { useNavigate, Page } from 'zmp-ui';
import { useAuthStore } from '@/stores/auth.store';
import { CreateTaskModal } from './CreateTaskModal';

// ──────────────────────────────────────────────────────────────────────────────
// TaskCard Component
// ──────────────────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: Task;
  onWorkflowClick?: (task: Task, mode: 'CHECK_IN' | 'COMPLETE') => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onWorkflowClick }) => {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const allRoles = [...(user?.roles || []), user?.roleName || ''].join(',').toUpperCase();
  const isAdmin = allRoles.includes('ADMIN');
  
  const { mutate: claimTask, isPending: isClaiming } = useClaimTaskMutation();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateTaskStatusMutation();

  const handleClaim = () => {
    claimTask(task.id);
  };

  const handleApprove = () => {
    updateStatus({ taskId: task.id, status: 'DONE' });
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

  const displayDate = task.date ?? (task.dueDate ? task.dueDate.slice(0, 10) : null);

  return (
    <div
      className={`rounded-[20px] p-4 flex flex-col border shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-transform ${
        isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-md text-[9px] font-black tracking-widest uppercase ${categoryClass}`}>
          {task.category}
        </span>
        <span className={`text-[9px] font-black tracking-widest uppercase ${priorityClass}`}>
          {task.priority}
        </span>
      </div>

      <h5 className={`text-[15px] font-bold leading-snug mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        {task.title}
      </h5>

      <div className="flex items-center justify-between mt-auto mb-3">
        <div className="flex items-center gap-1.5 text-gray-400">
          <CalendarOutlined className="text-[14px]" />
          <span className="text-[12px] font-semibold">{displayDate ?? '—'}</span>
        </div>
        
        {task.status === 'CHECKED IN' && (
            <div className="flex items-center gap-1 text-blue-500 text-[10px] font-bold">
                <EnvironmentOutlined /> Đã Check-in
            </div>
        )}

        <div className="flex items-center gap-2">
            {task.assigneeId ? (
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                    <span className="text-[9px] font-bold text-blue-600">
                        {task.assigneeName ? task.assigneeName.charAt(0).toUpperCase() : '?'}
                    </span>
                </div>
            ) : (
                <div className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-[9px] font-bold">
                    Cần người nhận
                </div>
            )}
        </div>
      </div>

      <div className="flex gap-2 mt-1">
        {/* CASE 1: Task chưa giao -> Nhân viên nhấn nhận việc */}
        {!task.assigneeId && !isAdmin && (
            <button
                onClick={handleClaim}
                disabled={isClaiming}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold bg-[#1e3ba1] text-white border-none active:scale-95 transition-all shadow-sm shadow-blue-900/20"
            >
                {isClaiming ? <LoadingOutlined /> : <UsergroupAddOutlined />} Nhận việc ngay
            </button>
        )}

        {/* CASE 2: Task TO DO (Đã giao) -> Bắt đầu làm (Check-in) */}
        {task.status === 'TO DO' && task.assigneeId && !isAdmin && (
          <button
            onClick={() => onWorkflowClick?.(task, 'CHECK_IN')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold bg-blue-50 text-[#1d4ed8] border border-blue-100 active:scale-95 transition-all"
          >
            <PlayCircleOutlined /> Bắt đầu làm
          </button>
        )}

        {/* CASE 3: Đã IN_PROGRESS (có thể đã nhận hoặc admin gán) -> Phải Check-in hiện trường */}
        {task.status === 'IN PROGRESS' && !isAdmin && (
            <button
              onClick={() => onWorkflowClick?.(task, 'CHECK_IN')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold bg-blue-50 text-[#1d4ed8] border border-blue-100 active:scale-95 transition-all"
            >
              <CameraOutlined /> Check-in hiện trường
            </button>
        )}

        {/* CASE 4: Đã CHECKED IN -> Nộp báo cáo hoàn thành */}
        {task.status === 'CHECKED IN' && !isAdmin && (
          <button
            onClick={() => onWorkflowClick?.(task, 'COMPLETE')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold bg-emerald-600 text-white border-none active:scale-95 transition-all shadow-sm shadow-emerald-900/20"
          >
            <CheckCircleOutlined /> Hoàn thành việc
          </button>
        )}

        {/* CASE 5: Chờ duyệt (REVIEW) */}
        {task.status === 'REVIEW' && !isAdmin && (
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold bg-gray-50 text-gray-400 border border-gray-100">
                Đang chờ phê duyệt...
            </div>
        )}

        {/* ADMIN: Phê duyệt (Dành cho task đang REVIEW) */}
        {task.status === 'REVIEW' && isAdmin && (
            <button
                onClick={handleApprove}
                disabled={isUpdating}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold bg-emerald-600 text-white border-none active:scale-95 transition-all shadow-sm shadow-emerald-900/20"
            >
                {isUpdating ? <LoadingOutlined /> : <CheckCircleOutlined />} Phê duyệt
            </button>
        )}

        {/* Hiển thị ĐÃ XONG */}
        {task.status === 'DONE' && (
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircleOutlined /> Công việc hoàn tất
            </div>
        )}
      </div>
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
  const [tab, setTab] = useState<'MY' | 'UNASSIGNED'>('MY');
  
  const [workflowModal, setWorkflowModal] = useState<{ visible: boolean, mode: 'CHECK_IN' | 'COMPLETE', task: Task | null }>({
    visible: false,
    mode: 'CHECK_IN',
    task: null
  });
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // ─── API Data ────────────────────────────────────────────────────────────────
  const myTasksQuery = useGetMyTasks();
  const tenantTasksQuery = useGetTasksByTenant(isAdmin ? user?.tenantId : undefined);
  const unassignedTasksQuery = useGetUnassignedTasks();

  const activeQuery = isAdmin ? tenantTasksQuery : (tab === 'MY' ? myTasksQuery : unassignedTasksQuery);
  const { data: tasks = [], isLoading, isError, error, refetch } = activeQuery;

  const todoTasks = tasks.filter((t) => t.status === 'TO DO' || t.status === 'IN PROGRESS');
  const activeTasks = tasks.filter((t) => t.status === 'CHECKED IN');
  const reviewTasks = tasks.filter((t) => t.status === 'REVIEW');
  const doneTasks = tasks.filter((t) => t.status === 'DONE');

  const showWorkflow = (task: Task, mode: 'CHECK_IN' | 'COMPLETE') => {
    setWorkflowModal({ visible: true, mode, task });
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <Page className={`flex flex-col w-full h-full relative pb-[90px] ${isDarkMode ? 'bg-[#121212]' : 'bg-[#fcfdff]'}`}>

      {/* 1. Header Workspace */}
      <div className={`flex items-center justify-between px-5 pt-6 pb-2 sticky top-0 z-[100] ${isDarkMode ? 'bg-[#121212]' : 'bg-[#fcfdff]'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
            <RocketOutlined className="text-[#1e3ba1] text-lg" />
          </div>
          <div>
            <h1 className="text-[17px] font-extrabold text-[#1e3ba1] m-0 tracking-tight leading-tight">TaskFlow</h1>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider m-0 mt-0.5">Quản lý Hiện trường</p>
          </div>
        </div>
        <button className="w-8 h-8 rounded-full flex items-center justify-center border-none bg-transparent outline-none p-0 cursor-pointer active:scale-90 transition-transform">
          <SearchOutlined className={`text-[20px] ${isDarkMode ? 'text-gray-300' : 'text-[#1e3ba1]'}`} />
        </button>
      </div>

      <div className="px-5 mt-6">
        {/* Tab Selection (User Only) */}
        {!isAdmin && (
          <div className="flex p-1 bg-gray-100 rounded-2xl mb-6">
            <button 
              onClick={() => setTab('MY')}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold border-none transition-all ${tab === 'MY' ? 'bg-white text-[#1e3ba1] shadow-sm' : 'bg-transparent text-gray-500'}`}
            >
              Việc của tôi
            </button>
            <button 
              onClick={() => setTab('UNASSIGNED')}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold border-none transition-all ${tab === 'UNASSIGNED' ? 'bg-white text-[#1e3ba1] shadow-sm' : 'bg-transparent text-gray-500'}`}
            >
              Việc chưa nhận
            </button>
          </div>
        )}

        {/* Title Content */}
        <div className="mb-6">
          <h2 className={`text-[24px] font-black tracking-tight mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {isAdmin ? 'Quản lý Tổng quát' : (tab === 'MY' ? 'Công việc hôm nay' : 'Cơ hội nhận việc')}
          </h2>
          <p className="text-[13px] text-gray-400 font-medium">
            {tab === 'MY' ? 'Bắt đầu ngày mới với các đầu việc đã được giao.' : 'Chọn thêm công việc phù hợp để tăng thu nhập.'}
          </p>
        </div>

        {/* Stats Overview (Brief) */}
        <div className="grid grid-cols-2 gap-3 mb-8">
           <div className={`p-4 rounded-3xl ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-[#eef2ff] border border-blue-50'}`}>
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Đang thực hiện</div>
                <div className="text-[28px] font-black text-[#1e3ba1] leading-none">{activeTasks.length + todoTasks.length}</div>
           </div>
           <div className={`p-4 rounded-3xl ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-[#f0fdf4] border border-emerald-50'}`}>
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Đã xong</div>
                <div className="text-[28px] font-black text-emerald-700 leading-none">{doneTasks.length}</div>
           </div>
        </div>

        {/* ── Kanban Columns ── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <LoadingOutlined className="text-[#1e3ba1] text-[36px]" />
            <p className="text-[13px] font-bold text-gray-400">Đang tải công việc...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
             <RocketOutlined className="text-[64px] text-gray-300" />
             <p className="text-[14px] font-bold text-gray-500">Hiện không có công việc nào!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            
            {/* NHÓM MỚI / ĐANG CHUẨN BỊ */}
            {(todoTasks.length > 0 || tab === 'UNASSIGNED') && (
                <div>
                   <div className="flex items-center gap-2 mb-4">
                      <div className="w-4 h-1 rounded-full bg-blue-400" />
                      <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest m-0">Sẵn sàng / Chưa nhận</h4>
                   </div>
                   <div className="flex flex-col gap-4">
                      {tasks.filter(t => t.status === 'TO DO' || t.status === 'IN PROGRESS').map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                      {tab === 'UNASSIGNED' && tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                   </div>
                </div>
            )}

            {/* NHÓM ĐÃ CHECK-IN (Đang làm tại hiện trường) */}
            {activeTasks.length > 0 && (
                <div>
                   <div className="flex items-center gap-2 mb-4">
                      <div className="w-4 h-1 rounded-full bg-orange-400" />
                      <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest m-0">Đang tại hiện trường</h4>
                   </div>
                   <div className="flex flex-col gap-4">
                      {activeTasks.map(task => (
                        <TaskCard key={task.id} task={task} onWorkflowClick={showWorkflow} />
                      ))}
                   </div>
                </div>
            )}

            {/* NHÓM CHỜ DUYỆT / XONG */}
            {(reviewTasks.length > 0 || doneTasks.length > 0) && (
                <div>
                   <div className="flex items-center gap-2 mb-4">
                      <div className="w-4 h-1 rounded-full bg-emerald-400" />
                      <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest m-0">Hoàn thành / Chờ duyệt</h4>
                   </div>
                   <div className="flex flex-col gap-4">
                      {[...reviewTasks, ...doneTasks].map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                   </div>
                </div>
            )}

          </div>
        )}
      </div>

      {/* Floating Action Button (+) - Admin Only */}
      {isAdmin && (
        <button
          onClick={() => setCreateModalVisible(true)}
          className="fixed right-5 bottom-[100px] w-14 h-14 rounded-full bg-[#1e3ba1] text-white shadow-lg shadow-blue-900/30 flex items-center justify-center border-none outline-none active:scale-90 transition-transform z-20 cursor-pointer"
        >
          <PlusOutlined className="text-[24px] font-bold" />
        </button>
      )}

      {/* Workflow Modal */}
      <TaskWorkflowModal
        visible={workflowModal.visible}
        mode={workflowModal.mode}
        task={workflowModal.task}
        onClose={() => setWorkflowModal(prev => ({ ...prev, visible: false }))}
        onSuccess={() => refetch()}
      />

      {/* Create Task Modal (Admin Only) */}
      <CreateTaskModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={() => refetch()}
      />
    </Page>
  );
};

export default TasksPage;
