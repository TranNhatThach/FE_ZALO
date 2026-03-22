import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, Layout, Typography, Button } from 'antd';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuthStore } from './stores/auth.store';
import { useTenantResolver } from './hooks/useTenantResolver';

const { Header, Content } = Layout;
const { Title } = Typography;

// Initialize Query Client
const queryClient = new QueryClient();

// A simple Dashboard component for demonstration
const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { tenantConfig } = useTenantResolver();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: tenantConfig?.primaryColor || '#1890ff', padding: '0 24px' }}>
        <Title level={4} style={{ color: '#fff', margin: 0 }}>
          {tenantConfig?.brandName || 'SaaS Dashboard'}
        </Title>
        <Button onClick={logout}>Logout</Button>
      </Header>
      <Content style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
        <Title level={2}>Welcome, {user?.name || user?.email}!</Title>
        <p>This is a protected route. Only authenticated users can see this.</p>
        <p>Your roles: {user?.roles?.join(', ')}</p>
      </Content>
    </Layout>
  );
};

// Main App Router wrapped with Tenant Theme Provider
const AppRouter: React.FC = () => {
  const { tenantConfig, isLoading } = useTenantResolver();
  const { restoreSession } = useAuthStore();

  useEffect(() => {
    // Restore session tokens on app initialization
    restoreSession();
  }, [restoreSession]);

  if (isLoading) return null; // Global splash screen could go here

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: tenantConfig?.primaryColor || '#1890ff',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Role-based Route Example */}
          <Route element={<ProtectedRoute requiredRoles={['ADMIN']} />}>
            <Route path="/admin" element={<div>Admin Only Area</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

// Root Component
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}
