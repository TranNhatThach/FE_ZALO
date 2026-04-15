import React from 'react';
import { useNavigate } from 'zmp-ui';
import { useAuthStore } from '../../stores/auth.store';

interface RoleGuardProps {
  allowedRoles: string[];
  fallbackPath?: string;
  children: React.ReactNode;
}

/**
 * Middleware phân quyền hiển thị (RoleGuard)
 * Dùng để bọc các Component/Page cần khóa theo Role.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  allowedRoles, 
  fallbackPath = '/tasks', 
  children 
}) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Nếu chưa có user (đang fetch) thì không render gì tránh nháy màn hình
  if (!user) return null;

  // Kiểm tra user có ít nhất một role nằm trong danh sách cho phép không
  const allRoles = [...(user.roles || []), user.roleName || ''].join(',').toUpperCase();
  const hasAccess = allowedRoles.some(ar => allRoles.includes(ar.toUpperCase()));

  if (!hasAccess) {
    console.error("Access denied in RoleGuard", { allowedRoles, userRole: user?.roleName });
    // Nếu không có quyền, ép đổi hướng về fallbackPath (mặc định là /tasks cho nhân viên)
    setTimeout(() => {
      navigate(fallbackPath, { replace: true, animate: false });
    }, 0);
    return null;
  }

  return <>{children}</>;
};
