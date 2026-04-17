import React, { useState, useRef, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { useAuthStore } from '@/stores/auth.store';
import { message, Spin } from 'antd';
import { useNavigate, Header, Page } from 'zmp-ui';
import { 
  CameraOutlined, 
  LeftOutlined, 
  CheckCircleOutlined, 
  SafetyCertificateOutlined,
  SyncOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { checkinApi } from '@/api/checkin.api';

const MAX_PHOTOS = 5;

export const RegisterFacePage: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { user, refreshUser } = useAuthStore();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState<Blob[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0 to 4
  const [countdown, setCountdown] = useState(0); // 0 means no active countdown
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const countdownTimerRef = useRef<any>(null);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      clearCountdown();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const clearCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }

  // Effect for Auto-capture logic
  useEffect(() => {
    if (isScanning && photos.length < MAX_PHOTOS && !isSubmitting) {
        // Start countdown for the current step
        setCountdown(3);
        
        clearCountdown();
        
        countdownTimerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearCountdown();
                    capturePhoto();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    } else {
        clearCountdown();
        setCountdown(0);
    }
  }, [isScanning, photos.length]);

  const startCamera = async () => {
    try {
      setPhotos([]);
      setPreviews([]);
      setScanStep(0);
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 480, height: 640 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera Error:", error);
      message.error('Không thể truy cập Camera. Vui lòng cấp quyền.');
      setIsScanning(false);
    }
  };

  const capturePhoto = () => {
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
            setPhotos(prev => {
                const newPhotos = [...prev, blob];
                if (newPhotos.length >= MAX_PHOTOS) {
                    stopCamera();
                }
                return newPhotos;
            });
            setPreviews(prev => [...prev, URL.createObjectURL(blob)]);
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const stopCamera = () => {
    clearCountdown();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const resetPhotos = () => {
    setPhotos([]);
    setPreviews([]);
    setScanStep(0);
    startCamera();
  };

  const handleSubmit = async () => {
    if (photos.length < MAX_PHOTOS) {
      message.warning(`Vui lòng chụp đủ ${MAX_PHOTOS} ảnh.`);
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      photos.forEach((blob, index) => {
        formData.append('photos', blob, `face_${index}.jpg`);
      });

      await checkinApi.registerFace(formData);
      message.success('Đăng ký khuôn mặt thành công!');
      
      if (refreshUser) await refreshUser();
      
      setTimeout(() => navigate('/user-home'), 1500);
    } catch (error: any) {
      message.error(error.message || 'Lỗi đăng ký khuôn mặt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepGuide = (step: number) => {
    const guides = [
        "1. NHÌN THẲNG",
        "2. NGHIÊNG TRÁI",
        "3. NGHIÊNG PHẢI",
        "4. NGƯỚC LÊN",
        "5. CÚI XUỐNG"
    ];
    return guides[step] || "Hoàn tất lấy mẫu";
  };

  if (user?.isFaceRegistered) {
      return (
        <Page className={`p-5 flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f4f5f8]'}`}>
            <Header title="Đăng ký khuôn mặt" showBackIcon />
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
                <CheckCircleOutlined className="text-4xl" />
            </div>
            <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Bạn đã đăng ký!</h2>
            <p className="text-gray-500 text-center mb-8 px-6">Hệ thống đã có dữ liệu khuôn mặt của bạn. Bạn không cần đăng ký lại.</p>
            <button 
                onClick={() => navigate('/user-home')}
                className="w-full py-3 bg-[#1e3ba1] text-white font-bold rounded-xl border-none shadow-lg active:scale-95 transition-all"
            >
                Quay lại Trang chủ
            </button>
        </Page>
      );
  }

  return (
    <div className={`flex flex-col w-full min-h-screen relative pb-10 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f4f5f8]'}`}>
      <Header title="Lấy mẫu khuôn mặt" showBackIcon />

      <div className="px-5 mt-6 space-y-8">
        {/* Progress Tracker */}
        <div className="flex justify-between items-center px-2">
            {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-500 ${
                        photos.length > i ? 'bg-green-500 text-white' : 
                        photos.length === i ? 'bg-[#1e3ba1] text-white scale-110 shadow-lg' : 
                        'bg-gray-200 text-gray-500'
                    }`}>
                        {photos.length > i ? <CheckCircleOutlined /> : i + 1}
                    </div>
                </div>
            ))}
        </div>

        {/* Camera Container */}
        <div className="flex flex-col items-center gap-6">
            <div className={`relative w-[280px] h-[360px] rounded-[100px] overflow-hidden border-8 ${isScanning ? 'border-blue-500 animate-pulse-slow' : 'border-gray-200'} bg-black group shadow-2xl transition-all duration-500`}>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover mirror" style={{ transform: 'scaleX(-1)' }} />
                <canvas ref={canvasRef} className="hidden" />

                {/* Guidance Overlay */}
                {isScanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {/* Countdown circle */}
                        {countdown > 0 && (
                            <div className="w-24 h-24 rounded-full border-4 border-white/40 flex items-center justify-center animate-ping-slow">
                                <span className="text-white text-4xl font-black">{countdown}</span>
                            </div>
                        )}
                        
                        {/* Direction Mask/Frame could go here */}
                    </div>
                )}

                {!isScanning && photos.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/60 backdrop-blur-sm">
                        <button onClick={startCamera} className="w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-2xl active:scale-90 transition-all">
                            <CameraOutlined className="text-[28px]" />
                        </button>
                        <span className="mt-3 text-white font-bold text-[14px]">Bắt đầu quét tự động</span>
                    </div>
                )}

                {isScanning && (
                    <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center">
                         <div className="bg-black/60 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 shadow-xl">
                            <span className="text-white text-[14px] font-black tracking-wide">
                                {getStepGuide(photos.length)}
                            </span>
                        </div>
                    </div>
                )}

                {photos.length >= MAX_PHOTOS && !isSubmitting && (
                    <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex flex-col items-center justify-center">
                        <CheckCircleOutlined className="text-white text-6xl mb-4" />
                        <span className="text-white font-black text-lg">Đã lấy đủ 5 mẫu!</span>
                    </div>
                )}

                {isSubmitting && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#fff' }} spin />} />
                        <span className="mt-4 text-white font-bold">Đang xử lý khuôn mặt...</span>
                    </div>
                )}
            </div>

            {/* Instruction text */}
            <div className="text-center px-4">
                <p className={`text-[15px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {isScanning ? "Hệ thống đang tự động chụp mẫu..." : (photos.length < MAX_PHOTOS ? "Chuẩn bị lấy mẫu khuôn mặt." : "Kiểm tra lại hình ảnh và hoàn tất.")}
                </p>
                <p className="text-gray-400 text-[12px] mt-1 italic">
                    {isScanning ? "Vui lòng giữ điện thoại ổn định." : "Nhấn bắt đầu để lấy đủ 5 hướng khuôn mặt."}
                </p>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
            {photos.length >= MAX_PHOTOS && !isSubmitting && (
                <>
                    <button 
                        onClick={handleSubmit}
                        className="w-full py-4 bg-green-600 text-white font-black rounded-[24px] border-none shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <SafetyCertificateOutlined className="text-xl" /> HOÀN TẤT ĐĂNG KÝ
                    </button>
                    <button 
                        onClick={startCamera}
                        className={`w-full py-3 rounded-[20px] font-bold ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'} border-none flex items-center justify-center gap-2`}
                    >
                        <SyncOutlined /> Chụp lại từ đầu
                    </button>
                </>
            )}
        </div>


        {/* Thumbnail Preview Area */}
        <div className="flex gap-3 overflow-x-auto py-2 pb-10 scrollbar-hide">
             {previews.map((src, i) => (
                 <div key={i} className="relative w-20 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                     <img src={src} className="w-full h-full object-cover" />
                     <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                         <CheckCircleOutlined />
                     </div>
                 </div>
             ))}
             {Array.from({ length: MAX_PHOTOS - previews.length }).map((_, i) => (
                 <div key={i} className="w-20 h-24 flex-shrink-0 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50/50">
                     <span className="text-gray-300 text-[10px] font-bold">Mẫu {previews.length + i + 1}</span>
                 </div>
             ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { border-color: #3b82f6; box-shadow: 0 0 20px rgba(59,130,246,0.3); }
          50% { border-color: #1e3ba1; box-shadow: 0 0 40px rgba(59,130,246,0.6); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        .mirror {
          transform: scaleX(-1);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default RegisterFacePage;
