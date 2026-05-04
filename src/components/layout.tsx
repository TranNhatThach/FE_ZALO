import React, { useEffect, useState, lazy, Suspense } from 'react';
import { getSystemInfo } from 'zmp-sdk';
import { AnimationRoutes, App, Route, ZMPRouter, Page } from 'zmp-ui';
import { AppProps } from 'zmp-ui/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme, Spin, Skeleton } from 'antd';

// Layouts & Auth
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useAuthStore } from '@/stores/auth.store';
import { useTenantResolver } from '@/hooks/useTenantResolver';
import { useThemeStore } from '@/stores/theme.store';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

// Pages
import HomePage from '@/pages/index';
import LoginPage from '@/pages/auth/Login';
import RegisterPage from '@/pages/auth/Register';
import ForgotPasswordPage from '@/pages/auth/ForgotPassword';
import ResetPasswordPage from '@/pages/auth/ResetPassword';
import Dashboard from '@/pages/Dashboard';

// Lazy load feature pages
const UsersPage = lazy(() => import('@/pages/users/UsersPage'));
const GoodsPage = lazy(() => import('@/pages/goods/GoodsPage'));
const SuppliersPage = lazy(() => import('@/pages/suppliers/SuppliersPage'));
const TasksPage = lazy(() => import('@/pages/tasks/TasksPage'));
const BranchesPage = lazy(() => import('@/pages/branches/BranchesPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const CheckInPage = lazy(() => import('@/pages/checkin/CheckInPage'));
const RegisterFacePage = lazy(() => import('@/pages/checkin/RegisterFacePage'));
const AttendanceHistoryPage = lazy(() => import('@/pages/checkin/AttendanceHistoryPage'));
const UserHomePage = lazy(() => import('@/pages/Home/UserHomePage'));
const UserAttendanceAdminPage = lazy(() => import('@/pages/users/UserAttendanceAdminPage'));
const AdminAiAgentPage = lazy(() => import('@/pages/ai/AdminAiAgentPage'));
const TaxInvoicesPage = lazy(() => import('@/pages/finance/TaxInvoicesPage'));
const SupportPage = lazy(() => import('@/pages/support/SupportPage'));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60, // 1 minute
            gcTime: 1000 * 60 * 5, // 5 minutes
        },
    },
});

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
        return <LoadingScreen />;
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
                <NotificationToastContainer />
            </App>
        </ConfigProvider>
    );
};

import { useLocation, useNavigate } from 'zmp-ui';
import { useNotificationSocket } from '../hooks/useNotificationSocket';
import { NotificationToastContainer } from '@/components/NotificationToast';

const RouterContent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    // Khởi tạo kết nối WebSocket lắng nghe thông báo
    useNotificationSocket();

    const isAuthPage = ['/', '/login', '/register', '/error', '/forgot-password', '/reset-password'].includes(location.pathname);

    // Điều hướng gốc dựa trên Role
    useEffect(() => {
        if (isAuthenticated && user) {
            const allRoles = [...(user.roles || []), user.roleName || ''].join(',').toUpperCase();
            const isAdmin = allRoles.includes('ADMIN');

            // Nếu đang ở trang Auth khi đã Login -> Đẩy về Dashboard/UserHome
            if (isAuthPage) {
                if (isAdmin) {
                    navigate('/dashboard', { replace: true, animate: false });
                } else {
                    navigate('/user-home', { replace: true, animate: false });
                }
            }
        }
    }, [isAuthenticated, location.pathname, user, navigate, isAuthPage]);

    if (!isAuthenticated && isAuthPage) {
        return (
            <AnimationRoutes>
                <Route path="/" element={<LoginPage />}></Route>
                <Route path="/login" element={<LoginPage />}></Route>
                <Route path="/register" element={<RegisterPage />}></Route>
                <Route path="/forgot-password" element={<ForgotPasswordPage />}></Route>
                <Route path="/reset-password" element={<ResetPasswordPage />}></Route>
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
                        <RoleGuard allowedRoles={['ADMIN']} fallbackPath="/tasks">
                            <Dashboard />
                        </RoleGuard>
                    }></Route>
                    <Route path="/users" element={
                        <RoleGuard allowedRoles={['ADMIN']} fallbackPath="/tasks">
                            <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} className="p-4" />}>
                                <UsersPage />
                            </Suspense>
                        </RoleGuard>
                    }></Route>
                    <Route path="/attendance-admin" element={
                        <RoleGuard allowedRoles={['ADMIN']} fallbackPath="/tasks">
                            <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} className="p-4" />}>
                                <UserAttendanceAdminPage />
                            </Suspense>
                        </RoleGuard>
                    }></Route>
                    <Route path="/ai-agent" element={
                        <RoleGuard allowedRoles={['ADMIN']} fallbackPath="/tasks">
                            <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} className="p-4" />}>
                                <AdminAiAgentPage />
                            </Suspense>
                        </RoleGuard>
                    }></Route>

                    {/* KHU VỰC DÀNH CHO NHÂN VIÊN/KHÁCH HÀNG */}
                    <Route path="/goods" element={
                        <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} className="p-4" />}>
                            <GoodsPage />
                        </Suspense>
                    }></Route>
                    <Route path="/suppliers" element={
                        <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} className="p-4" />}>
                            <SuppliersPage />
                        </Suspense>
                    }></Route>
                    <Route path="/user-home" element={
                        <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} className="p-4" />}>
                            <UserHomePage />
                        </Suspense>
                    }></Route>
                    <Route path="/tasks" element={
                        <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} className="p-4" />}>
                            <TasksPage />
                        </Suspense>
                    }></Route>
                    <Route path="/branches" element={
                        <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} className="p-4" />}>
                            <BranchesPage />
                        </Suspense>
                    }></Route>
                    <Route path="/checkin" element={
                        <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} className="p-4" />}>
                            <CheckInPage />
                        </Suspense>
                    }></Route>
                    <Route path="/register-face" element={
                        <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} className="p-4" />}>
                            <RegisterFacePage />
                        </Suspense>
                    }></Route>
                    <Route path="/attendance-history" element={
                        <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} className="p-4" />}>
                            <AttendanceHistoryPage />
                        </Suspense>
                    }></Route>
                    <Route path="/settings" element={
                        <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} className="p-4" />}>
                            <SettingsPage />
                        </Suspense>
                    }></Route>
                    <Route path="/finance" element={
                        <RoleGuard allowedRoles={['ADMIN', 'FINANCE', 'MANAGE']} fallbackPath="/user-home">
                            <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} className="p-4" />}>
                                <TaxInvoicesPage />
                            </Suspense>
                        </RoleGuard>
                    }></Route>
                    <Route path="/support" element={
                        <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} className="p-4" />}>
                            <SupportPage />
                        </Suspense>
                    }></Route>
                    <Route path="/" element={
                        <RoleGuard allowedRoles={['ADMIN', 'STAFF', 'USER']} fallbackPath="/login">
                            <Suspense fallback={<Skeleton active />}>
                                {user?.roleName === 'ADMIN' ? <Dashboard /> : <UserHomePage />}
                            </Suspense>
                        </RoleGuard>
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
