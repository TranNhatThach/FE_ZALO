import React, { useEffect, lazy, Suspense } from 'react';
import { getSystemInfo } from 'zmp-sdk';
import { AnimationRoutes, App, Route, ZMPRouter, Page } from 'zmp-ui';
import { AppProps } from 'zmp-ui/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme, Spin, Skeleton } from 'antd';

// Layouts & Auth
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute } from './auth/ProtectedRoute';
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
                    <AnimationRoutes>
                        {/* Public Routes */}
                        <Route path="/" element={<Page className="page"><LoginPage /></Page>}></Route>
                        <Route path="/login" element={<Page className="page"><LoginPage /></Page>}></Route>
                        <Route path="/error" element={<HomePage />}></Route>

                        {/* Protected Routes Wrapper */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Page className="page"><Dashboard /></Page>
                                </MainLayout>
                            </ProtectedRoute>
                        }></Route>

                        <Route path="/users" element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Suspense fallback={<Page className="page"><Skeleton active /></Page>}>
                                        <Page className="page"><UsersPage /></Page>
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }></Route>

                        {/* Inventory/Goods Page */}
                        <Route path="/goods" element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Suspense fallback={<Page className="page"><Skeleton active /></Page>}>
                                        <Page className="page"><GoodsPage /></Page>
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }></Route>

                        {/* Suppliers Page */}
                        <Route path="/suppliers" element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Suspense fallback={<Page className="page"><Skeleton active /></Page>}>
                                        <Page className="page"><SuppliersPage /></Page>
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }></Route>

                        {/* Tasks Page */}
                        <Route path="/tasks" element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Suspense fallback={<Page className="page"><Skeleton active /></Page>}>
                                        <Page className="page"><TasksPage /></Page>
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }></Route>

                        <Route path="/branches" element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Suspense fallback={<Page className="page"><Skeleton active /></Page>}>
                                        <Page className="page"><BranchesPage /></Page>
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }></Route>

                        <Route path="/settings" element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Suspense fallback={<Page className="page"><Skeleton active /></Page>}>
                                        <Page className="page"><SettingsPage /></Page>
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }></Route>
                    </AnimationRoutes>
                </ZMPRouter>
            </App>
        </ConfigProvider>
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
