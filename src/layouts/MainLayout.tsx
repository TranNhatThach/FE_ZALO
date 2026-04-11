import React, { Suspense } from 'react';
import { Layout, Skeleton } from 'antd';

// === BẠN CỦA USER: THAY ĐỔI COMPONENT SIDEBAR TẠI ĐÂY NẾU CẦN ===
import { Sidebar } from '../components/layout/Sidebar';
// ==========================================================

import { useThemeStore } from '../stores/theme.store';
import { ErrorBoundary } from '../components/error/ErrorBoundary';
import { useNavigate, useLocation } from 'zmp-ui';
import {
  HomeOutlined,
  ShoppingOutlined,
  TeamOutlined,
  ShopOutlined,
  EllipsisOutlined,
  EnvironmentOutlined,
  CheckSquareOutlined
} from '@ant-design/icons';

const { Content } = Layout;

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarCollapsed, setSidebarCollapsed, isDarkMode } = useThemeStore();

  const navItems = [
    { key: '/dashboard', label: 'HOME', icon: <HomeOutlined /> },
    { key: '/tasks', label: 'TASKS', icon: <CheckSquareOutlined /> },
    { key: '/goods', label: 'GOODS', icon: <ShoppingOutlined /> },
    { key: '/suppliers', label: 'SUPPLIERS', icon: <ShopOutlined /> },
    { key: 'more', label: 'MORE', icon: <EllipsisOutlined />, action: 'toggle-sidebar' },
  ];

  return (
    <Layout className={`min-h-[100dvh] w-full transition-colors duration-300 relative ${isDarkMode ? 'bg-[#121212]' : 'bg-[#fcfdff]'}`}>

      <Sidebar />

      <Layout
        style={{
          marginLeft: 0,
          transition: 'all 0.3s'
        }}
        className={`w-full flex flex-col ${isDarkMode ? 'bg-[#121212]' : 'bg-[#fcfdff]'}`}
      >
        {/* Content Wrapper using safe-area-insent to avoid notch overlap */}
        <Content
          className="flex-1 w-full m-0 p-0 relative"
          style={{ 
            paddingTop: 'env(safe-area-inset-top, 0px)',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 64px)'
          }}
        >
          <ErrorBoundary>
            <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} className="p-4" />}>
              {children}
            </Suspense>
          </ErrorBoundary>
        </Content>

        {/* Premium Mobile Bottom Navigation (Glassmorphism) */}
        <div 
          className={`fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 z-[1000] border-t transition-all duration-300 ${
            isDarkMode 
              ? 'bg-[#1a1a1c]/80 backdrop-blur-xl border-gray-800 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]' 
              : 'bg-white/90 backdrop-blur-xl border-white/[0.2] shadow-[0_-8px_30px_rgba(0,0,0,0.04)]'
          }`}
          style={{ 
            height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)' 
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.key) && item.key !== 'more';
            return (
              <button
                key={item.key}
                onClick={() => {
                  if (item.action === 'toggle-sidebar') {
                     setSidebarCollapsed(!isSidebarCollapsed);
                  } else {
                     navigate(item.key);
                  }
                }}
                className="flex flex-col items-center justify-center w-full h-[64px] border-none outline-none bg-transparent group active:scale-[0.92] transition-transform select-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div className={`transition-all duration-300 flex items-center justify-center ${
                  isActive ? (isDarkMode ? 'text-[#60a5fa] drop-shadow-md' : 'text-[#2563eb] drop-shadow-sm') : 'text-[#a1a1aa]'
                }`}>
                  {React.cloneElement(item.icon as React.ReactElement, {
                    style: { fontSize: isActive ? '24px' : '22px' }
                  })}
                </div>
                <span className={`text-[9px] font-black tracking-widest mt-1 uppercase ${
                  isActive ? (isDarkMode ? 'text-[#60a5fa]' : 'text-[#2563eb]') : 'text-[#a1a1aa]'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 w-8 h-[3px] bg-gradient-to-r from-blue-400 to-indigo-500 rounded-b-md opacity-80" />
                )}
              </button>
            );
          })}
        </div>
      </Layout>
    </Layout>
  );
};
