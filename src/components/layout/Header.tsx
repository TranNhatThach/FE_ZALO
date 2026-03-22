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
import { useLocation, Link } from 'react-router-dom';
import { menuConfig, MenuItem } from '../../configs/menu.config';

const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebar, isDarkMode, toggleDarkMode } = useThemeStore();
  const isMobile = useMobile();
  const location = useLocation();

  // Generate dynamic breadcrumbs base on location
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(i => i);
    const breadcrumbs = [
      { title: <Link to="/dashboard">Home</Link> }
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
         breadcrumbs.push({ title: <Link to={currentPath}>{title}</Link> });
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
    <AntHeader className={`flex items-center justify-between px-4 border-b transition-colors duration-300 shadow-sm ${isDarkMode ? 'bg-[#141414] border-gray-800' : 'bg-white border-gray-200'}`} style={{ padding: 0 }}>
      <div className="flex items-center">
        <Button
          type="text"
          icon={isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          className={`text-lg w-16 h-16 rounded-none ${isDarkMode ? 'text-white hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'}`}
        />
        {!isMobile && (
          <div className="ml-4">
            <Breadcrumb items={generateBreadcrumbs()} />
          </div>
        )}
      </div>

      <div className="flex items-center pr-6 gap-5">
        <Switch
          checkedChildren={<BulbFilled />}
          unCheckedChildren={<BulbOutlined />}
          checked={isDarkMode}
          onChange={toggleDarkMode}
        />
        <Dropdown menu={{ items: notificationItems }} placement="bottomRight" arrow>
          <Badge count={3} size="small" className="cursor-pointer">
            <BellOutlined className={`text-xl transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-500'}`} />
          </Badge>
        </Dropdown>
        <Dropdown menu={{ items: userMenuItems as any }} placement="bottomRight" arrow>
          <div className={`flex items-center cursor-pointer gap-2 p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
            <Avatar icon={<UserOutlined />} src={user?.avatar} />
            {!isMobile && <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user?.name || 'Admin User'}</span>}
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};
