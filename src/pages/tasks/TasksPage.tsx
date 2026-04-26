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
  ExportOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { message, Modal } from 'antd';
import {
  useGetMyTasks,
  useGetTasksByTenant,
  useGetUnassignedTasks,
  useClaimTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation
} from '@/hooks/useTasks';
import { Task, TaskStatus } from '@/types/task.types';
import { TaskWorkflowModal } from './TaskWorkflowModal';
import { useNavigate, Page } from 'zmp-ui';
import { useAuthStore } from '@/stores/auth.store';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskDetailsModal } from './TaskDetailsModal';
import dayjs from 'dayjs';

// Hàm chuẩn hóa trạng thái để so sánh (bỏ dấu cách, chuyển thành gạch dưới)
const normalizeStatus = (s: string) => s?.toUpperCase().replace(/\s/g, '_');

interface TaskCardProps {
  task: Task;
  onWorkflowClick?: (task: Task, mode: 'CHECK_IN' | 'COMPLETE') => void;
  onDetailsClick?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onWorkflowClick, onDetailsClick }) => {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const allRoles = [...(user?.roles || []), user?.roleName || ''].join(',').toUpperCase();
  const isAdmin = allRoles.includes('ADMIN') || allRoles.includes('TENANT_ADMIN');

  const { mutate: claimTask, isPending: isClaiming } = useClaimTaskMutation();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateTaskStatusMutation();
  const { mutate: deleteTask } = useDeleteTaskMutation();

  const handleClaim = () => {
    claimTask(task.id);
  };

  const handleApprove = () => {
    updateStatus({ taskId: task.id, status: 'DONE' });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Sử dụng window.confirm cho nhanh hoặc antd Modal nếu đã import
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      deleteTask(task.id, {
        onSuccess: () => message.success('Đã xóa công việc!'),
        onError: () => message.error('Lỗi khi xóa.')
      });
    }
  };

  const categoryColors: Record<string, string> = {
    MARKETING: 'bg-blue-50 text-blue-500',
    TECHNICAL: 'bg-emerald-50 text-emerald-600',
    DESIGN: 'bg-purple-50 text-purple-500',
    DEFAULT: 'bg-gray-50 text-gray-500',
  };

  const categoryLabels: Record<string, string> = {
    MARKETING: 'Tiếp thị',
    TECHNICAL: 'Kỹ thuật',
    DESIGN: 'Thiết kế',
    DEFAULT: 'Khác',
  };

  const priorityColors: Record<string, string> = {
    HIGH: 'text-red-500',
    MEDIUM: 'text-orange-500',
    LOW: 'text-gray-400',
  };

  const priorityLabels: Record<string, string> = {
    HIGH: 'Cao',
    MEDIUM: 'Trung bình',
    LOW: 'Thấp',
  };

  const categoryClass = categoryColors[task.category] ?? categoryColors.DEFAULT;
  const priorityClass = priorityColors[task.priority] ?? 'text-gray-400';
  const displayDate = task.date ?? (task.dueDate ? task.dueDate.slice(0, 10) : null);

  return (
    <div
      onClick={() => onDetailsClick?.(task)}
      className={`rounded-2xl p-3.5 flex flex-col border transition-all active:scale-[0.98] cursor-pointer mb-1 ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-gray-100 shadow-sm'
        }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${categoryClass}`}>
              {categoryLabels[task.category] || categoryLabels.DEFAULT}
            </span>
            <span className="text-[11px] font-bold text-gray-300">#TSK-{task.id.toString().slice(-4)}</span>
          </div>
          <h5 className={`text-[14px] font-black leading-tight mb-0 line-clamp-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {task.title}
          </h5>
        </div>

        {isAdmin && (
          <button
            onClick={handleDelete}
            className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 border-none rounded-full active:scale-75 transition-transform"
          >
            <DeleteOutlined className="text-[14px]" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-gray-400">
            <CalendarOutlined className="text-[11px]" />
            <span className="text-[11px] font-bold">{displayDate ?? '—'}</span>
          </div>
          <div className={`text-[10px] font-black uppercase ${priorityClass}`}>
            • {priorityLabels[task.priority] || task.priority}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {task.assigneeId ? (
            <div className="flex items-center gap-1.5 bg-blue-50/50 px-2 py-0.5 rounded-full border border-blue-100/30">
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-bold uppercase">
                {task.assigneeName?.charAt(0)}
              </div>
              <span className="text-[10px] font-bold text-blue-600">{task.assigneeName?.split(' ').pop()}</span>
            </div>
          ) : (
            <span className="text-[10px] font-bold text-orange-500 italic">Chưa giao</span>
          )}
        </div>
      </div>

      {/* Action Area (Only show if employee needs to act) */}
      {!isAdmin && task.status !== 'DONE' && (
        <div className="mt-3 flex gap-2">
          {!task.assigneeId ? (
            <button
              onClick={(e) => { e.stopPropagation(); handleClaim(); }}
              className="flex-1 py-1.5 rounded-lg text-[11px] font-black bg-[#1e3ba1] text-white border-none"
            >NHẬN VIỆC</button>
          ) : (normalizeStatus(task.status) === 'TO_DO' || normalizeStatus(task.status) === 'IN_PROGRESS') ? (
            <button
              onClick={(e) => { e.stopPropagation(); onWorkflowClick?.(task, 'CHECK_IN'); }}
              className="flex-1 py-1.5 rounded-lg text-[11px] font-black bg-blue-100 text-[#1e3ba1] border-none"
            >BẮT ĐẦU</button>
          ) : normalizeStatus(task.status) === 'CHECKED_IN' ? (
            <button
              onClick={(e) => { e.stopPropagation(); onWorkflowClick?.(task, 'COMPLETE'); }}
              className="flex-1 py-1.5 rounded-lg text-[11px] font-black bg-emerald-600 text-white border-none"
            >HOÀN THÀNH</button>
          ) : null}
        </div>
      )}

      {/* Admin Quick Action (Approve) */}
      {isAdmin && normalizeStatus(task.status) === 'REVIEW' && (
        <button
          onClick={(e) => { e.stopPropagation(); handleApprove(); }}
          className="mt-3 w-full py-2 rounded-lg text-[11px] font-black bg-emerald-600 text-white border-none shadow-sm shadow-emerald-700/20"
        >PHÊ DUYỆT NGAY</button>
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
  const [tab, setTab] = useState<'MY' | 'UNASSIGNED'>('MY');

  const [workflowModal, setWorkflowModal] = useState<{ visible: boolean, mode: 'CHECK_IN' | 'COMPLETE', task: Task | null }>({
    visible: false,
    mode: 'CHECK_IN',
    task: null
  });
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailsModal, setDetailsModal] = useState<{ visible: boolean, task: Task | null }>({
    visible: false,
    task: null
  });

  // ─── API Data ────────────────────────────────────────────────────────────────
  const myTasksQuery = useGetMyTasks();
  const tenantTasksQuery = useGetTasksByTenant(isAdmin ? user?.tenantId : undefined);
  const unassignedTasksQuery = useGetUnassignedTasks();

  const activeQuery = isAdmin ? tenantTasksQuery : (tab === 'MY' ? myTasksQuery : unassignedTasksQuery);
  const { data: tasks = [], isLoading, isError, error, refetch } = activeQuery;

  const todoTasks = tasks.filter((t) => {
    const s = normalizeStatus(t.status);
    return s === 'TO_DO' || s === 'IN_PROGRESS';
  });
  const activeTasks = tasks.filter((t) => normalizeStatus(t.status) === 'CHECKED_IN');
  const reviewTasks = tasks.filter((t) => normalizeStatus(t.status) === 'REVIEW');
  const doneTasks = tasks.filter((t) => normalizeStatus(t.status) === 'DONE');

  const showWorkflow = (task: Task, mode: 'CHECK_IN' | 'COMPLETE') => {
    setWorkflowModal({ visible: true, mode, task });
  };

  const showDetails = (task: Task) => {
    setDetailsModal({ visible: true, task });
  };

  const handleExportCSV = () => {
    if (!tasks || tasks.length === 0) {
      message.error('Không có dữ liệu công việc để xuất!');
      return;
    }

    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();

    // Lọc công việc trong tháng hiện tại
    const monthlyTasks = tasks.filter(t => {
      const taskDate = dayjs(t.dueDate || t.createdAt);
      return taskDate.month() === currentMonth && taskDate.year() === currentYear;
    });

    if (monthlyTasks.length === 0) {
      message.warning('Không có công việc nào trong tháng này!');
      return;
    }

    // Tiêu đề cột
    const headers = [
      'Tiêu đề', 'Danh mục', 'Độ ưu tiên', 'Trạng thái', 'Người thực hiện',
      'Khách hàng', 'Công ty', 'SĐT', 'Địa chỉ', 'Đơn giá dự kiến',
      'Ngày hết hạn', 'Thời gian Check-in', 'Thời gian Hoàn thành', 'Mô tả'
    ];

    // Chuyển đổi dữ liệu sang mảng
    const csvContent = monthlyTasks.map(t => [
      `"${t.title}"`,
      `"${t.category}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${t.assigneeName || ''}"`,
      `"${t.customerName || ''}"`,
      `"${t.companyName || ''}"`,
      `"${t.phoneNumber || ''}"`,
      `"${t.address || ''}"`,
      t.estimatedPrice || 0,
      `"${t.dueDate ? dayjs(t.dueDate).format('DD/MM/YYYY') : ''}"`,
      `"${t.checkInTime ? dayjs(t.checkInTime).format('HH:mm DD/MM') : ''}"`,
      `"${t.completionTime ? dayjs(t.completionTime).format('HH:mm DD/MM') : ''}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`
    ]);

    // Tạo file CSV có BOM để hiển thị đúng tiếng Việt trong Excel
    const BOM = '\uFEFF';
    const csvString = BOM + [headers.join(','), ...csvContent.map(row => row.join(','))].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Bao-cao-cong-viec-Thang-${currentMonth + 1}-${currentYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success(`Đã xuất báo cáo ${monthlyTasks.length} công việc!`);
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
        <div className="flex items-center gap-1">
          {isAdmin && (
            <button
              onClick={handleExportCSV}
              className="w-10 h-10 rounded-full flex items-center justify-center border-none bg-blue-50 outline-none p-0 cursor-pointer active:scale-90 transition-transform mr-1"
              title="Xuất báo cáo CSV"
            >
              <ExportOutlined className="text-[#1e3ba1] text-[18px]" />
            </button>
          )}
          <button
            onClick={() => refetch()}
            className="w-10 h-10 rounded-full flex items-center justify-center border-none bg-transparent outline-none p-0 cursor-pointer active:scale-90 transition-transform"
          >
            {(isLoading || activeQuery.isFetching) ? <LoadingOutlined className="text-[#1e3ba1] text-[18px]" /> : <RocketOutlined className={`text-[18px] rotate-180 ${isDarkMode ? 'text-gray-400' : 'text-[#1e3ba1]'}`} />}
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center border-none bg-transparent outline-none p-0 cursor-pointer active:scale-90 transition-transform">
            <SearchOutlined className={`text-[20px] ${isDarkMode ? 'text-gray-300' : 'text-[#1e3ba1]'}`} />
          </button>
        </div>
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
        {(isLoading && tasks.length === 0) ? (
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
          <div className="flex flex-col gap-4">

            {/* NHÓM MỚI / ĐANG CHUẨN BỊ (Hoặc Tab Việc chưa nhận) */}
            {(todoTasks.length > 0 || tab === 'UNASSIGNED') && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-1 rounded-full bg-blue-400" />
                  <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest m-0">
                    {tab === 'UNASSIGNED' ? 'Cơ hội nhận việc' : 'Sẵn sàng / Đang thực hiện'}
                  </h4>
                </div>
                <div className="flex flex-col gap-2">
                  {todoTasks.map(task => (
                    <TaskCard key={task.id} task={task} onWorkflowClick={showWorkflow} onDetailsClick={showDetails} />
                  ))}
                </div>
              </div>
            )}

            {/* NHÓM ĐÃ CHECK_IN (Đang làm tại hiện trường) */}
            {activeTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-1 rounded-full bg-orange-400" />
                  <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest m-0">Đang tại hiện trường</h4>
                </div>
                <div className="flex flex-col gap-2">
                  {activeTasks.map(task => (
                    <TaskCard key={task.id} task={task} onWorkflowClick={showWorkflow} onDetailsClick={showDetails} />
                  ))}
                </div>
              </div>
            )}

            {/* NHÓM CHỜ DUYỆT / XONG */}
            {(reviewTasks.length > 0 || doneTasks.length > 0) && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-1 rounded-full bg-emerald-400" />
                  <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest m-0">Hoàn thành / Chờ duyệt</h4>
                </div>
                <div className="flex flex-col gap-2">
                  {[...reviewTasks, ...doneTasks].map(task => (
                    <TaskCard key={task.id} task={task} onDetailsClick={showDetails} />
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

      {detailsModal.task && (
        <TaskDetailsModal
          visible={detailsModal.visible}
          task={detailsModal.task}
          onClose={() => setDetailsModal({ visible: false, task: null })}
          isDarkMode={isDarkMode}
        />
      )}
    </Page>
  );
};

export default TasksPage;
