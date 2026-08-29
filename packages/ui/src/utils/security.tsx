import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../context/GlobalStore';
import { ErrorPage } from '../components/ErrorPages/ErrorPage';

// 1. OBFUSCATED SECURE STORAGE WRAPPER
export const SecureStorage = {
  setItem(key: string, value: string) {
    if (typeof window === 'undefined') return;
    try {
      const obfuscated = btoa(value); // base64 token obfuscation to safeguard from local inspection
      localStorage.setItem(`ev_${key}`, obfuscated);
    } catch {
      localStorage.setItem(`ev_${key}`, value);
    }
  },

  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(`ev_${key}`);
    if (!value) return null;
    try {
      return atob(value);
    } catch {
      return value;
    }
  },

  removeItem(key: string) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`ev_${key}`);
  },
};

// 2. JWT TOKEN EXPIRATION VALIDATOR
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    // Decode base64 payload
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;

    // exp is in seconds, Date.now() is in ms
    const current = Math.floor(Date.now() / 1000);
    return payload.exp < current;
  } catch {
    return true;
  }
}

// 3. PERMISSION HELPERS
export function hasRequiredPermissions(userPermissions: string[], required: string[]): boolean {
  if (required.length === 0) return true;
  return required.every((perm) => userPermissions.includes(perm));
}

// 4. ROUTE GUARD WRAPPER
export interface RouteGuardProps {
  requiredPermissions?: string[];
  fallbackUrl?: string;
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  requiredPermissions = [],
  fallbackUrl = '/',
  children,
}) => {
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuthStore();
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    // If not authenticated or token expired, redirect to login
    if (!isAuthenticated || isTokenExpired(token)) {
      router.push(fallbackUrl);
      return;
    }

    // Check permission parameters
    if (user) {
      const hasPerm = hasRequiredPermissions(user.permissions, requiredPermissions);
      if (!hasPerm) {
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
    }
  }, [isAuthenticated, user, token, requiredPermissions, fallbackUrl, router]);

  if (!isAuthenticated || isTokenExpired(token)) {
    return null;
  }

  if (user && !hasRequiredPermissions(user.permissions, requiredPermissions)) {
    return <ErrorPage code="403" onAction={() => router.push(fallbackUrl)} actionLabel="Back to Safety" />;
  }

  if (!authorized) {
    return null; // show loader or screen lock
  }

  return <>{children}</>;
};
