import React, { useEffect, useState } from 'react';
import { Layout, Menu, Drawer } from 'antd';
import { useLocation, useNavigate } from 'zmp-ui';
import { useThemeStore } from '../../stores/theme.store';
import { useMobile } from '../../hooks/useMobile';
import { menuConfig, MenuItem } from '../../configs/menu.config';
import { useAuthStore } from '../../stores/auth.store';
import { LogoutOutlined } from '@ant-design/icons';

export const Sidebar: React.FC = () => {
  const { isSidebarCollapsed, setSidebarCollapsed, isDarkMode } = useThemeStore();
  const { user, logout } = useAuthStore();
  const allRoles = [...(user?.roles || []), user?.roleName || ''].join(',').toUpperCase();
  const isAdmin = allRoles.includes('ADMIN');
  const isMobile = useMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // Lọc menu dựa trên Role - Memoize để tránh Re-render vô tận
  const filteredMenu = React.useMemo(() => {
    if (isAdmin) {
      return menuConfig.filter(item => 
        !['/user-home', '/checkin', '/attendance-history'].includes(item.path as string)
      );
    }
    return menuConfig.filter(item => 
      ['/user-home', '/tasks', '/checkin', '/attendance-history', '/finance', '/settings', '/support'].includes(item.path as string)
    );
  }, [isAdmin]);

  useEffect(() => {
    const path = location.pathname;

    const findKeys = (items: MenuItem[], parentKeys: string[] = []): { selected: string, parents: string[] } | null => {
      for (const item of items) {
        if (item?.path === path) return { selected: item.key as string, parents: parentKeys };
        if (item && 'children' in item && item.children) {
          const result = findKeys(item.children as MenuItem[], [...parentKeys, item.key as string]);
          if (result) return result;
        }
      }
      return null;
    };

    const result = findKeys(filteredMenu);
    if (result) {
      setSelectedKeys([result.selected]);
      if (!isSidebarCollapsed) {
        setOpenKeys(prev => Array.from(new Set([...prev, ...result.parents])));
      }
    } else {
      setSelectedKeys(['/dashboard']); 
    }
  }, [location.pathname, isSidebarCollapsed, filteredMenu]);

  const handleMenuClick = (e: { key: string }) => {
    const findPath = (items: MenuItem[], key: string): string | undefined => {
      for (const item of items) {
        if (item?.key === key) return item.path;
        if (item && 'children' in item && item.children) {
          const childPath = findPath(item.children as MenuItem[], key);
          if (childPath) return childPath;
        }
      }
      return undefined;
    };

    const path = findPath(filteredMenu, e.key);
    if (path) {
      navigate(path);
      if (isMobile) {
        setSidebarCollapsed(true);
      }
    }
  };

  const menuContent = (
    <div className={`flex flex-col h-full border-r relative transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1c] border-gray-800' : 'bg-[#f4f5f8] border-gray-100'}`}>
      
      {/* Header Profile */}
      <div className="flex flex-col px-6 pt-10 pb-6">
        <div className="w-[60px] h-[60px] rounded-[16px] border-[2px] border-[#1e3ba1] p-[2px] mb-4 bg-white flex items-center justify-center">
          <img 
            src={user?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=AdminPortal"} 
            alt="Avatar" 
            className="w-full h-full object-cover rounded-[12px] bg-blue-50" 
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[17px] font-extrabold text-[#1d4ed8] tracking-tight">{isAdmin ? 'Quản trị hệ thống' : 'Kênh nhân viên'}</span>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1.5">{isAdmin ? 'Quản lý doanh nghiệp' : 'Không gian làm việc'}</span>
        </div>
      </div>

      {/* Menu Area */}
      <div className="flex-1 overflow-y-auto px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <Menu
          mode="inline"
          theme={isDarkMode ? 'dark' : 'light'}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          onClick={handleMenuClick}
          items={filteredMenu}
          className={`border-r-0 bg-transparent transition-colors duration-300 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
        />
        <style>{`
          .ant-menu-light .ant-menu-item-selected {
            background-color: transparent !important;
            color: #1d4ed8 !important;
            font-weight: 800 !important;
          }
          .ant-menu-light .ant-menu-item-selected::after {
            border-right-width: 4px !important;
            border-right-color: #1d4ed8 !important;
            left: 0;
            right: auto;
          }
          .ant-menu-item {
            border-radius: 0 !important;
            margin-top: 0 !important;
            margin-bottom: 4px !important;
          }
        `}</style>
      </div>

      {/* Footer Logout */}
      <div className="p-4 mb-2">
        <button 
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center justify-center w-full gap-2 py-4 bg-transparent border-none outline-none cursor-pointer active:scale-95 transition-transform"
        >
          <LogoutOutlined className="text-[18px] text-[#1d4ed8] font-bold" />
          <span className="text-[15px] font-extrabold text-[#1d4ed8]">Đăng xuất</span>
        </button>
      </div>
    </div>
  );

  return (
    <Drawer
      placement="left"
      closable={false}
      onClose={() => setSidebarCollapsed(true)}
      open={!isSidebarCollapsed}
      styles={{ 
        body: { 
          padding: 0,
          width: 280
        } 
      }}
      width={280}
      zIndex={1001}
    >
      {menuContent}
    </Drawer>
  );
};

export default Sidebar;
