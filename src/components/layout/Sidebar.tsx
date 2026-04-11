import React, { useEffect, useState } from 'react';
import { useNavigate } from 'zmp-ui';
import { Avatar } from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useThemeStore } from '../../stores/theme.store';
import { useAuthStore } from '../../stores/auth.store';
import { menuConfig, MenuItem } from '../../configs/menu.config';

export const Sidebar: React.FC = () => {
  const { isSidebarCollapsed, setSidebarCollapsed } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [selectedKey, setSelectedKey] = useState<string>('dashboard');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname;
      if (path !== currentPath) setCurrentPath(path);
    };
    const interval = setInterval(checkPath, 200);
    return () => clearInterval(interval);
  }, [currentPath]);

  useEffect(() => {
    const findKey = (items: MenuItem[]): string | null => {
      for (const item of items) {
        if (item?.path === currentPath) return item.key as string;
        if (item && 'children' in item && item.children) {
          const childKey = findKey(item.children as MenuItem[]);
          if (childKey) return childKey;
        }
      }
      return null;
    };
    setSelectedKey(findKey(menuConfig) || 'dashboard');
  }, [currentPath]);

  const handleMenuClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path);
      setCurrentPath(item.path);
      setSidebarCollapsed(true);
    }
  };

  const handleLogout = () => {
    logout();
    setSidebarCollapsed(true);
    navigate('/login');
  };

  const closeSidebar = () => setSidebarCollapsed(true);

  if (isSidebarCollapsed) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[998] transition-opacity duration-300"
        onClick={closeSidebar}
      />

      {/* Sidebar Panel */}
      <div
        className="fixed top-0 left-0 bottom-0 w-[260px] bg-white z-[999] shadow-2xl flex flex-col transition-transform duration-300"
        style={{ animation: 'slideInLeft 0.25s ease-out' }}
      >
        {/* Profile Section */}
        <div className="px-5 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar
              size={48}
              icon={<UserOutlined />}
              src={user?.avatar}
              className="shadow-md flex-shrink-0"
              style={{ backgroundColor: '#4096ff' }}
            />
            <div className="min-w-0">
              <h3 className="text-base font-bold leading-tight m-0 text-gray-900 truncate">
                Admin Portal
              </h3>
              <p className="text-[10px] font-semibold tracking-[0.15em] m-0 text-gray-400 uppercase">
                Enterprise Management
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {menuConfig.map((item) => {
            if (!item) return null;
            const menuItem = item as any;
            const isActive = selectedKey === (menuItem.key as string);

            return (
              <button
                key={menuItem.key}
                onClick={() => handleMenuClick(item)}
                className={`
                  relative w-full flex items-center gap-3 px-4 py-3.5 mb-0.5 border-none cursor-pointer
                  transition-all duration-200 rounded-xl text-left
                  ${isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-transparent text-gray-600 active:bg-gray-50'
                  }
                `}
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r-full bg-blue-500" />
                )}

                {/* Icon */}
                <span className={`text-lg flex items-center justify-center w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                  {menuItem.icon}
                </span>

                {/* Label */}
                <span className={`text-[15px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {menuItem.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-none cursor-pointer transition-all duration-200 rounded-xl bg-transparent text-gray-500 active:bg-red-50 active:text-red-500"
            style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
          >
            <LogoutOutlined className="text-lg" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Slide-in animation */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};
