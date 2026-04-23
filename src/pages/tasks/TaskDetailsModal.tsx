import React from 'react';
import { Modal, Typography, Tag, Divider, Image } from 'antd';
import { 
  HistoryOutlined, 
  InfoCircleOutlined, 
  EnvironmentOutlined,
  CameraOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  BankOutlined,
  DollarCircleOutlined,
  ArrowLeftOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { message } from 'antd';
import { Task } from '../../types/task.types';
import { useDeleteTaskMutation } from '../../hooks/useTasks';
import { useAuthStore } from '../../stores/auth.store';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface TaskDetailsModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  isDarkMode: boolean;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ visible, task, onClose, isDarkMode }) => {
  const { user } = useAuthStore();
  const { mutate: deleteTitle } = useDeleteTaskMutation();
  
  const handleDelete = () => {
    if (!task) return;
    
    Modal.confirm({
      title: 'Xóa công việc?',
      content: 'Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa công việc này?',
      okText: 'XÓA NGAY',
      okType: 'danger',
      cancelText: 'HỦY',
      centered: true,
      onOk: () => {
        deleteTitle(task.id, {
          onSuccess: () => {
            message.success('Đã xóa công việc!');
            onClose();
          },
          onError: () => {
            message.error('Lỗi khi xóa công việc.');
          }
        });
      }
    });
  };

  console.log('Task Data in Modal:', task);
  if (!task) return null;

  const priorityColors = {
    HIGH: 'red',
    MEDIUM: 'orange',
    LOW: 'blue'
  };

  const statusLabels = {
    'TO DO': 'Sẵn sàng',
    'IN PROGRESS': 'Đang thực hiện',
    'CHECKED IN': 'Tại hiện trường',
    'REVIEW': 'Chờ phê duyệt',
    'DONE': 'Đã hoàn thành'
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={380}
      centered
      styles={{ 
        body: { padding: 0 },
        mask: { backdropFilter: 'blur(12px)', backgroundColor: 'rgba(0,0,0,0.45)' }
      }}
      closable={false}
      className="premium-details-modal"
    >
      <div className={`overflow-hidden ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-[#fcfdff]'}`}>
        {/* Modern Header with Identity Color */}
        <div className="bg-gradient-to-r from-[#1e3ba1] to-[#2563eb] p-6 pb-8 relative">
          <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border-none text-white font-bold py-1.5 px-3 rounded-full text-[12px] transition-all active:scale-95"
            >
              <ArrowLeftOutlined /> Quay lại
            </button>
            <div className="flex items-center gap-2">
              {(user?.roleName === 'ADMIN' || user?.roleName === 'TENANT_ADMIN' || user?.roles?.includes('ADMIN')) && (
                <button 
                  onClick={handleDelete}
                  className="w-8 h-8 flex items-center justify-center bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white border-none rounded-full transition-all active:scale-90"
                >
                  <DeleteOutlined className="text-[14px]" />
                </button>
              )}
              <Tag color={priorityColors[task.priority]} className="rounded-full font-black uppercase text-[10px] px-3 m-0 border-none shadow-lg">
                {task.priority}
              </Tag>
            </div>
          </div>
          
          <Title className="relative z-10" style={{ margin: 0, color: 'white', fontWeight: 900, fontSize: 22, letterSpacing: '-0.5px' }}>
            {task.title}
          </Title>
          
          <div className="flex items-center gap-3 mt-4 relative z-10">
             <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2">
                <ClockCircleOutlined className="text-blue-100" />
                <span className="text-white text-[11px] font-black uppercase tracking-wider">{statusLabels[task.status]}</span>
             </div>
             <div className="text-blue-100 text-[11px] font-bold">
                <CalendarOutlined className="mr-1" /> {task.dueDate ? dayjs(task.dueDate).format('DD/MM/YYYY') : 'Không hạn chót'}
             </div>
          </div>
        </div>

        {/* Floating Content Body */}
        <div className="mt-[-20px] relative z-20 bg-[#fcfdff] rounded-t-[28px] p-6">
           
           {/* Section 1: Business Details (Card based) */}
           {(task.customerName || task.companyName || task.estimatedPrice) && (
             <div className="bg-white rounded-3xl p-5 mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
                <div className="flex justify-between items-start">
                   <div className="max-w-[65%]">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Thông tin khách hàng</span>
                      <div className="text-[15px] font-black text-gray-900 leading-tight">{task.customerName || 'Khách hàng lẻ'}</div>
                      {task.companyName && (
                        <div className="text-[12px] text-gray-500 font-medium mt-1 flex items-center gap-1">
                           <BankOutlined className="text-[10px]" /> {task.companyName}
                        </div>
                      )}
                   </div>
                   {task.estimatedPrice && (
                      <div className="text-right">
                         <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Dự kiến</span>
                         <div className="text-[16px] font-black text-emerald-600">
                            {task.estimatedPrice.toLocaleString('vi-VN')}
                            <span className="text-[10px] ml-0.5">đ</span>
                         </div>
                      </div>
                   )}
                </div>

                {(task.phoneNumber || task.address) && (
                   <div className="grid grid-cols-1 gap-3 mt-5 pt-4 border-t border-gray-50">
                      {task.phoneNumber && (
                        <div className="flex items-center gap-3 text-[13px] font-bold text-gray-700">
                           <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                              <PhoneOutlined />
                           </div>
                           {task.phoneNumber}
                        </div>
                      )}
                      {task.address && (
                        <div className="flex items-center gap-3 text-[13px] font-bold text-gray-700">
                           <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                              <EnvironmentOutlined />
                           </div>
                           <span className="line-clamp-2">{task.address}</span>
                        </div>
                      )}
                   </div>
                )}
             </div>
           )}

           {/* Section 2: Requirements */}
           <div className="mb-8 overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                 <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                 <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Yêu cầu chi tiết</span>
              </div>
              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <Paragraph className="text-[13px] leading-relaxed text-gray-600 font-medium m-0">
                   {task.description || 'Không có mô tả chi tiết được cung cấp cho công việc này.'}
                </Paragraph>
              </div>
           </div>

           {/* Section 3: Personnel */}
           <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                 <div className="w-1.5 h-4 bg-orange-600 rounded-full" />
                 <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Người phụ trách</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border border-white">
                    <UserOutlined className="text-blue-600" />
                 </div>
                 <div>
                    <div className="text-[14px] font-black text-gray-900">{task.assigneeName || 'Chưa có người phụ trách'}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Field Specialist</div>
                 </div>
              </div>
           </div>

           {/* Section 4: Progress (Horizontal scroll or Timeline) */}
           {(task.checkInTime || task.completionTime) && (
              <div>
                 <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Tiến độ hiện trường</span>
                 </div>
                 
                 <div className="space-y-4">
                    {task.checkInTime && (
                       <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm bg-gray-100 flex-shrink-0">
                             {task.checkInPhoto ? <Image src={task.checkInPhoto} className="w-full h-full object-cover" /> : <CameraOutlined className="flex items-center justify-center h-full w-full text-gray-300" />}
                          </div>
                          <div className="py-1">
                             <div className="text-[12px] font-black text-gray-900 leading-none mb-1">Check-in Công việc</div>
                             <div className="text-[11px] text-gray-400 font-bold uppercase">{dayjs(task.checkInTime).format('HH:mm - DD/MM/YYYY')}</div>
                             {task.checkInNote && <div className="text-[12px] text-blue-600 mt-1 italic">"{task.checkInNote}"</div>}
                          </div>
                       </div>
                    )}

                    {task.completionTime && (
                       <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm bg-gray-100 flex-shrink-0">
                             {task.completionPhoto ? <Image src={task.completionPhoto} className="w-full h-full object-cover" /> : <CheckCircleOutlined className="flex items-center justify-center h-full w-full text-emerald-300" />}
                          </div>
                          <div className="py-1">
                             <div className="text-[12px] font-black text-emerald-600 leading-none mb-1">Đã Hoàn thành</div>
                             <div className="text-[11px] text-gray-400 font-bold uppercase">{dayjs(task.completionTime).format('HH:mm - DD/MM/YYYY')}</div>
                             {task.resultNote && <div className="text-[12px] text-emerald-600 mt-1 italic">"{task.resultNote}"</div>}
                          </div>
                       </div>
                    )}
                 </div>
              </div>
           )}

           <button 
              onClick={onClose}
              className="w-full py-4.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-3xl font-black text-[13px] border-none active:scale-[0.98] transition-all mt-8"
           >ĐÓNG CHI TIẾT</button>
        </div>
      </div>

      <style>{`
        .premium-details-modal .ant-modal-content {
          border-radius: 32px !important;
          padding: 0 !important;
          overflow: hidden !important;
          box-shadow: 0 40px 80px -12px rgba(0, 0, 0, 0.4) !important;
        }
        .premium-details-modal .ant-modal-body {
          padding: 0 !important;
        }
      `}</style>
    </Modal>
  );
};
