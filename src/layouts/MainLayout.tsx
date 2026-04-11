import React, { Suspense } from 'react';
import { Layout, Skeleton } from 'antd';

// === BẠN CỦA USER: THAY ĐỔI COMPONENT SIDEBAR TẠI ĐÂY NẾU CẦN ===
import { Sidebar } from '../components/layout/Sidebar';
// ==========================================================

import { Header } from '../components/layout/Header';
import { useMobile } from '../hooks/useMobile';
import { useThemeStore } from '../stores/theme.store';
import { ErrorBoundary } from '../components/error/ErrorBoundary';
import { useNavigate, useLocation } from 'zmp-ui';
import { 
  AppstoreOutlined, 
  BarChartOutlined, 
  CheckSquareOutlined, 
  SettingOutlined 
} from '@ant-design/icons';

const { Content } = Layout;

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarCollapsed, isDarkMode } = useThemeStore();
  
  // padding adjustments based on Sidebar visibility
  const getMarginLeft = () => {
    if (isMobile) return 0;
    return isSidebarCollapsed ? 80 : 250;
  };

  const navItems = [
    { key: '/dashboard', label: 'DASHBOARD', icon: <AppstoreOutlined /> },
    { key: '/activity', label: 'ACTIVITY', icon: <BarChartOutlined /> },
    { key: '/tasks', label: 'TASKS', icon: <CheckSquareOutlined /> },
    { key: '/settings', label: 'SETTINGS', icon: <SettingOutlined /> },
  ];

  return (
    <Layout className={`min-h-screen transition-colors duration-300 relative ${isDarkMode ? 'bg-black' : 'bg-[#fbfcff]'}`}>
      
      {/* =========================================================================
          BẠN CỦA USER: THAY THẾ HOẶC CHỈNH SỬA THANH CÔNG CỤ BÊN TRÁI (SIDEBAR) TẠI ĐÂY 
          ========================================================================= */}
      <Sidebar />
      {/* ========================================================================= */}

      <Layout 
        style={{ 
          marginLeft: getMarginLeft(),
          transition: 'all 0.3s'
        }}
        className={isDarkMode ? 'bg-black' : 'bg-[#fbfcff]'}
      >
        <Header />
        <Content 
          className={`
            transition-colors duration-300 
            ${isMobile 
              ? 'm-0 p-0 mb-20 bg-transparent overflow-hidden' 
              : `m-4 md:m-6 p-4 md:p-6 rounded-lg shadow-sm min-h-[280px] ${isDarkMode ? 'bg-[#121212]' : 'bg-white'}`
            }
          `}
        >
          <ErrorBoundary>
            <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} />}>
              {children}
            </Suspense>
          </ErrorBoundary>
        </Content>

        {/* Bottom Navigation for Mobile */}
        {isMobile && (
          <div className={`fixed bottom-0 left-0 right-0 h-[76px] flex items-center justify-around px-4 z-50 border-t transition-all duration-300 ${isDarkMode ? 'bg-black/90 backdrop-blur-md border-gray-800 shadow-none' : 'bg-white/80 backdrop-blur-xl border-gray-100 shadow-[0_-4px_20px_0_rgba(0,0,0,0.03)]'}`}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  className={`flex flex-col items-center justify-center space-y-1 group transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-40 hover:opacity-100'}`}
                >
                  <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? (isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-600 shadow-sm') : 'text-gray-500'}`}>
                    {React.cloneElement(item.icon as React.ReactElement, { 
                      style: { fontSize: isActive ? '20px' : '18px' } 
                    })}
                  </div>
                  <span className={`text-[9px] font-black tracking-widest ${isActive ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </Layout>
    </Layout>
  );
};
