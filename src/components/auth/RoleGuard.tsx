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
  const userRolesRaw = [...(user.roles || []), user.roleName || ''];
  const allRolesUpper = userRolesRaw.map(r => r.toUpperCase());

  const hasAccess = allowedRoles.some(ar => {
    const required = ar.toUpperCase();
    return allRolesUpper.includes(required) || (required === 'ADMIN' && allRolesUpper.includes('SUPER_ADMIN'));
  });

  if (!hasAccess) {
    console.warn("Access denied in RoleGuard. Redirecting to fallback...", {
      allowedRoles,
      userRoleName: user?.roleName,
      userRoles: user?.roles,
      allRolesUpper
    });
    // Nếu không có quyền, ép đổi hướng về fallbackPath (mặc định là /tasks cho nhân viên)
    setTimeout(() => {
      navigate(fallbackPath, { replace: true, animate: false });
    }, 0);
    return null;
  }

  return <>{children}</>;
};
