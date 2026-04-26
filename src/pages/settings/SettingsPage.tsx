import React, { useState } from 'react';
import { useThemeStore } from '../../stores/theme.store';
import { useAuthStore } from '../../stores/auth.store';
import { useTenantResolver } from '../../hooks/useTenantResolver';
import { useNavigate, Page } from 'zmp-ui';
import {
  RightOutlined,
  SettingOutlined,
  BellOutlined,
  LockOutlined,
  GlobalOutlined,
  FormatPainterOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  ToolOutlined,
  CameraOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { message, Switch, Modal, Input } from 'antd';
import { authApi } from '../../api/auth.api';
import { getUserInfo } from 'zmp-sdk';

const SettingsPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { user, logout, setUser } = useAuthStore();
  const { tenantConfig } = useTenantResolver();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newName, setNewName] = useState(user?.fullName || user?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      message.error('Vui lòng nhập tên!');
      return;
    }
    setIsUpdating(true);
    try {
      const updatedUser = await authApi.updateProfile({ fullName: newName });
      setUser(updatedUser);
      message.success('Cập nhật tên thành công!');
      setIsEditModalVisible(false);
    } catch (err) {
      message.error('Lỗi khi cập nhật tên!');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSyncZalo = async () => {
    try {
      const { userInfo } = await getUserInfo({});
      if (userInfo && userInfo.name) {
        setNewName(userInfo.name);
        message.info(`Đã lấy tên từ Zalo: ${userInfo.name}`);
      }
    } catch (err) {
      message.error('Không thể lấy thông tin từ Zalo!');
    }
  };

  return (
    <Page className={`flex flex-col w-full h-full relative pb-24 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f4f5f8]'}`}>

      {/* Header */}
      <div className={`flex items-center px-5 pt-8 pb-4 sticky top-0 z-50 ${isDarkMode ? 'bg-[#121212] border-b border-gray-800' : 'bg-[#f4f5f8]'}`}>
        <h1 className={`text-[22px] font-black tracking-tight m-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Cài đặt hệ thống
        </h1>
      </div>

      <div className="px-5 mt-2 space-y-6">

        {/* Profile Card */}
        <div className={`rounded-[20px] p-5 flex items-center gap-4 shadow-sm ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
          {/* Avatar */}
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
            <img src={user?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=AdminPortal"} alt="Profile" className="w-full h-full object-cover bg-blue-50" />
          </div>
          <div className="flex flex-col flex-1">
            <h2 className={`text-[16px] font-bold m-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
               {user?.fullName || user?.name || user?.username || 'Thành viên'}
            </h2>
            <p className="text-[12px] text-gray-400 font-medium m-0 mt-0.5">
              {user?.roles?.[0] || 'Member'} • {user?.phone || 'No phone'}
            </p>
          </div>
          <button 
            onClick={() => {
              setNewName(user?.fullName || user?.name || '');
              setIsEditModalVisible(true);
            }}
            className="bg-[#eff6ff] text-[#1d4ed8] text-[12px] font-bold py-1.5 px-3 rounded-full border-none active:scale-95 transition-transform"
          >
            Sửa
          </button>
        </div>

        {/* Modal Sửa Tên */}
        <Modal
          title={<span className="font-black text-gray-800">Chỉnh sửa tên hiển thị</span>}
          open={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          onOk={handleUpdateName}
          confirmLoading={isUpdating}
          okText="Lưu thay đổi"
          cancelText="Hủy"
          centered
          className="rounded-2xl overflow-hidden"
        >
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider pl-1">Họ và tên</label>
              <Input 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                placeholder="Nhập tên của bạn..."
                className="h-12 rounded-xl bg-gray-50 border-none font-bold text-gray-800"
              />
            </div>
            
            <button 
              onClick={handleSyncZalo}
              className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-[13px] border-none flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <img src="https://hstatic.net/0/0/global/design/theme-default/zalo-icon.png" className="w-5 h-5" alt="zalo" />
              ĐỒNG BỘ TÊN TỪ ZALO
            </button>
          </div>
        </Modal>

        {/* Group 1: Tuỳ chỉnh */}
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest pl-2">Tuỳ chỉnh</span>
          <div className={`rounded-[20px] flex flex-col overflow-hidden shadow-sm ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
            <SettingRow icon={<FormatPainterOutlined className="text-blue-500" />} label="Chế độ Tối (Dark Mode)" isDarkMode={isDarkMode} >
              <Switch checked={isDarkMode} onChange={toggleDarkMode} />
            </SettingRow>
            <div className={`h-[1px] ml-[50px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}></div>
            <SettingRow icon={<BellOutlined className="text-orange-500" />} label="Thông báo đẩy" isDarkMode={isDarkMode} >
              <Switch checked={notifications} onChange={setNotifications} />
            </SettingRow>
          </div>
        </div>

        {/* Group 2: Doanh nghiệp */}
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest pl-2">Doanh nghiệp</span>
          <div className={`rounded-[20px] flex flex-col overflow-hidden shadow-sm ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
            <SettingRow 
              icon={<CameraOutlined className="text-blue-500" />} 
              label="Đăng ký khuôn mặt" 
              isDarkMode={isDarkMode} 
              showArrow={!user?.isFaceRegistered}
              onClick={() => !user?.isFaceRegistered && navigate('/register-face')}
            >
              {user?.isFaceRegistered ? (
                <span className="text-green-500 text-[12px] font-bold flex items-center gap-1">
                  <CheckCircleOutlined /> Đã đăng ký
                </span>
              ) : (
                <span className="text-blue-500 text-[12px] font-bold underline">Chưa đăng ký</span>
              )}
            </SettingRow>
            <div className={`h-[1px] ml-[50px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}></div>
            <SettingRow icon={<ToolOutlined className="text-green-500" />} label="Cấu hình hệ thống" isDarkMode={isDarkMode} showArrow />
            <div className={`h-[1px] ml-[50px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}></div>
            <SettingRow icon={<GlobalOutlined className="text-teal-500" />} label="Quản lý Tên miền / Website" isDarkMode={isDarkMode} showArrow />
            <div className={`h-[1px] ml-[50px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}></div>
            <SettingRow icon={<LockOutlined className="text-red-500" />} label="Bảo mật & Phân quyền" isDarkMode={isDarkMode} showArrow />
          </div>
        </div>

        {/* Group 3: Hỗ trợ */}
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest pl-2">Khác</span>
          <div className={`rounded-[20px] flex flex-col overflow-hidden shadow-sm ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-white'}`}>
            <SettingRow icon={<QuestionCircleOutlined className="text-gray-500" />} label="Trung tâm trợ giúp" isDarkMode={isDarkMode} showArrow onClick={() => navigate('/support')} />
            <div className={`h-[1px] ml-[50px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}></div>
            <SettingRow icon={<SettingOutlined className="text-gray-500" />} label="Về Zalo Mini App" isDarkMode={isDarkMode} showArrow />
          </div>
        </div>

        {/* Logout Button Mobile */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-white rounded-[16px] py-4 flex items-center justify-center gap-2 border border-red-50 shadow-sm active:bg-red-50 transition-colors"
        >
          <LogoutOutlined className="text-[16px] text-red-500" />
          <span className="text-[15px] font-extrabold text-red-500">Đăng xuất tài khoản</span>
        </button>

      </div>
    </Page>
  );
};

// Helper component for Setting Rows
const SettingRow = ({ icon, label, children, showArrow, isDarkMode, onClick }: any) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-4 transition-colors cursor-pointer ${isDarkMode ? 'active:bg-gray-800' : 'active:bg-gray-50'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[16px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          {icon}
        </div>
        <span className={`text-[15px] font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {children}
        {showArrow && <RightOutlined className="text-gray-300 text-[12px]" />}
      </div>
    </div>
  );
};

export default SettingsPage;
