import React, { useState } from 'react';
import { Badge, Popover, List, Typography, Empty, Button } from 'antd';
import { BellOutlined, CheckCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useNotificationStore } from '@/stores/notification.store';
import { notificationApi } from '@/api/notification.api';
import { useAuthStore } from '@/stores/auth.store';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text } = Typography;

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, setNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const { user } = useAuthStore();
  const [visible, setVisible] = useState(false);

  React.useEffect(() => {
    notificationApi.getNotifications()
      .then(setNotifications)
      .catch(console.error);
  }, [setNotifications]);

  const handleMarkAsRead = async (id: number) => {
    await notificationApi.markAsRead(id);
    markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await notificationApi.markAllAsRead();
    markAllAsRead();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'TASK_ASSIGNED': return <InfoCircleOutlined className="text-blue-500" />;
      case 'TASK_COMPLETED': return <CheckCircleOutlined className="text-green-500" />;
      case 'URGENT': return <WarningOutlined className="text-red-500" />;
      default: return <BellOutlined className="text-gray-400" />;
    }
  };

  const content = (
    <div className="w-[320px] max-h-[450px] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <span className="text-[16px] font-black text-gray-800">Thông báo {unreadCount > 0 && `(${unreadCount})`}</span>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={() => handleMarkAllAsRead()} className="text-[12px] font-bold">
            Đọc tất cả
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {notifications.length > 0 ? (
          <List
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                className={`cursor-pointer hover:bg-gray-50 transition-colors p-4 border-b last:border-b-0 ${!item.isRead ? 'bg-blue-50/50' : ''}`}
                onClick={() => {
                  handleMarkAsRead(item.id);
                  setVisible(false);
                }}
              >
                <div className="flex gap-3 items-start w-full">
                  <div className="mt-1">{getIcon(item.type)}</div>
                  <div className="flex-1 flex flex-col gap-0.5">
                    <span className={`text-[13px] leading-tight ${!item.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                      {item.title}
                    </span>
                    <span className="text-[12px] text-gray-500 line-clamp-2">
                      {item.message}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1 font-medium italic">
                      {dayjs(item.createdAt).fromNow()}
                    </span>
                  </div>
                  {!item.isRead && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  )}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <div className="py-10">
            <Empty description="Không có thông báo nào" />
          </div>
        )}
      </div>

      <div className="p-2 border-t text-center">
        <Button type="text" block className="text-[12px] text-gray-500 font-bold">
          Xem tất cả thông báo
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
      placement="bottom"
      overlayClassName="noti-popover"
      styles={{
        content: {
          padding: 0,
          borderRadius: '16px',
          overflow: 'hidden'
        }
      }}
    >
      <Badge
        count={unreadCount}
        size="small"
        offset={[-4, 4]}
        className="cursor-pointer active:scale-95 transition-transform"
      >
        <div className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <BellOutlined className="text-[18px] text-gray-600" />
        </div>
      </Badge>
    </Popover>
  );
};
