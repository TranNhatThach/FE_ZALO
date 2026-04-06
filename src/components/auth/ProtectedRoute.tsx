import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useGetMe } from '../../hooks/useAuth';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  requiredRoles?: string[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles, children }) => {
  const { isAuthenticated, user, setUser } = useAuthStore();
  const location = useLocation();

  
  const fetchUserQuery = useGetMe({
    enabled: isAuthenticated && !user,
  });

  useEffect(() => {
    if (fetchUserQuery.data && !user) {
      setUser(fetchUserQuery.data);
    }
  }, [fetchUserQuery.data, setUser, user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (fetchUserQuery.isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" tip="Restoring session..." />
      </div>
    );
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = user?.roles?.some((role: string) => requiredRoles.includes(role));
    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children ? children : <Outlet />}</>;
};
