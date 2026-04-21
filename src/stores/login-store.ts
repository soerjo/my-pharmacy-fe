import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authService } from '@/services/auth-service';
import { TokenManager } from '@/lib/token-manager';
import { useAuthStore } from './auth-store';
import type { LoginFormValues } from '@/types';

interface LoginState {
  isLoading: boolean;
  error: Error | null;

  login: (data: LoginFormValues) => Promise<void>;
  reset: () => void;
}

export const useLoginStore = create<LoginState>()(
  devtools(
    (set) => ({
      isLoading: false,
      error: null,

      login: async (data: LoginFormValues) => {
        set({ isLoading: true, error: null }, false, 'login/start');
        try {
          const response = await authService.login(data);
          if (response.data?.accessToken) {
            TokenManager.setAccessToken(response.data.accessToken);
            TokenManager.setRefreshToken(response.data.refreshToken);
            useAuthStore.getState().setAuthenticated(true);
          }
          set({ isLoading: false }, false, 'login/success');
        } catch (error) {
          set({ isLoading: false, error: error as Error }, false, 'login/error');
          throw error;
        }
      },

      reset: () => {
        set({ isLoading: false, error: null }, false, 'reset');
      },
    }),
    { name: 'login-store' },
  ),
);
