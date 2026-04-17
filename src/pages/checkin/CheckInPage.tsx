import React, { useState } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { getLocation, chooseImage } from 'zmp-sdk';
import { message, Spin } from 'antd';
import { useNavigate, Header } from 'zmp-ui';
import {
  LeftOutlined,
  CameraOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { checkinApi } from '@/api/checkin.api';

export const CheckInPage: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();

  const [location, setLocation] = useState<{ latitude: string; longitude: string } | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isChoosingImage, setIsChoosingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Lấy GPS bằng zmp-sdk
  const handleGetLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const res = await getLocation({});
      if (res && res.latitude && res.longitude) {
        setLocation({
          latitude: res.latitude,
          longitude: res.longitude,
        });
        message.success('Đã lấy được tọa độ GPS!');
      }
    } catch (error) {
      console.error(error);
      message.error('Không thể lấy được vị trí. Hãy chắc chắn bạn đã cấp quyền GPS.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Mở camera chụp ảnh bằng zmp-sdk
  const handleCaptureImage = async () => {
    try {
      setIsChoosingImage(true);
      const { filePaths } = await chooseImage({
        sourceType: ['camera'], // Ép buộc sử dụng camera
        count: 1,
        cameraType: 'front', // Ưu tiên cam trước nếu Zalo hỗ trợ cấu hình này tùy bản
      });

      if (filePaths && filePaths.length > 0) {
        const path = filePaths[0];
        setImagePreview(path);

        // Đổi đường dẫn thành Blob
        const res = await fetch(path);
        const blob = await res.blob();
        setImageBlob(blob);
      }
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi mở Camera.');
    } finally {
      setIsChoosingImage(false);
    }
  };

  // Gọi api submit
  const handleSubmit = async () => {
    if (!location) {
      message.warning('Vui lòng làm mới định vị GPS trước.');
      return;
    }
    if (!imageBlob) {
      message.warning('Vui lòng chụp ảnh khuôn mặt tại nơi làm việc.');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      // Tùy chỉnh mimetype cho blob (default thường là image/jpeg khi chụp bằng camera)
      formData.append('image', imageBlob, 'checkin_selfie.jpg');
      formData.append('timestamp', new Date().toISOString());

      await checkinApi.checkIn(formData);
      setIsCheckedIn(true);
      message.success('Chấm công ca làm việc THÀNH CÔNG!');
    } catch (error: any) {
      message.error(error.message || 'Lỗi khi chấm công. Hãy thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex flex-col w-full min-h-screen relative pb-[90px] ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f4f5f8]'}`}>
      <Header title="Chấm Công Vào Ca" showBackIcon />

      {!isCheckedIn ? (
        <div className="px-5 mt-10 space-y-6">
          {/* Thông tin thời gian (Mock) */}
          <div className="flex flex-col items-center p-6 rounded-[24px] bg-gradient-to-br from-[#1e3ba1] to-[#2563eb] text-white shadow-lg shadow-blue-900/20">
            <span className="text-[14px] font-semibold opacity-90 uppercase tracking-widest">Giờ hiện tại</span>
            <div className="text-[48px] font-black tracking-tighter mt-1 mb-2 leading-none">
              {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <span className="text-[13px] opacity-90">
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {/* Section 1: Location */}
          <div className={`p-5 rounded-[24px] shadow-sm flex flex-col gap-3 ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-[15px] font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <EnvironmentOutlined className="text-teal-500" /> Vị trí hiện tại
              </span>
              {location ? (
                <span className="text-[12px] font-bold text-teal-500 bg-teal-50 px-2 py-1 rounded-md">Đã lấy GPS</span>
              ) : (
                <span className="text-[12px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">Chưa có GPS</span>
              )}
            </div>

            {location ? (
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col">
                <span className="text-[12px] font-medium text-gray-500">Kinh độ: {location.longitude}</span>
                <span className="text-[12px] font-medium text-gray-500">Vĩ độ: {location.latitude}</span>
              </div>
            ) : (
              <button
                onClick={handleGetLocation}
                disabled={isLoadingLocation}
                className="py-3 rounded-[16px] border border-gray-200 text-gray-600 font-bold bg-transparent active:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                {isLoadingLocation ? <Spin size="small" /> : 'Làm mới tọa độ'}
              </button>
            )}
          </div>

          {/* Section 2: Camera Selfie */}
          <div className={`p-5 rounded-[24px] shadow-sm flex flex-col gap-3 ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
            <span className={`text-[15px] font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <CameraOutlined className="text-[#1d4ed8]" /> Ảnh tại nơi làm việc
            </span>

            {imagePreview ? (
              <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden group">
                <img src={imagePreview} alt="Selfie preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={handleCaptureImage} className="bg-white text-gray-900 font-bold py-2 px-4 rounded-xl border-none">
                    Chụp lại
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleCaptureImage}
                disabled={isChoosingImage}
                className="w-full aspect-[4/3] rounded-[16px] border-2 border-dashed border-blue-200 flex flex-col items-center justify-center gap-2 bg-blue-50/50 text-[#1e3ba1] active:bg-blue-50 transition-colors border-none"
              >
                {isChoosingImage ? <Spin size="small" /> : <CameraOutlined className="text-[32px]" />}
                <span className="text-[13px] font-bold">Chạm để mở Camera</span>
              </button>
            )}
          </div>

          {/* Submit Action */}
          <button
            onClick={handleSubmit}
            disabled={!location || !imageBlob || isSubmitting}
            className="w-full py-4 mt-4 rounded-[20px] font-black text-[15px] text-white bg-gradient-to-r from-[#1e3ba1] to-[#2563eb] border-none shadow-[0_8px_20px_rgba(30,59,161,0.3)] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:grayscale disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <LoadingOutlined className="text-[20px]" /> : <CheckCircleOutlined className="text-[20px]" />}
            XÁC NHẬN CHẤM CÔNG CỦA BẠN
          </button>
        </div>
      ) : (
        /* Trạng thái thành công */
        <div className="px-5 flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-2">
            <CheckCircleOutlined className="text-[48px]" />
          </div>
          <h2 className={`text-[24px] font-black text-center m-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Thành công!
          </h2>
          <p className="text-[14px] text-gray-500 font-medium text-center px-4">
            Dữ liệu chấm công và hình ảnh của bạn đã được hệ thống ghi nhận hợp lệ.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 mt-4 rounded-full bg-[#1e3ba1] text-white font-bold border-none active:scale-95 transition-transform shadow-md"
          >
            Quay lại công việc
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckInPage;
