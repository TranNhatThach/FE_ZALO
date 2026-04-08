import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button, Card, List, Tag, Typography, message, Space, Modal } from 'antd';
import { CameraOutlined, CheckCircleOutlined, HistoryOutlined, UserOutlined, RetweetOutlined } from '@ant-design/icons';
import { attendanceService } from '../../services/attendance.service';
import { Attendance } from '../../types/attendance.types';
import api, { ZMACamera, FacingMode } from 'zmp-sdk';

const { Title, Text } = Typography;

const AttendancePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Attendance[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'REGISTER' | 'CHECKIN' | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<ZMACamera | null>(null);

  // Khởi tạo camera khi modal mở
  const initCamera = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      const camera = api.createCameraContext({
        videoElement: videoRef.current,
        mediaConstraints: {
          audio: false,
          video: true,
          facingMode: FacingMode.FRONT, // Camera trước
        },
      });

      cameraRef.current = camera;
      await camera.start();
    } catch (err) {
      console.error('Camera init error:', err);
      message.error('Không thể mở Camera. Hãy cấp quyền truy cập Camera cho ứng dụng.');
    }
  }, []);

  // Tắt camera khi modal đóng
  const stopCamera = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
  }, []);

  const startScan = (mode: 'REGISTER' | 'CHECKIN') => {
    setScanMode(mode);
    setIsScanning(true);
  };

  const closeScan = () => {
    stopCamera();
    setIsScanning(false);
    setScanMode(null);
  };

  // Chụp ảnh từ Live Camera và gửi lên Server
  const handleCapture = async () => {
    if (!cameraRef.current) {
      message.warning('Camera chưa sẵn sàng. Vui lòng chờ...');
      return;
    }

    try {
      setLoading(true);

      // takePhoto trả về PhotoFrame { data, width, height }
      const frame = cameraRef.current.takePhoto({ quality: 'high' });
      if (!frame || !frame.data) {
        message.error('Không thể chụp ảnh. Vui lòng thử lại.');
        return;
      }

      // Chuyển ImageData thành Blob
      const canvas = document.createElement('canvas');
      canvas.width = frame.width;
      canvas.height = frame.height;
      const ctx = canvas.getContext('2d')!;
      ctx.putImageData(new ImageData(new Uint8ClampedArray(frame.data), frame.width, frame.height), 0, 0);

      const photoBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Không thể tạo ảnh'));
        }, 'image/jpeg', 0.9);
      });

      if (scanMode === 'REGISTER') {
        await attendanceService.registerFace(photoBlob);
        message.success('Đăng ký mẫu khuôn mặt thành công!');
        closeScan();
      } else {
        // Lấy tọa độ GPS
        let lat: number | undefined;
        let lon: number | undefined;
        try {
          const location = await api.getLocation({});
          lat = location.latitude ? parseFloat(location.latitude) : undefined;
          lon = location.longitude ? parseFloat(location.longitude) : undefined;
        } catch {}

        const result = await attendanceService.checkIn(photoBlob, lat, lon);
        if (result.status === 'SUCCESS') {
          message.success('Chấm công thành công!');
          fetchHistory();
          closeScan();
        } else {
          message.error('Nhận diện thất bại, vui lòng thử lại.');
        }
      }
    } catch (error: any) {
      message.error(error.message || 'Lỗi xử lý AI');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await attendanceService.getMyHistory();
      setHistory(data);
    } catch {}
  };

  // Tự động load lịch sử khi vào trang
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden relative">
          <UserOutlined className="text-4xl text-blue-500" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-transparent animate-pulse" />
        </div>
        <Title level={3} className="m-0">AI Face Recognition</Title>
        <Text type="secondary">Xác thực sinh trắc học thông minh</Text>
      </div>

      <Space direction="vertical" size="large" className="w-full">
        <Card className="shadow-md border-none rounded-2xl">
          <div className="flex flex-col gap-4">
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 text-center">
              <Text className="text-blue-700 block mb-4">
                Đưa khuôn mặt vào khung quét, hệ thống sẽ tự động nhận diện và xác thực.
              </Text>
              <Button
                type="primary"
                size="large"
                icon={<CameraOutlined />}
                className="h-14 w-full font-bold rounded-xl shadow-lg"
                style={{ background: 'linear-gradient(to right, #2563eb, #4f46e5)' }}
                onClick={() => startScan('CHECKIN')}
              >
                BẮT ĐẦU CHẤM CÔNG
              </Button>
            </div>

            <Button
              block
              size="large"
              icon={<RetweetOutlined />}
              className="h-12 rounded-xl border-gray-200"
              onClick={() => startScan('REGISTER')}
            >
              Cập nhật mẫu khuôn mặt
            </Button>
          </div>
        </Card>

        <div className="flex justify-between items-center px-1">
          <Title level={5} className="m-0 flex items-center gap-2 text-gray-700">
            <HistoryOutlined /> Lịch sử chấm công
          </Title>
          <Button type="link" onClick={fetchHistory}>Làm mới</Button>
        </div>

        <List
          dataSource={history.slice(0, 5)}
          locale={{ emptyText: 'Chưa có lịch sử chấm công' }}
          renderItem={(item: Attendance) => (
            <Card className="mb-3 shadow-sm border-none rounded-xl" styles={{ body: { padding: '12px 16px' } }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${item.status === 'SUCCESS' ? 'bg-green-50' : 'bg-red-50'} rounded-lg flex items-center justify-center`}>
                    <CheckCircleOutlined className={item.status === 'SUCCESS' ? 'text-green-500' : 'text-red-500'} />
                  </div>
                  <div>
                    <div className="font-semibold">{new Date(item.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase">{new Date(item.checkInTime).toLocaleDateString()}</div>
                  </div>
                </div>
                <Tag color={item.status === 'SUCCESS' ? 'green' : 'red'} className="rounded-full px-3 m-0 border-none font-bold">
                  {item.status}
                </Tag>
              </div>
            </Card>
          )}
        />
      </Space>

      {/* Modal Live Camera */}
      <Modal
        open={isScanning}
        onCancel={closeScan}
        footer={null}
        destroyOnClose
        centered
        width="90%"
        title={scanMode === 'REGISTER' ? 'Đăng ký khuôn mặt' : 'Xác thực khuôn mặt'}
        styles={{ body: { padding: 0, overflow: 'hidden' } }}
        afterOpenChange={(open) => {
          if (open) {
            // Đợi video element mount xong rồi mới init camera
            setTimeout(initCamera, 300);
          }
        }}
      >
        <div className="relative bg-black" style={{ aspectRatio: '3/4' }}>
          {/* Video Element — Zalo Camera SDK sẽ stream vào đây */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
          />

          {/* Face Guide Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {/* Vòng tròn hướng dẫn */}
            <div
              className="rounded-full flex items-center justify-center relative"
              style={{
                width: 240,
                height: 240,
                border: '2px dashed rgba(96, 165, 250, 0.5)',
              }}
            >
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{ border: '2px solid rgba(96, 165, 250, 0.3)' }}
              />
            </div>

            <div className="mt-6 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="text-white text-sm">Giữ khuôn mặt trong vòng tròn</span>
            </div>
          </div>

          {/* Scanning Line */}
          <div
            className="absolute left-0 w-full h-0.5"
            style={{
              background: 'linear-gradient(to right, transparent, #60a5fa, transparent)',
              boxShadow: '0 0 15px #3b82f6',
              animation: 'faceScan 3s linear infinite',
            }}
          />

          {/* Capture Button */}
          <div className="absolute bottom-6 left-0 w-full flex justify-center px-6">
            <Button
              type="primary"
              size="large"
              className="h-14 w-full rounded-2xl font-bold shadow-xl"
              style={{ background: '#3b82f6', borderColor: '#3b82f6' }}
              onClick={handleCapture}
              loading={loading}
            >
              {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN KHUÔN MẶT'}
            </Button>
          </div>
        </div>
      </Modal>

      <style>{`
        @keyframes faceScan {
          0% { top: 10%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 80%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AttendancePage;
