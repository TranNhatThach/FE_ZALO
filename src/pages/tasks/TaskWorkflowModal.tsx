import React, { useState } from 'react';
import { chooseImage, getLocation } from 'zmp-sdk';
import { Modal, message, Spin, Checkbox } from 'antd';
import { 
  CameraOutlined, 
  EnvironmentOutlined, 
  LoadingOutlined, 
  CheckCircleOutlined,
  PlayCircleOutlined,
  SendOutlined
} from '@ant-design/icons';
import { Task } from '@/types/task.types';
import { useTaskCheckInMutation, useTaskCompleteMutation } from '@/hooks/useTasks';

interface TaskWorkflowModalProps {
  task: Task | null;
  mode: 'CHECK_IN' | 'COMPLETE';
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TaskWorkflowModal: React.FC<TaskWorkflowModalProps> = ({ 
  task, 
  mode, 
  visible, 
  onClose, 
  onSuccess 
}) => {
  const [imageFile, setImageFile] = useState<{ path: string; blob: Blob | null } | null>(null);
  const [note, setNote] = useState('');
  const [customerConfirmed, setCustomerConfirmed] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isChoosingImage, setIsChoosingImage] = useState(false);

  const checkInMutation = useTaskCheckInMutation();
  const completeMutation = useTaskCompleteMutation();

  const handleChooseImage = async () => {
    try {
      setIsChoosingImage(true);
      const { filePaths } = await chooseImage({
        sourceType: ['camera', 'album'],
        count: 1,
      });

      if (filePaths && filePaths.length > 0) {
        const path = filePaths[0];
        const res = await fetch(path);
        const blob = await res.blob();
        setImageFile({ path, blob });
      }
    } catch (error) {
      console.error('Error choosing image:', error);
      message.error('Không thể chọn ảnh.');
    } finally {
      setIsChoosingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!task) return;

    // Validate: Nếu task yêu cầu ảnh bắt buộc
    if (task.requirePhoto && !imageFile) {
      message.warning(`Công việc này yêu cầu ảnh minh chứng để ${mode === 'CHECK_IN' ? 'bắt đầu' : 'hoàn thành'}.`);
      return;
    }

    if (mode === 'CHECK_IN') {
      try {
        setIsGettingLocation(true);
        const { latitude, longitude } = await getLocation();
        
        await checkInMutation.mutateAsync({
          taskId: task.id,
          photo: imageFile?.blob || undefined,
          lat: parseFloat(latitude || '0'),
          lon: parseFloat(longitude || '0'),
          note: note
        });

        message.success('Check-in thành công! Chúc bạn làm việc tốt.');
        resetAndClose();
      } catch (error: any) {
        message.error(error.message || 'Lỗi khi check-in.');
      } finally {
        setIsGettingLocation(false);
      }
    } else {
      // mode === 'COMPLETE'
      try {
        await completeMutation.mutateAsync({
          taskId: task.id,
          photo: imageFile?.blob || undefined,
          resultNote: note,
          customerConfirmed: customerConfirmed
        });

        message.success('Đã nộp báo cáo hoàn thành! Chờ Admin phê duyệt.');
        resetAndClose();
      } catch (error: any) {
        message.error(error.message || 'Lỗi khi nộp báo cáo hoàn thành.');
      }
    }
  };

  const resetAndClose = () => {
    setImageFile(null);
    setNote('');
    setCustomerConfirmed(false);
    onSuccess();
    onClose();
  };

  const isPending = checkInMutation.isPending || completeMutation.isPending || isGettingLocation;

  return (
    <Modal
      title={
        <div className="text-[#1e3ba1] font-black text-[17px] tracking-tight flex items-center gap-2">
          {mode === 'CHECK_IN' ? <PlayCircleOutlined className="text-blue-500" /> : <CheckCircleOutlined className="text-emerald-500" />}
          {mode === 'CHECK_IN' ? 'Bắt đầu công việc' : 'Hoàn thành công việc'}
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={
        <div className="flex gap-2 p-1">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 border-none active:scale-95 transition-transform"
          >
            Hủy
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isPending}
            className={`flex-1 py-3 rounded-xl font-bold text-white border-none flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 ${
              mode === 'CHECK_IN' ? 'bg-[#1e3ba1]' : 'bg-emerald-600'
            }`}
          >
            {isPending ? <LoadingOutlined /> : <SendOutlined />}
            {mode === 'CHECK_IN' ? 'Check-in ngay' : 'Hoàn thành'}
          </button>
        </div>
      }
      centered
      width={360}
      styles={{
        mask: { backdropFilter: 'blur(4px)' },
        body: { padding: '20px' }
      }}
    >
      <div className="flex flex-col gap-4 mt-2">
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider mb-1">Công việc</p>
          <p className="text-[15px] font-bold text-gray-800 m-0 leading-snug">{task?.title}</p>
        </div>

        {/* Note Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-gray-600">
            {mode === 'CHECK_IN' ? 'Ghi chú hiện trường' : 'Ghi chú kết quả'}
          </label>
          <textarea 
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={mode === 'CHECK_IN' ? 'Mô tả ngắn gọn tình hình hiện trường...' : 'Mô tả kết quả công việc đã thực hiện...'}
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-0 text-[14px] outline-none transition-colors bg-white"
          />
        </div>

        {/* Photo Upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-gray-600">Ảnh minh chứng</label>
          {imageFile ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <img src={imageFile.path} alt="preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => setImageFile(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center border-none"
              >
                ✕
              </button>
            </div>
          ) : (
            <button 
              onClick={handleChooseImage}
              disabled={isChoosingImage}
              className="w-full py-10 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-400 active:bg-gray-100 transition-colors border-none"
            >
              {isChoosingImage ? <Spin size="small" /> : <CameraOutlined className="text-[28px]" />}
              <span className="text-[13px] font-bold text-gray-500">Chụp ảnh hiện trường</span>
            </button>
          )}
        </div>

        {/* Customer Confirmation (Completion mode only) */}
        {mode === 'COMPLETE' && (
          <div className="flex items-center gap-2 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            <Checkbox 
              checked={customerConfirmed} 
              onChange={(e) => setCustomerConfirmed(e.target.checked)}
              className="scale-110"
            />
            <span className="text-[13px] font-bold text-emerald-800">Khách hàng đã kiểm tra & xác nhận</span>
          </div>
        )}

        {mode === 'CHECK_IN' && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-xl border border-blue-100 italic text-[12px]">
            <EnvironmentOutlined />
            <span>Hệ thống sẽ tự động lấy vị trí GPS hiện tại của bạn.</span>
          </div>
        )}
      </div>
    </Modal>
  );
};
