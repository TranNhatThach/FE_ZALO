// Centralized TanStack Query key constants.
// Use these instead of magic strings to avoid key collisions and enable
// targeted cache invalidation across the app.

export const QUERY_KEYS = {
  AUTH: {
    /** Key for the currently authenticated user (GET /auth/me) */
    ME: ['me'] as const,
  },

  TENANT: {
    /** Key for a specific tenant's config (GET /tenant/:id/config) */
    CONFIG: (tenantId: string) => ['tenantConfig', tenantId] as const,
  },

  TASKS: {
    /** Key for the current user's task list (GET /v1/tasks/my-tasks) */
    MY_TASKS: ['tasks', 'myTasks'] as const,
  },

  PRODUCTS: {
    /** Key for the tenant's product list (GET /v1/products) */
    LIST: ['products', 'list'] as const,
  },
  
  DASHBOARD: {
    /** Key for dashboard summary (GET /v1/dashboard/summary) */
    SUMMARY: ['dashboard', 'summary'] as const,
  },
  
  SUPPLIER: {
    /** Key for the tenant's supplier list (GET /v1/suppliers) */
    LIST: ['suppliers', 'list'] as const,
  },

  INVOICES: {
    /** Key for the tenant's invoice list (GET /v1/invoices) */
    LIST: ['invoices', 'list'] as const,
  },
} as const;
