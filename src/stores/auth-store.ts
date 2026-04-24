import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authService } from '@/services/auth-service';
import { TokenManager } from '@/lib/token-manager';
import { queryClient } from '@/providers/query-provider';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;

  verify: () => Promise<void>;
  logout: () => void;
  setAuthenticated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: false,
      isLoading: true,
      error: null,
      isInitialized: false,

      verify: async () => {
        const hasToken = typeof window !== 'undefined' && !!TokenManager.getAccessToken();
        const isValid = typeof window !== 'undefined' && TokenManager.isAccessTokenValid();

        if (!hasToken || !isValid) {
          set({ isAuthenticated: false, isLoading: false, isInitialized: true }, false, 'verify/noToken');
          return;
        }

        set({ isLoading: true }, false, 'verify/start');

        try {
          const response = await authService.verifyToken();
          const verified = response.data?.valid !== false;
          set(
            { isAuthenticated: verified, isLoading: false, error: null, isInitialized: true },
            false,
            'verify/success',
          );
        } catch (error) {
          set(
            { isAuthenticated: false, isLoading: false, error: error as Error, isInitialized: true },
            false,
            'verify/error',
          );
        }
      },

      logout: () => {
        TokenManager.clearTokens();
        queryClient.clear();
        set(
          { isAuthenticated: false, isLoading: false, error: null },
          false,
          'logout',
        );
      },

      setAuthenticated: (value) => {
        set({ isAuthenticated: value }, false, 'setAuthenticated');
      },
    }),
    { name: 'auth-store' },
  ),
);
