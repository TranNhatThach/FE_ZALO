import React from 'react';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  TeamOutlined,
  ProfileOutlined,
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
    label: 'Dashboard',
    title: 'Dashboard',
    path: '/dashboard',
  },
  {
    key: 'users',
    icon: <UserOutlined />,
    label: 'User Management',
    title: 'User Management',
    children: [
        {
          key: '/users',
          icon: <TeamOutlined />,
          label: 'All Users',
          title: 'All Users',
          path: '/users',
        },
        {
          key: '/members',
          icon: <TeamOutlined />,
          label: 'Members Dashboard',
          title: 'Members Dashboard',
          path: '/members',
        },
        {
          key: '/users/roles',
          icon: <ProfileOutlined />,
          label: 'Roles',
          title: 'Roles',
          path: '/users/roles',
        },
    ],
  },
  {
    key: 'branches',
    icon: <TeamOutlined />, // or some other icon
    label: 'Branch Management',
    title: 'Branch Management',
    path: '/branches',
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings',
    title: 'Settings',
    path: '/settings',
  },
];
