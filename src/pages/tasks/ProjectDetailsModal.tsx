import React from 'react';
import { Modal, Typography, Tag, Progress } from 'antd';
import {
   InfoCircleOutlined,
   CalendarOutlined,
   UserOutlined,
   ArrowLeftOutlined,
   RocketOutlined,
   ProjectOutlined,
   TeamOutlined,
   EditOutlined,
   DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface ProjectDetailsModalProps {
   visible: boolean;
   project: any;
   onClose: () => void;
   onEdit?: (project: any) => void;
   onDelete?: (id: number) => void;
   isDarkMode: boolean;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ visible, project, onClose, onEdit, onDelete, isDarkMode }) => {
   if (!project) return null;

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
            {/* Header */}
            <div className="px-6 pb-8 pt-6 bg-gradient-to-r from-blue-700 to-indigo-600 relative">
               <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
               
               <div className="flex items-center justify-between mb-4 relative z-10">
                  <button
                     onClick={onClose}
                     className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border-none text-white font-bold py-1.5 px-3 rounded-full text-[12px] transition-all active:scale-95"
                  >
                     <ArrowLeftOutlined /> Quay lại
                  </button>
                  <div className="flex items-center gap-2">
                     <button
                        onClick={() => onDelete?.(project.id)}
                        className="w-8 h-8 flex items-center justify-center bg-red-500/20 hover:bg-red-500/40 border-none text-white rounded-full transition-all active:scale-75"
                     >
                        <DeleteOutlined style={{ fontSize: 14 }} />
                     </button>
                     <button
                        onClick={() => onEdit?.(project)}
                        className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 border-none text-white rounded-full transition-all active:scale-75"
                     >
                        <EditOutlined style={{ fontSize: 14 }} />
                     </button>
                     <Tag color="processing" className="rounded-full font-black uppercase text-[10px] px-3 m-0 border-none shadow-lg">
                        {project.status}
                     </Tag>
                  </div>
               </div>

               <div className="relative z-10">
                  <span className="text-white/60 text-[11px] font-black tracking-widest block mb-1 uppercase">CHI TIẾT DỰ ÁN</span>
                  <Title style={{ margin: 0, color: 'white', fontWeight: 900, fontSize: 22, letterSpacing: '-0.5px' }}>
                     {project.name}
                  </Title>
               </div>
            </div>

            {/* Content */}
            <div className="p-6 mt-[-20px] relative z-20 bg-[#fcfdff] rounded-[30px] transition-colors" style={{ backgroundColor: isDarkMode ? '#121212' : '#fcfdff' }}>
               
               <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-blue-50/30 border-blue-100'}`}>
                     <CalendarOutlined className="text-blue-500 mb-1" />
                     <span className="text-[10px] font-black text-gray-400 block uppercase">Bắt đầu</span>
                     <div className="text-[13px] font-black">{dayjs(project.startDate).format('DD/MM/YYYY')}</div>
                  </div>
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-indigo-50/30 border-indigo-100'}`}>
                     <CalendarOutlined className="text-indigo-500 mb-1" />
                     <span className="text-[10px] font-black text-gray-400 block uppercase">Kết thúc</span>
                     <div className="text-[13px] font-black">{dayjs(project.endDate).format('DD/MM/YYYY')}</div>
                  </div>
               </div>

               <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                     <UserOutlined className="text-orange-500" />
                     <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Quản lý dự án</span>
                  </div>
                  <div className={`p-4 rounded-2xl flex items-center gap-3 border ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                     <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black">
                        {project.managerName?.charAt(0)}
                     </div>
                     <div className="font-black text-[14px]">{project.managerName}</div>
                  </div>
               </div>

               <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                     <InfoCircleOutlined className="text-blue-500" />
                     <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Mô tả dự án</span>
                  </div>
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/50 border-gray-100'}`}>
                     <Paragraph className={`text-[13px] leading-relaxed m-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {project.description || 'Không có mô tả chi tiết.'}
                     </Paragraph>
                  </div>
               </div>

               <button
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl font-black text-[14px] bg-gray-900 text-white border-none shadow-lg active:scale-95 transition-all mt-4"
               >
                  ĐÓNG
               </button>
            </div>
         </div>
      </Modal>
   );
};
