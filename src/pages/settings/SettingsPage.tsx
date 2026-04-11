import React, { useState } from 'react';
import { useThemeStore } from '../../stores/theme.store';
import { useAuthStore } from '../../stores/auth.store';
import { useNavigate } from 'zmp-ui';
import { 
  RightOutlined,
  SettingOutlined,
  BellOutlined,
  LockOutlined,
  GlobalOutlined,
  FormatPainterOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { message, Switch } from 'antd';

const SettingsPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`flex flex-col w-full h-full relative pb-24 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f4f5f8]'}`}>
      
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
             <img src="https://api.dicebear.com/7.x/notionists/svg?seed=AdminPortal" alt="Profile" className="w-full h-full object-cover bg-blue-50" />
          </div>
          <div className="flex flex-col flex-1">
             <h2 className={`text-[16px] font-bold m-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
               {user?.username || 'Admin Portal'}
             </h2>
             <p className="text-[12px] text-gray-400 font-medium m-0 mt-0.5">
               {user?.role || 'Enterprise Admin'}
             </p>
          </div>
          <button className="bg-[#eff6ff] text-[#1d4ed8] text-[12px] font-bold py-1.5 px-3 rounded-full border-none active:scale-95 transition-transform">
             Sửa
          </button>
        </div>

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
            <SettingRow icon={<QuestionCircleOutlined className="text-gray-500" />} label="Trung tâm trợ giúp" isDarkMode={isDarkMode} showArrow />
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
    </div>
  );
};

// Helper component for Setting Rows
const SettingRow = ({ icon, label, children, showArrow, isDarkMode }: any) => {
  return (
    <div className={`flex items-center justify-between px-4 py-4 active:bg-gray-50 transition-colors ${isDarkMode ? 'active:bg-gray-800' : 'active:bg-gray-50'}`}>
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
