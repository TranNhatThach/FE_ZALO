import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
import { useAuthStore } from './stores/auth.store';
import { useTenantResolver } from './hooks/useTenantResolver';
import { useThemeStore } from './stores/theme.store';
import { router } from './routes';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { tenantConfig, isLoading } = useTenantResolver();
  const { restoreSession } = useAuthStore();
  const { primaryColor, isDarkMode, setPrimaryColor } = useThemeStore();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    // If tenant config provides a primary color and user hasn't overridden it, we can set it
    if (tenantConfig?.primaryColor) {
      setPrimaryColor(tenantConfig.primaryColor);
    }
  }, [tenantConfig, setPrimaryColor]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: primaryColor,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
