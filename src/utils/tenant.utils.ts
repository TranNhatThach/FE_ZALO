/**
 * Utility to resolve the current tenantId from the URL or Path
 * Example subdomain: apple.saas.com -> Returns 'apple'
 * Example path: /t/apple -> Returns 'apple'
 */
export const extractTenantId = (): string | null => {
  // 1. Check path approach /t/:tenantId
  const pathParts = window.location.pathname.split('/');
  if (pathParts[1] === 't' && pathParts[2]) {
    return pathParts[2];
  }

  // 2. Check subdomain approach (tenant.domain.com)
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Allow for extraction if subdomain exists and it's not www
  if (parts.length >= 3 && parts[0] !== 'www') {
    return parts[0]; 
  }

  return null;
};
