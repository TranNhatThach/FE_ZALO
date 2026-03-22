import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../../services/api/auth.service';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  requiredRoles?: string[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles, children }) => {
  const { isAuthenticated, user, setUser } = useAuthStore();
  const location = useLocation();

  // Fetch user if authenticated but no user info exists (e.g. page refresh)
  const fetchUserQuery = useQuery({
    queryKey: ['me'],
    queryFn: authService.getMe,
    enabled: isAuthenticated && !user,
    retry: false,
  });

  useEffect(() => {
    if (fetchUserQuery.data && !user) {
      setUser(fetchUserQuery.data);
    }
  }, [fetchUserQuery.data, setUser, user]);

  if (!isAuthenticated) {
    // Save attempted route for post-login redirect
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
