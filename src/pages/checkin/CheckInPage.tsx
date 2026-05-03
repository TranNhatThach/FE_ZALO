import React, { useState } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { getLocation, chooseImage } from 'zmp-sdk';
import { message, Spin } from 'antd';
import { useNavigate, Header, Page } from 'zmp-ui';
import {
  LeftOutlined,
  CameraOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { checkinApi } from '@/api/checkin.api';

export const CheckInPage: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();

  const [location, setLocation] = useState<{ latitude: string; longitude: string } | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [actionType, setActionType] = useState<'IN'|'OUT'>('IN');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Lấy lịch sử chấm công
  const fetchHistory = async () => {
    try {
      const res = await checkinApi.getMyHistory();
      if (Array.isArray(res)) {
        setHistory(res);
      } else if (res && (res as any).data) {
        setHistory((res as any).data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

  // Kích hoạt Camera khi vào trang hoặc nhấn quét
  const startCamera = async () => {
    try {
      setIsScanning(true);
      setScanProgress(0);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 480, height: 640 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Bắt đầu đếm ngược tự động chụp sau khi camera sẵn sàng
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setScanProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          autoCapture(stream);
        }
      }, 100);

    } catch (error) {
      console.error("Camera Error:", error);
      message.error('Không thể truy cập Camera. Vui lòng cấp quyền hoặc sử dụng trình duyệt hỗ trợ.');
      setIsScanning(false);
    }
  };

  const autoCapture = (stream: MediaStream) => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            setImageBlob(blob);
            // Tắt stream sau khi chụp
            stream.getTracks().forEach(track => track.stop());
            setIsScanning(false);
            // Gọi submit tự động
            handleAutoSubmit(blob);
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const handleAutoSubmit = async (blob: Blob) => {
    if (!location) {
      message.warning('Vui lòng lấy GPS trước khi quét mặt.');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('lat', location.latitude);
      formData.append('lon', location.longitude);
      formData.append('photo', blob, 'checkin_autoscan.jpg');

      let response;
      if (actionType === 'IN') {
          response = await checkinApi.checkIn(formData);
      } else {
          response = await checkinApi.checkOut(formData);
      }

      if (response.data?.status?.includes('FAIL')) {
        message.warning('Nhận diện thất bại. Vui lòng thử lại!');
        setImageBlob(null);
      } else {
        setIsCheckedIn(true);
        message.success('Đã nhận diện và Chấm công THÀNH CÔNG!');
      }
    } catch (error: any) {
      message.error(error.message || 'Lỗi hệ thống khi chấm công.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        message.success('Đã xác định vị trí công ty!');
      }
    } catch (error) {
      message.error('Lỗi định vị. Cần bật GPS để chấm công.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <Page className={`flex flex-col w-full min-h-screen relative pb-[90px] ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f4f5f8]'}`}>
      <Header title="Chấm Công Remote" showBackIcon />

      {!isCheckedIn ? (
        <>
          <div className="px-5 mt-12 space-y-6">
            {/* Section 1: GPS Lock */}
            <div className={`p-4 rounded-[24px] shadow-sm flex items-center justify-between border ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-white'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${location ? 'bg-teal-50 text-teal-500' : 'bg-orange-50 text-orange-500'}`}>
                  <EnvironmentOutlined />
                </div>
                <div>
                  <div className={`text-[14px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Vị trí Remote (GPS)
                  </div>
                  <div className="text-[11px] text-gray-500">{location ? 'Đã khóa tọa độ' : 'Yêu cầu định vị GPS'}</div>
                </div>
              </div>
              {!location ? (
                <button onClick={handleGetLocation} className="px-4 py-2 bg-[#1e3ba1] text-white text-[12px] font-bold rounded-lg border-none">
                  Lấy GPS
                </button>
              ) : (
                <div className={`flex rounded-lg p-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <button 
                      onClick={() => setActionType('IN')} 
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-md border-none transition-all ${actionType === 'IN' ? 'bg-blue-500 text-white shadow-sm' : `bg-transparent ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}`}
                    >
                      BẮT ĐẦU CA
                    </button>
                    <button 
                      onClick={() => setActionType('OUT')} 
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-md border-none transition-all ${actionType === 'OUT' ? 'bg-orange-500 text-white shadow-sm' : `bg-transparent ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}`}
                    >
                      KẾT THÚC CA
                    </button>
                </div>
              )}
            </div>

            {/* Section 2: AI Scanner View */}
            <div className="flex flex-col items-center gap-4">
              <div className={`relative w-full aspect-[3/4] rounded-[40px] overflow-hidden border-4 transition-all ${isScanning ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : (isDarkMode ? 'border-gray-800 shadow-xl' : 'border-gray-200')} bg-black group`}>

                {/* Video Stream */}
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover mirror" style={{ transform: 'scaleX(-1)' }} />
                <canvas ref={canvasRef} className="hidden" />

                {/* Scan Overlay Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-[80%] h-[70%] border-[2px] border-dashed border-white/50 rounded-[100px] relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_#3b82f6] animate-scan" style={{
                        animation: 'scan 2s linear infinite'
                      }} />
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />
                    </div>

                    <div className="mt-8 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                      <span className="text-white text-[13px] font-bold tracking-widest uppercase">
                        Đang quét: {scanProgress}%
                      </span>
                    </div>
                  </div>
                )}

                {!isScanning && !imageBlob && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/40">
                    <button
                      onClick={startCamera}
                      disabled={!location}
                      className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl active:scale-90 transition-transform disabled:grayscale"
                    >
                      <CameraOutlined className="text-[32px]" />
                    </button>
                    <span className="mt-4 text-white font-bold text-[14px]">Chạm để bắt đầu quét mặt</span>
                  </div>
                )}

                {imageBlob && !isScanning && (
                  <div className="absolute inset-0">
                    <img src={URL.createObjectURL(imageBlob)} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#fff' }} spin />} />
                    </div>
                  </div>
                )}
              </div>

              <p className="text-center text-[12px] text-gray-500 px-10 font-medium">
                Vui lòng giữ điện thoại thẳng mặt và đảm bảo đủ ánh sáng để hệ thống tự động nhận diện.
              </p>
            </div>

            {/* Section 3: Attendance History List */}
            <div className="mt-8 pb-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-[16px] font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Lịch sử quét mặt</h3>
                <span className="text-[11px] font-bold text-blue-500 uppercase tracking-tight">Gần đây</span>
              </div>

              <div className="flex flex-col gap-3">
                {history.length > 0 ? history.slice(0, 5).map((item, idx) => (
                  <div key={item.id || idx} className={`p-4 rounded-[22px] border flex items-center justify-between shadow-sm ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-white border-white'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.status?.includes('SUCCESS') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {item.status?.includes('SUCCESS') ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[14px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.user?.fullName || item.user?.username || 'Nhân viên'}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {item.checkTime ? new Date(item.checkTime).toLocaleString('vi-VN') : (item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : 'Vừa xong')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${item.status?.includes('SUCCESS') || item.status === 'ON_TIME' || item.status === 'CHECK_OUT' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                        {item.status || 'HỢP LỆ'}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="py-6 text-center text-gray-400 text-[12px] border border-dashed border-gray-200 rounded-2xl">
                    Chưa có lịch sử chấm công
                  </div>
                )}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes scan {
              0% { top: 0% }
              50% { top: 100% }
              100% { top: 0% }
            }
            .mirror {
              transform: scaleX(-1);
            }
          `}</style>
        </>
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
    </Page>
  );
};

export default CheckInPage;
