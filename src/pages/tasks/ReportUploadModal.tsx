import React, { useState } from 'react';
import { chooseImage } from 'zmp-sdk';
import { Modal, Spin, message } from 'antd';
import { UploadOutlined, PictureOutlined, LoadingOutlined } from '@ant-design/icons';
import { checkinApi } from '@/api/checkin.api';
import { Task } from '@/types/task.types';

interface ReportUploadModalProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReportUploadModal: React.FC<ReportUploadModalProps> = ({ task, visible, onClose, onSuccess }) => {
  const [imageFiles, setImageFiles] = useState<{ path: string; blob: Blob | null }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isChoosing, setIsChoosing] = useState(false);

  // 1. ZMP SDK - Chọn ảnh native
  const handleChooseImage = async () => {
    try {
      setIsChoosing(true);
      const { filePaths } = await chooseImage({
        sourceType: ['album', 'camera'],
        count: 3, // tối đa 3 ảnh
      });

      if (filePaths && filePaths.length > 0) {
        // Chuyển đối các filePaths (thường là blob URL gốc của webview) sang đối tượng Blob thực sự để gói vào FormData
        const newImages = await Promise.all(
          filePaths.map(async (path) => {
            try {
              const res = await fetch(path);
              const blob = await res.blob();
              return { path, blob };
            } catch (err) {
              return { path, blob: null };
            }
          })
        );
        setImageFiles([...imageFiles, ...newImages.filter((img) => img.blob !== null)]);
      }
    } catch (error) {
      console.error('Lỗi khi mở chooseImage Zalo:', error);
      message.error('Không thể kích hoạt chức năng chọn ảnh.');
    } finally {
      setIsChoosing(false);
    }
  };

  // 2. Gửi ảnh (Multipart/FormData)
  const handleSubmit = async () => {
    if (!task) return;
    if (imageFiles.length === 0) {
      message.warning('Vui lòng chọn ít nhất 1 ảnh báo cáo.');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('note', 'Báo cáo Task ' + task.id);
      
      imageFiles.forEach((file, index) => {
        if (file.blob) {
          // Tạo tên file mẫu (có thể lấy mimetype để cấp extension chuẩn)
          formData.append('images', file.blob, `report_${index}.jpg`);
        }
      });

      // API call (Tự động bypass header Content-Type application/json trong fetcher)
      await checkinApi.uploadReport(task.id, formData);
      message.success('Tải báo cáo thành công!');
      setImageFiles([]); // Reset state
      onSuccess();
      onClose();
    } catch (error: any) {
      message.error(error.message || 'Lỗi tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setImageFiles([]); // Clear
    onClose();
  };

  return (
    <Modal
      title={
        <div className="text-[#1e3ba1] font-black text-[16px] tracking-tight">
          Báo cáo công việc
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={
        <div className="flex gap-2">
          <button 
             onClick={handleCancel}
             className="flex-1 py-3 mt-2 rounded-[16px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 border-none transition-colors"
          >
             Hủy bỏ
          </button>
          <button 
             onClick={handleSubmit}
             disabled={isUploading || imageFiles.length === 0}
             className="flex-1 py-3 mt-2 rounded-[16px] font-bold text-white bg-[#1e3ba1] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100 border-none flex items-center justify-center gap-2"
          >
             {isUploading ? <LoadingOutlined /> : <UploadOutlined />} Báo cáo ngay
          </button>
        </div>
      }
      centered
      className="zalo-report-modal"
      width={360}
      styles={{
         mask: { backdropFilter: 'blur(4px)' },
         body: { borderRadius: '24px', padding: '20px' }
      }}
    >
      <div className="flex flex-col gap-4 mt-2 mb-2">
        <p className="text-[14px] text-gray-600 m-0">
          Hãy chụp hoặc chọn ảnh minh chứng cho Task: 
          <br/>
          <strong className="text-gray-900 mt-1 block">"{task?.title}"</strong>
        </p>

        {/* Selected Image Grid */}
        {imageFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
             {imageFiles.map((file, i) => (
                <div key={i} className="relative aspect-square rounded-[12px] overflow-hidden border border-gray-200 shadow-sm">
                   <img src={file.path} alt="preview" className="w-full h-full object-cover" />
                   <button 
                     onClick={() => setImageFiles(imageFiles.filter((_, idx) => idx !== i))}
                     className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-black/60 text-white rounded-full border-none text-[10px]"
                   >
                     X
                   </button>
                </div>
             ))}
          </div>
        )}

        {/* Upload Trigger (Zalo API) */}
        {imageFiles.length < 3 && (
          <button 
            onClick={handleChooseImage}
            disabled={isChoosing}
            className="w-full py-8 border-2 border-dashed border-blue-200 rounded-[16px] flex flex-col items-center justify-center gap-2 bg-blue-50/50 text-[#1e3ba1] hover:bg-blue-50 transition-colors cursor-pointer border-none"
          >
             {isChoosing ? <Spin size="small" /> : <PictureOutlined className="text-[24px]" />}
             <span className="text-[13px] font-bold">Chạm để chọn ảnh (Tối đa 3)</span>
          </button>
        )}
      </div>
    </Modal>
  );
};
