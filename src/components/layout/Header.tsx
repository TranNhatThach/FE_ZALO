import React from 'react';
import { Layout, Button, Dropdown, Badge, Avatar, Breadcrumb, Switch } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BellOutlined,
  BulbOutlined,
  BulbFilled
} from '@ant-design/icons';
import { useAuthStore } from '../../stores/auth.store';
import { useThemeStore } from '../../stores/theme.store';
import { useMobile } from '../../hooks/useMobile';
import { useLocation, useNavigate } from 'zmp-ui';
import { menuConfig, MenuItem } from '../../configs/menu.config';
import { NotificationBell } from '../NotificationBell';

const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebar, isDarkMode, toggleDarkMode } = useThemeStore();
  const isMobile = useMobile();
  const location = useLocation();

  const navigate = useNavigate();

  // Generate dynamic breadcrumbs base on location
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(i => i);
    const breadcrumbs = [
      { title: <span className="cursor-pointer hover:text-blue-500" onClick={() => navigate('/dashboard')}>Home</span> }
    ];

    let currentPath = '';
    paths.forEach(pathSegment => {
      currentPath += `/${pathSegment}`;
      // Search in menu config
      const findTitle = (items: MenuItem[], path: string): string | undefined => {
        for (const item of items) {
          if (item?.path === path) return item.title;
          if (item && 'children' in item && item.children) {
            const childTitle = findTitle(item.children as MenuItem[], path);
            if (childTitle) return childTitle;
          }
        }
        return undefined;
      };
      
      const title = findTitle(menuConfig, currentPath);
      if (title) {
         const targetPath = currentPath;
         breadcrumbs.push({ title: <span className="cursor-pointer hover:text-blue-500" onClick={() => navigate(targetPath)}>{title}</span> });
      }
    });

    return breadcrumbs;
  };

  const userMenuItems = [
    { key: 'profile', label: 'My Profile' },
    { key: 'settings', label: 'Settings' },
    { type: 'divider' },
    { key: 'logout', label: 'Logout', onClick: logout },
  ];

  const notificationItems = [
    { key: '1', label: 'New user registered' },
    { key: '2', label: 'Server rebooted successfully' },
    { key: '3', label: 'Action required for tenant A' },
  ];

  return (
    <AntHeader 
      className={`flex items-end justify-between px-4 border-b transition-all duration-300 shadow-sm ${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'}`} 
      style={{ 
        padding: 0, 
        height: isMobile ? 104 : 64, 
        paddingTop: isMobile ? 44 : 0,
        lineHeight: '60px'
      }}
    >
      <div className="flex items-center h-full">
        <Button
          type="text"
          icon={isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          className={`text-lg w-16 h-full flex items-center justify-center rounded-none transition-colors ${isDarkMode ? 'text-white hover:bg-gray-800 focus:bg-gray-800' : 'text-gray-800 hover:bg-gray-100 focus:bg-gray-100'}`}
        />
        {!isMobile && (
          <div className="ml-4">
            <Breadcrumb items={generateBreadcrumbs()} />
          </div>
        )}
      </div>

      <div className="flex items-center pr-4 gap-4 h-full">
        <Switch
          className={isDarkMode ? 'bg-gray-700' : ''}
          checkedChildren={<BulbFilled />}
          unCheckedChildren={<BulbOutlined />}
          checked={isDarkMode}
          onChange={toggleDarkMode}
        />
        <NotificationBell />
        <Dropdown menu={{ items: userMenuItems as any }} placement="bottomRight" arrow>
          <div className={`flex items-center cursor-pointer gap-2 p-1.5 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
            <Avatar size={32} icon={<UserOutlined />} src={user?.avatar} className="border border-gray-100" />
            {!isMobile && <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user?.name || 'Admin User'}</span>}
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};
