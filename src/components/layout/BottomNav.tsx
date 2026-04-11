import React, { useEffect, useState } from 'react';
import { useNavigate } from 'zmp-ui';
import {
  HomeFilled,
  HomeOutlined,
  FileTextFilled,
  FileTextOutlined,
  TeamOutlined,
  ShoppingOutlined,
  ShoppingFilled,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useThemeStore } from '../../stores/theme.store';

interface NavItem {
  key: string;
  label: string;
  iconActive: React.ReactNode;
  iconInactive: React.ReactNode;
  path?: string;
  action?: 'toggle-sidebar';
}

const navItems: NavItem[] = [
  {
    key: 'home',
    label: 'Trang chủ',
    iconActive: <HomeFilled />,
    iconInactive: <HomeOutlined />,
    path: '/dashboard',
  },
  {
    key: 'members',
    label: 'Nhân viên',
    iconActive: <TeamOutlined />,
    iconInactive: <TeamOutlined />,
    path: '/members',
  },
  {
    key: 'suppliers',
    label: 'Nhà Cung Cấp',
    iconActive: <TeamOutlined />,
    iconInactive: <TeamOutlined />,
    path: '/suppliers',
  },
  {
    key: 'goods',
    label: 'Hàng hoá',
    iconActive: <ShoppingFilled />, 
    iconInactive: <ShoppingOutlined />,
    path: '/goods',
  },
  {
    key: 'more',
    label: 'Thêm',
    iconActive: <AppstoreOutlined />,
    iconInactive: <AppstoreOutlined />,
    action: 'toggle-sidebar',
  },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const { setSidebarCollapsed, isSidebarCollapsed } = useThemeStore();

  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname;
      if (path !== currentPath) setCurrentPath(path);
    };
    const interval = setInterval(checkPath, 200);
    return () => clearInterval(interval);
  }, [currentPath]);

  const handleClick = (item: NavItem) => {
    if (item.action === 'toggle-sidebar') {
      setSidebarCollapsed(!isSidebarCollapsed);
    } else if (item.path) {
      navigate(item.path);
      setCurrentPath(item.path);
    }
  };

  const isActive = (item: NavItem) => {
    if (item.path) {
      return currentPath === item.path || currentPath.startsWith(item.path + '/');
    }
    return false;
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] flex items-stretch bg-white"
      style={{
        height: 60,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        borderTop: '1px solid #f0f0f0',
        boxShadow: '0 -1px 12px rgba(0,0,0,0.06)',
      }}
    >
      {navItems.map((item) => {
        const active = isActive(item);
        return (
          <button
            key={item.key}
            onClick={() => handleClick(item)}
            className="flex flex-col items-center justify-center flex-1 border-none bg-transparent cursor-pointer relative"
            style={{
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              padding: '6px 0 4px',
            }}
          >
            {/* Active top indicator dot */}
            {active && (
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2.5px] rounded-b-full bg-[#006af5]"
              />
            )}

            <span
              className="flex items-center justify-center transition-transform duration-150"
              style={{
                fontSize: 22,
                color: active ? '#006af5' : '#8c8c8c',
                transform: active ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {active ? item.iconActive : item.iconInactive}
            </span>

            <span
              className="mt-0.5 leading-tight"
              style={{
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                color: active ? '#006af5' : '#8c8c8c',
                letterSpacing: 0.2,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
