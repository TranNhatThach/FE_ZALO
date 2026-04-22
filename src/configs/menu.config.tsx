import React from 'react';
import {
  AppstoreOutlined,
  ShoppingOutlined,
  UsergroupAddOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  RobotOutlined,
  CalculatorOutlined,
  HomeOutlined,
  CameraOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

export type MenuItem = Required<MenuProps>['items'][number] & {
  title?: string;
  path?: string;
  children?: MenuItem[];
};

export const menuConfig: MenuItem[] = [
  {
    key: '/user-home',
    icon: <HomeOutlined />,
    label: 'Trang chủ (Staff)',
    title: 'Trang chủ',
    path: '/user-home',
  },
  {
    key: '/checkin',
    icon: <CameraOutlined />,
    label: 'Chấm công',
    title: 'Chấm công',
    path: '/checkin',
  },
  {
    key: '/attendance-history',
    icon: <HistoryOutlined />,
    label: 'Lịch sử chấm công',
    title: 'Lịch sử chấm công',
    path: '/attendance-history',
  },
  {
    key: '/dashboard',
    icon: <AppstoreOutlined />,
    label: 'Dashboard',
    title: 'Dashboard',
    path: '/dashboard',
  },
  {
    key: '/tasks',
    icon: <CheckSquareOutlined />,
    label: 'Quản lý Công việc',
    title: 'Quản lý Công việc',
    path: '/tasks',
  },
  {
    key: '/goods',
    icon: <ShoppingOutlined />,
    label: 'Hàng hóa / Dịch vụ',
    title: 'Hàng hóa / Dịch vụ',
    path: '/goods',
  },
  {
    key: '/suppliers',
    icon: <ShopOutlined />,
    label: 'Nhà cung cấp',
    title: 'Nhà cung cấp',
    path: '/suppliers',
  },
  {
    key: '/users',
    icon: <TeamOutlined />,
    label: 'Quản lý Nhân sự',
    title: 'Quản lý Nhân sự',
    path: '/users',
  },
  {
    key: '/branches',
    icon: <EnvironmentOutlined />,
    label: 'Cơ sở / Chi nhánh',
    title: 'Cơ sở / Chi nhánh',
    path: '/branches',
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'Cài đặt hệ thống',
    title: 'Cài đặt hệ thống',
    path: '/settings',
  },
  {
    key: '/ai-agent',
    icon: <RobotOutlined style={{ color: '#8b5cf6' }} />,
    label: 'Trợ lý AI (Admin)',
    title: 'Trợ lý AI (Admin)',
    path: '/ai-agent',
  },
  {
    key: '/finance',
    icon: <CalculatorOutlined />,
    label: 'Tài chính & Thuế',
    title: 'Tài chính & Thuế',
    path: '/finance',
  },
];
