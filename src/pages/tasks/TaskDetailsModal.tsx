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
   ArrowLeftOutlined,
   DeleteOutlined,
   TagOutlined
} from '@ant-design/icons';
import { message } from 'antd';
import { useDeleteTaskMutation, useApproveTaskMutation } from '../../hooks/useTasks';
import { useAuthStore } from '../../stores/auth.store';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface TaskDetailsModalProps {
   visible: boolean;
   task: any | null;
   onClose: () => void;
   onSuccess?: () => void;
   isDarkMode: boolean;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ visible, task, onClose, onSuccess, isDarkMode }) => {
   const { user } = useAuthStore();
   const { mutate: deleteTitle } = useDeleteTaskMutation();
   const { mutate: approveTask, isPending: isApproving } = useApproveTaskMutation();

   const handleApprove = () => {
      if (!task) return;
      Modal.confirm({
         title: 'Phê duyệt công việc?',
         content: 'Bạn có chắc chắn muốn phê duyệt và hoàn thành công việc này?',
         okText: 'XÁC NHẬN PHÊ DUYỆT',
         cancelText: 'HỦY',
         centered: true,
         onOk: () => {
            approveTask({ taskId: task.id, note: 'Phê duyệt qua chi tiết ZMA' }, {
               onSuccess: () => {
                  message.success('Đã phê duyệt công việc!');
                  onSuccess?.();
                  onClose();
               },
               onError: () => {
                  message.error('Lỗi khi phê duyệt.');
               }
            });
         }
      });
   };

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

   if (!task) return null;

   const priorityColors: Record<string, string> = {
      HIGH: 'red',
      MEDIUM: 'orange',
      LOW: 'blue'
   };

   const priorityLabels: Record<string, string> = {
      HIGH: 'CAO',
      MEDIUM: 'TRUNG BÌNH',
      LOW: 'THẤP'
   };

   const statusLabels = {
      'TO_DO': 'Sẵn sàng',
      'IN_PROGRESS': 'Đang thực hiện',
      'CHECKED_IN': 'Tại hiện trường',
      'REVIEW': 'Chờ phê duyệt',
      'REJECTED': 'Cần làm lại',
      'DONE': 'Đã hoàn thành'
   };

   const statusColors = {
      'TO_DO': 'blue',
      'IN_PROGRESS': 'processing',
      'CHECKED_IN': 'warning',
      'REVIEW': 'magenta',
      'REJECTED': 'error',
      'DONE': 'success'
   };

   return (
      <Modal
         open={visible}
         onCancel={onClose}
         title={null}
         footer={null}
         width={400}
         centered
         styles={{
            body: { padding: 0 },
            mask: { backdropFilter: 'blur(12px)', backgroundColor: 'rgba(0,0,0,0.45)' }
         }}
         closable={false}
         rootClassName="premium-details-modal"
      >
         <style>{`
            .premium-details-modal .ant-modal-content {
               padding: 0 !important;
               border-radius: 32px !important;
               overflow: hidden !important;
               background: ${isDarkMode ? '#121212' : '#fcfdff'} !important;
            }
            .premium-details-modal .ant-modal-header {
               display: none !important;
            }
            .premium-details-modal .ant-modal-body {
               background: transparent !important;
            }
         `}</style>
         <div className={isDarkMode ? 'text-white' : ''}>
            {/* Modern Header with Identity Color */}
            <div className={`px-6 pb-8 relative ${task.status === 'REJECTED' ? 'bg-gradient-to-r from-red-600 to-red-500' : 'bg-gradient-to-r from-[#1e3ba1] to-[#2563eb]'}`} style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}>
               <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
               <div className="absolute bottom-[-30px] left-[-20px] w-32 h-32 bg-white/5 rounded-full blur-2xl" />

               <div className="flex items-center justify-between mb-4 relative z-10">
                  <button
                     onClick={onClose}
                     className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border-none text-white font-bold py-1.5 px-3 rounded-full text-[12px] transition-all active:scale-95"
                  >
                     <ArrowLeftOutlined /> Quay lại
                  </button>
                  <div className="flex items-center gap-2">
                     {task.requirePhoto && (
                        <Tag icon={<CameraOutlined />} color="error" className="rounded-full font-black uppercase text-[8px] px-2 m-0 border-none shadow-lg">
                           BẮT BUỘC ẢNH
                        </Tag>
                     )}
                     <Tag color={priorityColors[task.priority] || 'default'} className="rounded-full font-black uppercase text-[10px] px-3 m-0 border-none shadow-lg">
                        {priorityLabels[task.priority] || task.priority}
                     </Tag>
                  </div>
               </div>

               <div className="relative z-10">
                  <span className="text-white/60 text-[12px] font-black tracking-widest block mb-1">#{task.id.toString().slice(-6).toUpperCase()}</span>
                  <Title style={{ margin: 0, color: 'white', fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                     {task.title}
                  </Title>
               </div>

               <div className="flex flex-wrap items-center gap-2 mt-4 relative z-10">
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10">
                     <ClockCircleOutlined className="text-blue-100" />
                     <span className="text-white text-[11px] font-black uppercase tracking-wider">{statusLabels[task.status]}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/5">
                     <CalendarOutlined className="text-blue-100" />
                     <span className="text-white text-[11px] font-bold">{task.dueDate ? dayjs(task.dueDate).format('DD/MM/YYYY') : 'Không hạn chót'}</span>
                  </div>
                  {task.category && (
                     <div className="bg-indigo-500/30 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-2 border border-indigo-400/20">
                        <TagOutlined className="text-indigo-100" />
                        <span className="text-white text-[11px] font-bold uppercase">{task.category}</span>
                     </div>
                  )}
               </div>
            </div>

            {/* Floating Content Body */}
            <div className={`mt-[-25px] relative z-20 rounded-[40px] p-5 transition-colors ${isDarkMode ? 'bg-[#121212]' : 'bg-[#fcfdff]'}`}>

               {/* Section: Project Info (If exists) */}
               {task.projectName && (
                  <div className={`mb-4 flex items-center gap-2 p-3 rounded-2xl border ${isDarkMode ? 'bg-cyan-950/20 border-cyan-900/30' : 'bg-cyan-50 border-cyan-100'}`}>
                     <div className="flex-1">
                        <span className={`text-[9px] font-black uppercase tracking-widest block ${isDarkMode ? 'text-cyan-600' : 'text-cyan-400'}`}>Dự án</span>
                        <div className={`text-[12px] font-black ${isDarkMode ? 'text-cyan-200' : 'text-cyan-800'}`}>{task.projectName}</div>
                     </div>
                  </div>
               )}

               {/* Section 0: Review Note (If exists) */}
               {task.reviewNote && (
                  <div className={`border rounded-2xl p-4 mb-4 shadow-sm ${task.status === 'REJECTED' ? (isDarkMode ? 'bg-red-900/10 border-red-900/20' : 'bg-red-50 border-red-100') : (isDarkMode ? 'bg-emerald-900/10 border-emerald-900/20' : 'bg-emerald-50 border-emerald-100')}`}>
                     <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${task.status === 'REJECTED' ? 'text-red-500' : 'text-emerald-500'}`}>
                           {task.status === 'REJECTED' ? 'Lý do từ chối của Admin' : 'Ghi chú xét duyệt'}
                        </span>
                     </div>
                     <div className={`text-[12px] font-bold leading-relaxed italic ${task.status === 'REJECTED' ? (isDarkMode ? 'text-red-400' : 'text-red-700') : (isDarkMode ? 'text-emerald-400' : 'text-emerald-700')}`}>
                        "{task.reviewNote}"
                     </div>
                     {task.reviewedAt && (
                        <div className="text-[9px] text-gray-400 mt-1.5 font-medium">
                           Duyệt ngày: {dayjs(task.reviewedAt).format('HH:mm DD/MM/YYYY')}
                        </div>
                     )}
                  </div>
               )}

               {/* Section 1: Business Details (Card based) */}
               {(task.customerName || task.companyName || task.estimatedPrice || task.phoneNumber || task.address) && (
                  <div className={`rounded-2xl p-4 mb-6 border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white border-gray-100'}`}>
                     {(task.customerName || task.companyName || task.estimatedPrice) && (
                        <div className="flex justify-between items-start mb-3">
                           <div className="max-w-[60%]">
                              <span className={`text-[9px] font-black uppercase tracking-widest block mb-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Khách hàng</span>
                              <div className={`text-[15px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{task.customerName || 'Khách hàng lẻ'}</div>
                              {task.companyName && (
                                 <div className={`text-[11px] font-medium mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {task.companyName}
                                 </div>
                              )}
                           </div>
                           {task.estimatedPrice && (
                              <div className="text-right">
                                 <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-0.5">Dự kiến</span>
                                 <div className="text-[16px] font-black text-emerald-600">
                                    {task.estimatedPrice.toLocaleString('vi-VN')}
                                    <span className="text-[9px] ml-0.5">đ</span>
                                 </div>
                              </div>
                           )}
                        </div>
                     )}

                     {(task.phoneNumber || task.address) && (
                        <div className={`grid grid-cols-1 gap-2 pt-3 ${(task.customerName || task.companyName || task.estimatedPrice) ? 'border-t' : ''} ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                           {task.phoneNumber && (
                              <div className={`text-[12px] font-bold flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                 <PhoneOutlined className="text-blue-500" />
                                 <span>{task.phoneNumber}</span>
                              </div>
                           )}
                           {task.address && (
                              <div className={`text-[12px] font-bold flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                 <EnvironmentOutlined className="text-orange-500" />
                                 <span className="line-clamp-2">{task.address}</span>
                              </div>
                           )}
                        </div>
                     )}

                     {task.status === 'DONE' && (
                        <div className={`mt-3 pt-2 border-t flex items-center justify-between ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                           <span className="text-[10px] font-bold text-gray-400">Xác nhận:</span>
                           {task.customerConfirmed ? (
                              <Tag color="success" className="m-0 rounded-full font-black text-[8px] px-2 border-none">ĐÃ XÁC NHẬN</Tag>
                           ) : (
                              <Tag color="warning" className="m-0 rounded-full font-black text-[8px] px-2 border-none">CHƯA XÁC NHẬN</Tag>
                           )}
                        </div>
                     )}
                  </div>
               )}

               {/* Section 2: Requirements */}
               <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-1 h-3 bg-blue-600 rounded-full" />
                     <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Yêu cầu chi tiết</span>
                  </div>
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/50 border-gray-100'}`}>
                     <Paragraph className={`text-[12px] leading-relaxed font-medium m-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {task.description || 'Không có mô tả chi tiết được cung cấp cho công việc này.'}
                     </Paragraph>
                  </div>
               </div>


               {/* Section 4: Personnel */}
               <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-1 h-3 bg-orange-600 rounded-full" />
                     <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Người phụ trách</span>
                  </div>
                  <div className={`p-4 rounded-2xl border flex items-center gap-4 ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                     <div className="w-12 h-12 rounded-2xl overflow-hidden bg-blue-500/10 flex items-center justify-center border border-gray-100/10">
                        {task.avatar ? (
                           <img src={task.avatar} alt={task.assigneeName} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black text-lg">
                              {task.assigneeName?.charAt(0).toUpperCase() || 'S'}
                           </div>
                        )}
                     </div>
                     <div className="flex-1">
                        <div className={`text-[14px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                           {task.assigneeName || 'Chưa có người phụ trách'}
                        </div>
                        <div className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-0.5">Field Specialist</div>
                     </div>
                  </div>
               </div>

               {/* Section 4: Progress (Horizontal scroll or Timeline) */}
               {(task.checkInTime || task.completionTime) && (
                  <div className="mb-8">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-3 bg-emerald-600 rounded-full" />
                        <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Tiến độ & Minh chứng</span>
                     </div>

                     <div className="space-y-4">
                        {task.checkInTime && (
                           <div className="flex gap-3">
                              <div className={`w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                 {task.checkInPhoto ? (
                                    <Image
                                       src={`${(import.meta.env.VITE_API_BASE_URL || '').replace('/api', '')}/${task.checkInPhoto}`}
                                       className="w-full h-full object-cover"
                                    />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                       <CameraOutlined className="text-gray-300 text-sm" />
                                    </div>
                                 )}
                              </div>
                              <div className="py-0.5 flex-1">
                                 <div className={`text-[12px] font-black leading-none mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Check-in</div>
                                 {task.checkInNote && <div className={`text-[11px] mt-1 italic px-2 py-1 rounded-lg ${isDarkMode ? 'bg-gray-800 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>"{task.checkInNote}"</div>}
                                 {(task.checkInLatitude || task.checkInLongitude) && (
                                    <div className="text-[9px] text-gray-400 mt-1 flex items-center gap-1">
                                       <EnvironmentOutlined className="text-[8px]" />
                                       GPS: {task.checkInLatitude?.toFixed(6)}, {task.checkInLongitude?.toFixed(6)}
                                    </div>
                                 )}
                              </div>
                           </div>
                        )}

                        {task.completionTime && (
                           <div className="flex gap-3">
                              <div className={`w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                 {task.completionPhoto ? (
                                    <Image
                                       src={`${(import.meta.env.VITE_API_BASE_URL || '').replace('/api', '')}/${task.completionPhoto}`}
                                       className="w-full h-full object-cover"
                                    />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                       <CheckCircleOutlined className="text-emerald-300 text-sm" />
                                    </div>
                                 )}
                              </div>
                              <div className="py-0.5 flex-1">
                                 <div className="text-[12px] font-black text-emerald-600 leading-none mb-1">Hoàn thành</div>
                                 <div className="text-[9px] text-gray-400 font-bold uppercase">{dayjs(task.completionTime).format('HH:mm - DD/MM/YYYY')}</div>
                                 {task.resultNote && <div className={`text-[11px] mt-1 italic px-2 py-1 rounded-lg ${isDarkMode ? 'bg-emerald-950/20 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>"{task.resultNote}"</div>}
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               )}

               <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                     <button
                        onClick={onClose}
                        className={`flex-1 py-3.5 rounded-2xl font-black text-[13px] border-none active:scale-[0.98] transition-all ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-900 text-white hover:bg-black shadow-md shadow-gray-200'}`}
                     >ĐÓNG CHI TIẾT</button>
                     {([...(user?.roles || []), user?.roleName || ''].join(',').toUpperCase().includes('ADMIN')) && (
                        <button
                           onClick={handleDelete}
                           className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-50 text-red-600 border-none hover:bg-red-100 active:scale-95 transition-all"
                        >
                           <DeleteOutlined className="text-lg" />
                        </button>
                     )}
                  </div>

                  {([...(user?.roles || []), user?.roleName || ''].join(',').toUpperCase().includes('ADMIN')) && task.status === 'REVIEW' && (
                     <button
                        onClick={handleApprove}
                        disabled={isApproving}
                        className="w-full py-4 rounded-2xl font-black text-[14px] bg-emerald-600 text-white border-none shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                     >
                        <CheckCircleOutlined />
                        {isApproving ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN PHÊ DUYỆT'}
                     </button>
                  )}
               </div>
            </div>
         </div>


         <style>{`
        .premium-details-modal .ant-modal-content {
          border-radius: 40px !important;
          padding: 0 !important;
          overflow: hidden !important;
          box-shadow: 0 40px 100px -12px rgba(0, 0, 0, 0.4) !important;
          background: transparent !important;
        }
        .premium-details-modal .ant-modal-body {
          padding: 0 !important;
          background: transparent !important;
          
        }

        .premium-details-modal .ant-modal-content {
            border-radius: 40px !important;
            padding: 0 !important;
            overflow: hidden !important;
            box-shadow: 0 40px 100px -12px rgba(0, 0, 0, 0.4) !important;
            background: transparent !important; 
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      </Modal>
   );
};
