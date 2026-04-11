import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'zmp-ui';
import { useAuthStore } from '../../stores/auth.store';
import { useGetMe } from '../../hooks/useAuth';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  requiredRoles?: string[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles, children }) => {
  const { isAuthenticated, user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserQuery = useGetMe({
    enabled: isAuthenticated && !user,
  });

  useEffect(() => {
    if (fetchUserQuery.data && !user) {
      setUser(fetchUserQuery.data);
    }
  }, [fetchUserQuery.data, setUser, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  if (!isAuthenticated) {
    return null; // Navigation is handled in useEffect
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
      navigate('/unauthorized', { replace: true });
      return null;
    }
  }

  return <>{children}</>;
};
