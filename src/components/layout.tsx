import React, { useEffect, lazy, Suspense } from 'react';
import { getSystemInfo } from 'zmp-sdk';
import { AnimationRoutes, App, Route, ZMPRouter, Page } from 'zmp-ui';
import { AppProps } from 'zmp-ui/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme, Spin, Skeleton } from 'antd';

// Layouts & Auth
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { RoleGuard } from './auth/RoleGuard';
import { useAuthStore } from '../stores/auth.store';
import { useTenantResolver } from '../hooks/useTenantResolver';
import { useThemeStore } from '../stores/theme.store';

// Pages
import HomePage from '@/pages/index';
import LoginPage from '@/pages/auth/Login';
import RegisterPage from '@/pages/auth/Register';
import Dashboard from '@/pages/Dashboard';

// Lazy load feature pages
const UsersPage = lazy(() => import('@/pages/users/UsersPage'));
const GoodsPage = lazy(() => import('@/pages/goods/GoodsPage'));
const SuppliersPage = lazy(() => import('@/pages/suppliers/SuppliersPage'));
const TasksPage = lazy(() => import('@/pages/tasks/TasksPage'));
const BranchesPage = lazy(() => import('@/pages/branches/BranchesPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));

const queryClient = new QueryClient();

const AppContent = () => {
    const { tenantConfig, isLoading: isTenantLoading } = useTenantResolver();
    const { restoreSession } = useAuthStore();
    const { primaryColor, isDarkMode, setPrimaryColor } = useThemeStore();

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    useEffect(() => {
        if (tenantConfig?.primaryColor) {
            setPrimaryColor(tenantConfig.primaryColor);
        }
    }, [tenantConfig, setPrimaryColor]);

    if (isTenantLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
                <Spin size="large" tip="Loading configuration..." />
            </div>
        );
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: primaryColor,
                },
            }}
        >
            <App theme={getSystemInfo().zaloTheme as AppProps['theme']}>
                <ZMPRouter>
                    <RouterContent />
                </ZMPRouter>
            </App>
        </ConfigProvider>
    );
};

import { useLocation } from 'zmp-ui';

const RouterContent = () => {
    const location = useLocation();
    const isAuthPage = ['/', '/login', '/register', '/error'].includes(location.pathname);

    if (isAuthPage) {
        return (
            <AnimationRoutes>
                <Route path="/" element={<Page className="page"><LoginPage /></Page>}></Route>
                <Route path="/login" element={<Page className="page"><LoginPage /></Page>}></Route>
                <Route path="/register" element={<Page className="page"><RegisterPage /></Page>}></Route>
                <Route path="/error" element={<HomePage />}></Route>
            </AnimationRoutes>
        );
    }

    return (
        <ProtectedRoute>
            <MainLayout>
                <AnimationRoutes>
                    {/* KHU VỰC DÀNH CHO ADMIN */}
                    <Route path="/dashboard" element={
                        <RoleGuard allowedRoles={['TENANT_ADMIN', 'SUPER_ADMIN']} fallbackPath="/tasks">
                            <Page className="page"><Dashboard /></Page>
                        </RoleGuard>
                    }></Route>
                    <Route path="/users" element={
                        <RoleGuard allowedRoles={['TENANT_ADMIN', 'SUPER_ADMIN']} fallbackPath="/tasks">
                            <Suspense fallback={<Page className="page"><Skeleton active /></Page>}>
                                <Page className="page"><UsersPage /></Page>
                            </Suspense>
                        </RoleGuard>
                    }></Route>

                    {/* KHU VỰC DÀNH CHO NHÂN VIÊN/KHÁCH HÀNG */}
                    <Route path="/goods" element={
                        <Suspense fallback={<Page className="page"><Skeleton active /></Page>}>
                            <Page className="page"><GoodsPage /></Page>
                        </Suspense>
                    }></Route>
                    <Route path="/suppliers" element={
                        <Suspense fallback={<Page className="page"><Skeleton active /></Page>}>
                            <Page className="page"><SuppliersPage /></Page>
                        </Suspense>
                    }></Route>
                    <Route path="/tasks" element={
                        <Suspense fallback={<Page className="page"><Skeleton active /></Page>}>
                            <Page className="page"><TasksPage /></Page>
                        </Suspense>
                    }></Route>
                    <Route path="/branches" element={
                        <Suspense fallback={<Page className="page"><Skeleton active /></Page>}>
                            <Page className="page"><BranchesPage /></Page>
                        </Suspense>
                    }></Route>
                    <Route path="/settings" element={
                        <Suspense fallback={<Page className="page"><Skeleton active /></Page>}>
                            <Page className="page"><SettingsPage /></Page>
                        </Suspense>
                    }></Route>
                </AnimationRoutes>
            </MainLayout>
        </ProtectedRoute>
    );
};


const Layout = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AppContent />
        </QueryClientProvider>
    );
};

export default Layout;
