import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authService } from '@/services/auth-service';
import { TokenManager } from '@/lib/token-manager';
import { queryClient } from '@/providers/query-provider';
import type { LoginResponseUser } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;
  permissions: string[];
  roles: string[];
  user: LoginResponseUser | null;

  verify: () => Promise<void>;
  logout: () => void;
  setAuthenticated: (value: boolean) => void;
  setPermissions: (permissions: string[]) => void;
  setRoles: (roles: string[]) => void;
  setUser: (user: LoginResponseUser) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: false,
      isLoading: true,
      error: null,
      isInitialized: false,
      permissions: [],
      roles: [],
      user: null,

      verify: async () => {
        const hasToken = typeof window !== 'undefined' && !!TokenManager.getAccessToken();
        const isValid = typeof window !== 'undefined' && TokenManager.isAccessTokenValid();

        if (!hasToken || !isValid) {
          set({ isAuthenticated: false, isLoading: false, isInitialized: true, user: null, permissions: [], roles: [] }, false, 'verify/noToken');
          return;
        }

        set({ isLoading: true }, false, 'verify/start');

        try {
          const response = await authService.verifyToken();
          const verified = response.data?.valid !== false;
          const user = response.data?.user ?? null;
          const permissions = user?.permissions ?? TokenManager.getTokenPermissions();
          set(
            { isAuthenticated: verified, isLoading: false, error: null, isInitialized: true, user, permissions },
            false,
            'verify/success',
          );
        } catch (error) {
          set(
            { isAuthenticated: false, isLoading: false, error: error as Error, isInitialized: true, user: null, permissions: [], roles: [] },
            false,
            'verify/error',
          );
        }
      },

      logout: () => {
        TokenManager.clearTokens();
        TokenManager.removeStoredUser();
        queryClient.clear();
        set(
          { isAuthenticated: false, isLoading: false, error: null, user: null, permissions: [], roles: [] },
          false,
          'logout',
        );
      },

      setAuthenticated: (value) => {
        set({ isAuthenticated: value }, false, 'setAuthenticated');
      },

      setPermissions: (permissions) => {
        set({ permissions }, false, 'setPermissions');
      },

      setRoles: (roles) => {
        set({ roles }, false, 'setRoles');
      },

      setUser: (user) => {
        set({ user }, false, 'setUser');
      },
    }),
    { name: 'auth-store' },
  ),
);
