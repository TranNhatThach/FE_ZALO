import React, { useState } from 'react';
import { Badge, List, Typography, Empty, Button, Modal, Spin } from 'antd';
import {
  BellOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  DeleteOutlined,
  NotificationOutlined,
  TrophyOutlined,
  StopOutlined
} from '@ant-design/icons';
import { useNotificationStore } from '@/stores/notification.store';
import { notificationApi } from '@/api/notification.api';
import { useAuthStore } from '@/stores/auth.store';
import { useThemeStore } from '@/stores/theme.store';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Text } = Typography;

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, setNotifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
  const { isDarkMode } = useThemeStore();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationApi.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Lỗi tải thông báo:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
  }, [setNotifications]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      markAsRead(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      markAllAsRead();
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm"><InfoCircleOutlined className="text-[14px]" /></div>;
      case 'TASK_COMPLETED':
        return <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm"><CheckCircleOutlined className="text-[14px]" /></div>;
      case 'TASK_APPROVED':
        return <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm"><TrophyOutlined className="text-[14px]" /></div>;
      case 'TASK_REJECTED':
        return <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shadow-sm"><StopOutlined className="text-[14px]" /></div>;
      case 'URGENT':
        return <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shadow-sm"><WarningOutlined className="text-[14px]" /></div>;
      default:
        return <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shadow-sm"><NotificationOutlined className="text-[14px]" /></div>;
    }
  };

  return (
    <>
      <Badge
        count={unreadCount}
        size="small"
        offset={[-2, 6]}
        style={{ backgroundColor: '#ff4d4f', boxShadow: '0 0 0 2px #fff' }}
        className="cursor-pointer active:scale-95 transition-all"
      >
        <button
          onClick={() => setVisible(true)}
          className={`w-9 h-9 flex items-center justify-center rounded-xl border-none transition-all ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 shadow-sm border border-gray-100'
            }`}
        >
          <BellOutlined className="text-[18px]" />
        </button>
      </Badge>

      <Modal
        title={null}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width="100%"
        centered={false}
        closable={false}
        styles={{
          body: { padding: 0 },
          mask: { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.4)' }
        }}
        className="notification-drawer"
      >
        <div className={`flex flex-col h-[40vh] rounded-t-[24px] overflow-hidden ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-[#fcfdff]'}`}>
          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100/10">
            <div>
              <h2 className={`text-[17px] font-black m-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Thông báo</h2>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Bạn có {unreadCount} tin mới</p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  type="text"
                  size="small"
                  onClick={handleMarkAllAsRead}
                  className="text-blue-500 font-bold text-[12px] hover:bg-blue-50"
                >
                  Đọc tất cả
                </Button>
              )}
              <button
                onClick={() => setVisible(false)}
                className="w-8 h-8 rounded-full bg-gray-100 border-none flex items-center justify-center active:scale-90 transition-all"
              >
                <CheckOutlined className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
            {loading ? (
              <div className="h-full flex items-center justify-center"><Spin /></div>
            ) : notifications.length > 0 ? (
              <List
                dataSource={notifications}
                renderItem={(item) => (
                  <div
                    onClick={() => handleMarkAsRead(item.id)}
                    className={`p-3 rounded-xl mb-2 flex gap-3 transition-all active:scale-[0.98] border ${!item.isRead
                        ? (isDarkMode ? 'bg-blue-900/10 border-blue-800/30 shadow-sm' : 'bg-blue-50/50 border-blue-100/50 shadow-sm')
                        : (isDarkMode ? 'bg-[#222] border-gray-800 opacity-60' : 'bg-white border-gray-50 opacity-80')
                      }`}
                  >
                    <div className="shrink-0">{getIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[13px] font-black truncate pr-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</span>
                        {!item.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
                      </div>
                      <p className={`text-[11px] leading-relaxed mb-1.5 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.message}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                        <ClockCircleOutlined />
                        <span>{dayjs(item.createdAt).fromNow()}</span>
                      </div>
                    </div>
                  </div>
                )}
              />
            ) : (
              <div className="h-full flex flex-center flex-col justify-center opacity-40 grayscale">
                <Empty description={<span className="font-bold text-gray-400">Bạn đã cập nhật hết tin nhắn</span>} />
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-6 bg-transparent">
            <Button
              block
              size="large"
              onClick={() => setVisible(false)}
              className={`h-12 rounded-xl font-black text-[13px] uppercase tracking-widest border-none shadow-lg ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-[#1e3ba1] text-white shadow-blue-900/20'
                }`}
            >
              Đóng lại
            </Button>
          </div>
        </div>
      </Modal>

      <style>{`
        .notification-drawer .ant-modal-content {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .notification-drawer {
          position: fixed !important;
          bottom: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};
