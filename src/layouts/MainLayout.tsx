import React, { Suspense } from 'react';
import { Layout, Skeleton } from 'antd';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { BottomNav } from '../components/layout/BottomNav';
import { Header } from '../components/layout/Header';
import { useMobile } from '../hooks/useMobile';
import { useThemeStore } from '../stores/theme.store';
import { ErrorBoundary } from '../components/error/ErrorBoundary';

const { Content } = Layout;

export const MainLayout: React.FC = () => {
  const isMobile = useMobile();
  const { isSidebarCollapsed, isDarkMode } = useThemeStore();
  
  const getMarginLeft = () => {
    if (isMobile) return 0;
    return isSidebarCollapsed ? 80 : 250;
  };

  return (
    <Layout className="min-h-screen transition-colors duration-300">
      <Sidebar />
      <Layout 
        style={{ 
          marginLeft: getMarginLeft(),
          transition: 'all 0.3s',
          paddingBottom: isMobile ? 56 : 0,
        }}
        className={isDarkMode ? 'bg-[#000000]' : 'bg-gray-50'}
      >
        <Header />
        <Content
          className={`m-4 md:m-6 p-4 md:p-6 rounded-lg shadow-sm overflow-auto min-h-[280px] transition-colors duration-300 ${
            isDarkMode ? 'bg-[#1f1f1f]' : 'bg-white'
          }`}
        >
          <ErrorBoundary>
            <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </Content>
      </Layout>
      <BottomNav />
    </Layout>
  );
};
