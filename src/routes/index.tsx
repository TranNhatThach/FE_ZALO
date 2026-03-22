import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { LoginForm } from '../components/auth/LoginForm';
import { NotFoundPage } from '../pages/error/NotFoundPage';
import { ServerErrorPage } from '../pages/error/ServerErrorPage';

// Lazy load pages for performance
const Dashboard = lazy(() => import('../pages/Dashboard'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginForm />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'users',
            element: <div>Users List</div>,
          },
          {
            path: 'users/roles',
            element: <div>Roles List</div>,
          },
          {
            path: 'settings',
            element: <div>Settings Page</div>,
          },
        ],
      },
    ],
  },
  {
    path: '500',
    element: <ServerErrorPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
