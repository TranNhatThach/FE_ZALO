import React from 'react';
import {
  DashboardOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  ContactsOutlined,
  ShopOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  AuditOutlined,
  CustomerServiceOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

export type MenuItem = Required<MenuProps>['items'][number] & {
  title?: string;
  path?: string;
  children?: MenuItem[];
};

export const menuConfig: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Trang chủ',
    title: 'Trang chủ',
    path: '/dashboard',
  },
  {
    key: 'members',
    icon: <TeamOutlined />,
    label: 'Nhân viên',
    title: 'Nhân viên',
    path: '/members',
  },
  {
    key: 'tasks',
    icon: <CheckSquareOutlined />,
    label: 'Công việc',
    title: 'Công việc',
    path: '/tasks',
  },
  {
    key: 'goods',
    icon: <ShoppingOutlined />,
    label: 'Hàng hoá',
    title: 'Hàng hoá',
    path: '/goods',
  },
  {
    key: 'suppliers',
    icon: <ShopOutlined />,
    label: 'Nhà cung cấp',
    title: 'Nhà cung cấp',
    path: '/suppliers',
  },
  {
    key: 'invoices',
    icon: <FileTextOutlined />,
    label: 'Hoá đơn',
    title: 'Hoá đơn',
    path: '/invoices',
  },
  {
    key: 'contracts',
    icon: <AuditOutlined />,
    label: 'Hợp đồng',
    title: 'Hợp đồng',
    path: '/contracts',
  },
  {
    key: 'posts',
    icon: <ReadOutlined />,
    label: 'Bài viết',
    title: 'Bài viết',
    path: '/posts',
  },
];

// Bottom navigation items for mobile
export interface BottomNavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  action?: 'toggle-sidebar';
}

export const bottomNavConfig: BottomNavItem[] = [
  {
    key: 'home',
    label: 'HOME',
    icon: <DashboardOutlined />,
    path: '/dashboard',
  },
  {
    key: 'invoices',
    label: 'INVOICES',
    icon: <FileTextOutlined />,
    path: '/invoices',
  },
  {
    key: 'more',
    label: 'MORE',
    icon: <DashboardOutlined />, // Will use EllipsisOutlined in component
    action: 'toggle-sidebar',
  },
];
