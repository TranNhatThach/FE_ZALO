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
} as const;
