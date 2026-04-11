import { getSystemInfo } from 'zmp-sdk';
import { AnimationRoutes, App, Route, ZMPRouter, Page } from 'zmp-ui';
import { AppProps } from 'zmp-ui/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import HomePage from '@/pages/index';
import LoginPage from '@/pages/auth/Login';
import RegisterPage from '@/pages/auth/Register';
import Dashboard from '@/pages/Dashboard';
import SuppliersPage from '@/pages/suppliers/SuppliersPage';
import UsersPage from '@/pages/users/UsersPage';
import GoodsPage from '@/pages/goods/GoodsPage';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { useThemeStore } from '@/stores/theme.store';
import { MenuOutlined } from '@ant-design/icons';

const queryClient = new QueryClient();

/** Wrapper layout chung cho các trang có thanh điều hướng */
const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { setSidebarCollapsed, isSidebarCollapsed } = useThemeStore();

    return (
        <div className="flex flex-col h-full relative overflow-x-hidden">
            {/* Header bar with hamburger menu */}
            <div className="flex items-center h-[48px] px-3 bg-white border-b border-gray-100 shrink-0">
                <button
                    onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-transparent border-none cursor-pointer text-gray-600 active:bg-gray-100 transition-colors"
                    style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                >
                    <MenuOutlined style={{ fontSize: 20 }} />
                </button>
                <span className="ml-2 text-[16px] font-semibold text-gray-800">Menu</span>
            </div>

            <Sidebar />
            <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ paddingBottom: 56 }}>
                {children}
            </div>
            <BottomNav />
        </div>
    );
};

import React from 'react';

const Layout = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <App theme={getSystemInfo().zaloTheme as AppProps['theme']}>
                <ZMPRouter>
                    <AnimationRoutes>
                        {/* Trang mặc định */}
                        <Route path="/" element={
                            <Page className="page">
                                <AppShell><Dashboard /></AppShell>
                            </Page>
                        }></Route>

                        {/* Auth pages - không có navigation */}
                        <Route path="/login" element={<Page className="page"><LoginPage /></Page>}></Route>
                        <Route path="/register" element={<Page className="page"><RegisterPage /></Page>}></Route>

                        {/* Dashboard */}
                        <Route path="/dashboard" element={
                            <Page className="page">
                                <AppShell><Dashboard /></AppShell>
                            </Page>
                        }></Route>

                        {/* Suppliers Page - Trực tiếp nhúng Navigation thay vì AppShell (vì Suppliers có Header riêng) */}
                        <Route path="/suppliers" element={
                            <Page className="page">
                                <div className="flex flex-col h-full relative overflow-x-hidden">
                                    <Sidebar />
                                    <SuppliersPage />
                                    <BottomNav />
                                </div>
                            </Page>
                        }></Route>

                        {/* Members Page (Quản lý User) */}
                        <Route path="/members" element={
                            <Page className="page">
                                <div className="flex flex-col h-full relative overflow-x-hidden">
                                    <Sidebar />
                                    <UsersPage />
                                    <BottomNav />
                                </div>
                            </Page>
                        }></Route>

                        {/* Inventory/Goods Page */}
                        <Route path="/goods" element={
                            <Page className="page">
                                <div className="flex flex-col h-full relative overflow-x-hidden">
                                    <Sidebar />
                                    <GoodsPage />
                                    <BottomNav />
                                </div>
                            </Page>
                        }></Route>

                        {/* Trang Error Test */}
                        <Route path="/error" element={<HomePage />}></Route>
                    </AnimationRoutes>
                </ZMPRouter>
            </App>
        </QueryClientProvider>
    );
};
export default Layout;
